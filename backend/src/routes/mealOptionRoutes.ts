import { Router, Request, Response } from 'express';
import prisma from '../config/prismaClient';

const router = Router();

// GET /api/meal-options - Listar todas as opções de refeição
router.get('/', async (req: Request, res: Response) => {
  try {
    const mealOptions = await prisma.mealOption.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(mealOptions);
  } catch (error) {
    console.error('Erro ao buscar meal options:', error);
    res.status(500).json({ message: 'Erro ao buscar opções de refeição' });
  }
});

// GET /api/meal-options/:id - Buscar uma opção específica
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    if (!idParam) {
      return res.status(400).json({ message: 'ID é obrigatório' });
    }
    
    const id = parseInt(idParam);
    const mealOption = await prisma.mealOption.findUnique({
      where: { id }
    });
    
    if (!mealOption) {
      return res.status(404).json({ message: 'Opção de refeição não encontrada' });
    }
    
    res.json(mealOption);
  } catch (error) {
    console.error('Erro ao buscar meal option:', error);
    res.status(500).json({ message: 'Erro ao buscar opção de refeição' });
  }
});

// POST /api/meal-options - Criar nova opção de refeição
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }
    
    const mealOption = await prisma.mealOption.create({
      data: {
        name,
        description: description || null
      }
    });
    
    res.status(201).json(mealOption);
  } catch (error) {
    console.error('Erro ao criar meal option:', error);
    res.status(500).json({ message: 'Erro ao criar opção de refeição' });
  }
});

// PUT /api/meal-options/:id - Atualizar opção de refeição
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    if (!idParam) {
      return res.status(400).json({ message: 'ID é obrigatório' });
    }
    
    const id = parseInt(idParam);
    const { name, description } = req.body;
    
    const mealOption = await prisma.mealOption.update({
      where: { id },
      data: {
        name,
        description: description || null
      }
    });
    
    res.json(mealOption);
  } catch (error) {
    console.error('Erro ao atualizar meal option:', error);
    res.status(500).json({ message: 'Erro ao atualizar opção de refeição' });
  }
});

// DELETE /api/meal-options/:id - Excluir opção de refeição
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    if (!idParam) {
      return res.status(400).json({ message: 'ID é obrigatório' });
    }
    
    const id = parseInt(idParam);
    
    // Verificar se há refeições associadas
    const mealsCount = await prisma.meal.count({
      where: { mealOptionId: id }
    });
    
    if (mealsCount > 0) {
      return res.status(400).json({ 
        message: `Não é possível excluir esta opção de refeição. Existem ${mealsCount} refeição(ões) registrada(s) para ela.` 
      });
    }
    
    await prisma.mealOption.delete({
      where: { id }
    });
    
    res.json({ message: 'Opção de refeição excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir meal option:', error);
    res.status(500).json({ message: 'Erro ao excluir opção de refeição' });
  }
});

export default router;
