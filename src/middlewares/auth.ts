declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
    }
  }
}
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  const envSecret = process.env.JWT_SECRET;
  const secret: string = envSecret ? envSecret : '';
  if (!secret) return res.status(500).json({ message: 'JWT_SECRET não configurado no servidor' });
  // @ts-ignore
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    (req as any).user = user;
    next();
  });
}
