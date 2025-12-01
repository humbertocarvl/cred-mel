"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await prismaClient_1.default.user.findMany({
            select: { id: true, name: true, email: true, role: true, active: true },
            orderBy: { id: 'asc' },
        });
        return res.json(users);
    }
    catch (err) {
        console.error('getUsers error', err);
        return res.status(500).json({ message: 'Erro ao buscar usuárias' });
    }
};
exports.getUsers = getUsers;
// POST /api/users
const createUser = async (req, res) => {
    try {
        const body = req.body;
        const { name, email, password, role, active } = body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
        }
        const pwd = password ?? '';
        const hashed = await bcryptjs_1.default.hash(pwd, 10);
        const user = await prismaClient_1.default.user.create({
            data: { name, email, password: hashed, role: role || 'scanner', active: active ?? true },
        });
        const { password: _p, ...rest } = user;
        return res.status(201).json(rest);
    }
    catch (err) {
        console.error('createUser error', err);
        if (err?.code === 'P2002')
            return res.status(409).json({ message: 'E-mail já cadastrado' });
        return res.status(500).json({ message: 'Erro ao criar usuária' });
    }
};
exports.createUser = createUser;
// PUT /api/users/:id
const updateUser = async (req, res) => {
    try {
        const idStr = req.params.id;
        if (!idStr)
            return res.status(400).json({ message: 'ID ausente' });
        const id = parseInt(idStr, 10);
        const body = req.body;
        const { name, email, password, role, active } = body;
        const data = { name, email, role, active };
        if (password) {
            const pwd2 = password ?? '';
            data.password = await bcryptjs_1.default.hash(pwd2, 10);
        }
        const user = await prismaClient_1.default.user.update({ where: { id }, data });
        const { password: _p, ...rest } = user;
        return res.json(rest);
    }
    catch (err) {
        console.error('updateUser error', err);
        return res.status(500).json({ message: 'Erro ao atualizar usuária' });
    }
};
exports.updateUser = updateUser;
// PATCH /api/users/:id/toggle
const toggleUser = async (req, res) => {
    try {
        const idStr = req.params.id;
        if (!idStr)
            return res.status(400).json({ message: 'ID ausente' });
        const id = parseInt(idStr, 10);
        const existing = await prismaClient_1.default.user.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ message: 'Usuária não encontrada' });
        const user = await prismaClient_1.default.user.update({ where: { id }, data: { active: !existing.active } });
        const { password: _p, ...rest } = user;
        return res.json(rest);
    }
    catch (err) {
        console.error('toggleUser error', err);
        return res.status(500).json({ message: 'Erro ao alternar status da usuária' });
    }
};
exports.toggleUser = toggleUser;
//# sourceMappingURL=UserController.js.map