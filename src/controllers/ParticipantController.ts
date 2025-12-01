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
  // TODO: Atualizar participante
  res.json({});
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
        city: r.city ?? null,
        state: r.state ?? null,
        email: r.email ? String(r.email).trim().toLowerCase() : null,
        whatsapp: r.whatsapp ?? null,
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
