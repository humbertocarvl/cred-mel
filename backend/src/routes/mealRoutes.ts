import { Router, Request, Response } from 'express';
import prisma from '../config/prismaClient';

const router = Router();

// GET /api/meals - Listar todas as refeições
router.get('/', async (req: Request, res: Response) => {
  try {
    const meals = await prisma.meal.findMany({
      include: {
        participant: true,
        mealOption: true
      },
      orderBy: { date: 'desc' }
    });
    res.json(meals);
  } catch (error) {
    console.error('Erro ao buscar meals:', error);
    res.status(500).json({ message: 'Erro ao buscar refeições' });
  }
});

// POST /api/meals - Registrar nova refeição
router.post('/', async (req: Request, res: Response) => {
  try {
    const { participantId, mealOptionId, date } = req.body;
    
    const meal = await prisma.meal.create({
      data: {
        participantId,
        mealOptionId,
        date: date || new Date()
      },
      include: {
        participant: true,
        mealOption: true
      }
    });
    
    res.status(201).json(meal);
  } catch (error) {
    console.error('Erro ao criar meal:', error);
    res.status(500).json({ message: 'Erro ao registrar refeição' });
  }
});

export default router;
