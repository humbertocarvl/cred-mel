
import express, { Request, Response } from 'express';
import prisma from './config/prismaClient';
import cors from 'cors';
import dotenv from 'dotenv';


import userRoutes from './routes/userRoutes';
import participantRoutes from './routes/participantRoutes';
import wristbandRoutes from './routes/wristbandRoutes';
import mealRoutes from './routes/mealRoutes';
import auditLogRoutes from './routes/auditLogRoutes';
import authRoutes from './routes/authRoutes';
import mealOptionRoutes from './routes/mealOptionRoutes';
import devRoutes from './routes/devRoutes';

dotenv.config();

const app = express();
app.set('prisma', prisma);

// CORS: permitir envio por formulários do painel e preflight (OPTIONS)
const corsOptions = {
  origin: true, // permite qualquer origem; para produção, substitua por array/funcão que valide domínios
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // responde a preflight sem passar por auth

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('API Credenciamento e Refeições - Backend');
});

app.get('/api/_health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas principais

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/wristbands', wristbandRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/meal-options', mealOptionRoutes);
// Dev-only endpoints (no auth) to ease frontend testing
app.use('/api/_dev', devRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
