import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

export const getParticipants = async (req: Request, res: Response) => {
  try {
    // support query param ?credenciada=true to return only credentialed participants
    const { credenciada } = req.query;
    const where: any = {};

    if (typeof credenciada === 'string') {
      const val = credenciada.trim().toLowerCase();
      if (val === 'true' || val === '1') where.credenciada = true;
      else if (val === 'false' || val === '0') where.credenciada = false;
    }

    const participants = await prisma.participant.findMany({ where });
    res.json(participants);
  } catch (error) {
    console.error('Erro ao buscar participantes:', error);
    res.status(500).json({ error: 'Erro ao buscar participantes', details: error });
  }
};

export const createParticipant = async (req: Request, res: Response) => {
  try {
    const { name, city, state, email, whatsapp, contribuicao, alojamento, tipoInscricao } = req.body;
    const participant = await prisma.participant.create({
      data: {
        name,
        city,
        state,
        email,
        whatsapp,
        contribuicao,
        alojamento,
        tipoInscricao,
      },
    });
    res.status(201).json(participant);
  } catch (error: any) {
    res.status(400).json({ error: 'Erro ao criar participante', details: error?.message || error });
  }
};

export const updateParticipant = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    const { name, city, state, email, whatsapp, contribuicao, alojamento, tipoInscricao, credenciada, credencial } = req.body;

    const data: any = {};
    if (typeof name === 'string') data.name = name;
    if (typeof city === 'string') data.city = city;
    if (typeof state === 'string') data.state = state;
    if (typeof email === 'string') data.email = email;
    if (typeof whatsapp === 'string') data.whatsapp = whatsapp;
    if (typeof contribuicao !== 'undefined') data.contribuicao = !!contribuicao;
    if (typeof alojamento !== 'undefined') data.alojamento = !!alojamento;
    if (typeof tipoInscricao === 'string') data.tipoInscricao = tipoInscricao as any;

    // Credenciamento: se for true, grava timestamp; se false, remove timestamp
    if (typeof credenciada !== 'undefined') {
      data.credenciada = !!credenciada;
      if (credenciada) data.credenciada_em = new Date();
      else data.credenciada_em = null;
    }

    if (typeof credencial === 'string') data.credencial = credencial;

    const updated = await prisma.participant.update({ where: { id }, data });
    return res.json(updated);
  } catch (err: any) {
    console.error('Erro ao atualizar participante:', err);
    if (err.code === 'P2025') return res.status(404).json({ message: 'Participante não encontrado' });
    return res.status(500).json({ message: 'Erro ao atualizar participante', details: err?.message || err });
  }
};

// POST /api/participants/bulk
export const bulkCreateParticipants = async (req: Request, res: Response) => {
  try {
    const rows = req.body;
    if (!Array.isArray(rows)) return res.status(400).json({ message: 'Payload deve ser um array' });

    const errors: Array<{ row: number; message: string }> = [];
    const valid: Array<any> = [];
    function normalizeTipoInscricao(raw?: any): 'comunicacao' | 'organizacao' | 'parlamentar' | 'participante' | undefined {
      if (!raw) return undefined;
      const v = String(raw).trim().toLowerCase();
      if (['participante', 'participantes', 'acreditada', 'acreditado'].includes(v)) return 'participante';
      if (['organizacao', 'organização', 'org', 'organizacoes', 'organizacao'].includes(v)) return 'organizacao';
      if (['comunicacao', 'comunicação', 'com'].includes(v)) return 'comunicacao';
      if (['parlamentar', 'parlamentares'].includes(v)) return 'parlamentar';
      return undefined;
    }

    rows.forEach((r: any, idx: number) => {
      // require name; email may be missing
      if (!r || !r.name) {
        errors.push({ row: idx + 2, message: 'Campos obrigatórios ausentes (name)' });
        return;
      }

      const tipo = normalizeTipoInscricao(r.tipoInscricao);
      if (!tipo) {
        errors.push({ row: idx + 2, message: 'tipoInscricao inválido ou ausente' });
        return;
      }

      valid.push({
        name: String(r.name),
        city: r.city ? String(r.city) : '',
        state: r.state ? String(r.state) : '',
        email: r.email ? String(r.email).trim().toLowerCase() : '',
        whatsapp: r.whatsapp ? String(r.whatsapp) : '',
        contribuicao: !!r.contribuicao,
        alojamento: !!r.alojamento,
        tipoInscricao: tipo,
      });
    });

    // Only consider deduplication by email for rows that have an email
    const emails = valid.filter(v => v.email).map(v => v.email as string);
    const existing = emails.length > 0 ? await prisma.participant.findMany({ where: { email: { in: emails } }, select: { email: true } }) : [];
    const existingSet = new Set(existing.map((e: { email: string }) => e.email));

    const toInsert = valid.filter(v => !(v.email && existingSet.has(v.email)));
    const skipped = valid.filter(v => v.email && existingSet.has(v.email)).length;

    let created = 0;
    if (toInsert.length > 0) {
      const result = await prisma.participant.createMany({ data: toInsert });
      created = (result as any).count ?? 0;
    }

    return res.json({ created, skipped, errors });
  } catch (err: any) {
    console.error('bulkCreateParticipants error', err);
    return res.status(500).json({ message: 'Erro ao importar em massa', details: err?.message || err });
  }
};
