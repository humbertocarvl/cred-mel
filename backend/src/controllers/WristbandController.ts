import { Request, Response } from 'express';

export const assignWristband = async (req: Request, res: Response) => {
  // TODO: Vincular pulseira à participante
  res.status(201).json({});
};

export const getUnassignedParticipants = async (req: Request, res: Response) => {
  // TODO: Buscar participantes sem pulseira
  res.json([]);
};
