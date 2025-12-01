import { Request, Response } from 'express';
import prisma from '../config/prismaClient';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) return res.status(401).json({ message: 'Usuário não encontrado ou inativo' });
  const valid = await comparePassword(password as string, user.password);
  if (!valid) return res.status(401).json({ message: 'Senha inválida' });
  const token = generateToken({ id: user.id, role: user.role });
  res.json({ token });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const hash = await hashPassword(password!);
  const user = await prisma.user.create({ data: { name, email, password: hash, role } });
  res.status(201).json(user);
};
