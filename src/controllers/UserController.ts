import { Request, Response } from 'express';
import prisma from '../config/prismaClient';
import bcrypt from 'bcryptjs';

type CreateUserBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  active?: boolean;
};

// GET /api/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, active: true },
      orderBy: { id: 'asc' },
    });
    return res.json(users);
  } catch (err) {
    console.error('getUsers error', err);
    return res.status(500).json({ message: 'Erro ao buscar usuárias' });
  }
};

// POST /api/users
export const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateUserBody;
    const { name, email, password, role, active } = body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }

    const pwd: string = password ?? '';
    const hashed = await bcrypt.hash(pwd, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'scanner', active: active ?? true },
    });

    const { password: _p, ...rest } = user as any;
    return res.status(201).json(rest);
  } catch (err: any) {
    console.error('createUser error', err);
    if (err?.code === 'P2002') return res.status(409).json({ message: 'E-mail já cadastrado' });
    return res.status(500).json({ message: 'Erro ao criar usuária' });
  }
};

// PUT /api/users/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const idStr = req.params.id;
    if (!idStr) return res.status(400).json({ message: 'ID ausente' });
    const id = parseInt(idStr, 10);
    const body = req.body as CreateUserBody;
    const { name, email, password, role, active } = body;

    const data: any = { name, email, role, active };
    if (password) {
      const pwd2: string = password ?? '';
      data.password = await bcrypt.hash(pwd2, 10);
    }

    const user = await prisma.user.update({ where: { id }, data });
    const { password: _p, ...rest } = user as any;
    return res.json(rest);
  } catch (err: any) {
    console.error('updateUser error', err);
    return res.status(500).json({ message: 'Erro ao atualizar usuária' });
  }
};

// PATCH /api/users/:id/toggle
export const toggleUser = async (req: Request, res: Response) => {
  try {
    const idStr = req.params.id;
    if (!idStr) return res.status(400).json({ message: 'ID ausente' });
    const id = parseInt(idStr, 10);
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Usuária não encontrada' });
    const user = await prisma.user.update({ where: { id }, data: { active: !existing.active } });
    const { password: _p, ...rest } = user as any;
    return res.json(rest);
  } catch (err) {
    console.error('toggleUser error', err);
    return res.status(500).json({ message: 'Erro ao alternar status da usuária' });
  }
};
