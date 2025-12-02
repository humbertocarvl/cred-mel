"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateParticipants = exports.updateParticipant = exports.createParticipant = exports.getParticipants = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const getParticipants = async (req, res) => {
    try {
        // support query param ?credenciada=true to return only credentialed participants
            const { credenciada, credencial } = req.query;
        const where = {};
            if (typeof credenciada === 'string' && credenciada.trim() !== '') {
            const val = credenciada.trim().toLowerCase();
            if (val === 'true' || val === '1')
                where.credenciada = true;
            else if (val === 'false' || val === '0')
                where.credenciada = false;
        }
            if (typeof credencial === 'string' && credencial.trim() !== '') {
                where.credencial = credencial.trim();
            }
        const participants = await prismaClient_1.default.participant.findMany({ where });
        res.json(participants);
    }
    catch (error) {
        console.error('Erro ao buscar participantes:', error);
        res.status(500).json({ error: 'Erro ao buscar participantes', details: error });
    }
};
exports.getParticipants = getParticipants;
const createParticipant = async (req, res) => {
    try {
        const { name, city, state, email, whatsapp, contribuicao, alojamento, tipoInscricao } = req.body;
        const participant = await prismaClient_1.default.participant.create({
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
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao criar participante', details: error?.message || error });
    }
};
exports.createParticipant = createParticipant;
const updateParticipant = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id))
            return res.status(400).json({ message: 'ID inválido' });
        const { name, city, state, email, whatsapp, contribuicao, alojamento, tipoInscricao, credenciada, credencial } = req.body;
        const data = {};
        if (typeof name === 'string')
            data.name = name;
        if (typeof city === 'string')
            data.city = city;
        if (typeof state === 'string')
            data.state = state;
        if (typeof email === 'string')
            data.email = email;
        if (typeof whatsapp === 'string')
            data.whatsapp = whatsapp;
        if (typeof contribuicao !== 'undefined')
            data.contribuicao = !!contribuicao;
        if (typeof alojamento !== 'undefined')
            data.alojamento = !!alojamento;
        if (typeof tipoInscricao === 'string')
            data.tipoInscricao = tipoInscricao;
        if (typeof credenciada !== 'undefined') {
            data.credenciada = !!credenciada;
            if (credenciada)
                data.credenciada_em = new Date();
            else
                data.credenciada_em = null;
        }
        if (typeof credencial === 'string')
            data.credencial = credencial;
        const updated = await prismaClient_1.default.participant.update({ where: { id }, data });
        return res.json(updated);
    }
    catch (err) {
        console.error('Erro ao atualizar participante:', err);
        if (err.code === 'P2025')
            return res.status(404).json({ message: 'Participante não encontrado' });
        return res.status(500).json({ message: 'Erro ao atualizar participante', details: err === null || err === void 0 ? void 0 : err.message || err });
    }
};
exports.updateParticipant = updateParticipant;
// POST /api/participants/bulk
const bulkCreateParticipants = async (req, res) => {
    try {
        const rows = req.body;
        if (!Array.isArray(rows))
            return res.status(400).json({ message: 'Payload deve ser um array' });
        const errors = [];
        const valid = [];
        function normalizeTipoInscricao(raw) {
            if (!raw)
                return undefined;
            const v = String(raw).trim().toLowerCase();
            if (['participante', 'participantes', 'acreditada', 'acreditado'].includes(v))
                return 'participante';
            if (['organizacao', 'organização', 'org', 'organizacoes', 'organizacao'].includes(v))
                return 'organizacao';
            if (['comunicacao', 'comunicação', 'com'].includes(v))
                return 'comunicacao';
            if (['parlamentar', 'parlamentares'].includes(v))
                return 'parlamentar';
            return undefined;
        }
        rows.forEach((r, idx) => {
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
        const emails = valid.filter(v => v.email).map(v => v.email);
        const existing = emails.length > 0 ? await prismaClient_1.default.participant.findMany({ where: { email: { in: emails } }, select: { email: true } }) : [];
        const existingSet = new Set(existing.map((e) => e.email));
        const toInsert = valid.filter(v => !(v.email && existingSet.has(v.email)));
        const skipped = valid.filter(v => v.email && existingSet.has(v.email)).length;
        let created = 0;
        if (toInsert.length > 0) {
            const result = await prismaClient_1.default.participant.createMany({ data: toInsert });
            created = result.count ?? 0;
        }
        return res.json({ created, skipped, errors });
    }
    catch (err) {
        console.error('bulkCreateParticipants error', err);
        return res.status(500).json({ message: 'Erro ao importar em massa', details: err?.message || err });
    }
};
exports.bulkCreateParticipants = bulkCreateParticipants;
//# sourceMappingURL=ParticipantController.js.map