import { Request, Response } from 'express';

export const getMealOptions = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma');
  const options = await prisma.mealOption.findMany();
  res.json(options);
};

export const createMealOption = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma');
  const { name, description } = req.body;
  const option = await prisma.mealOption.create({ data: { name, description } });
  res.status(201).json(option);
};

export const updateMealOption = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma');
  const { id } = req.params;
  const { name, description } = req.body;
  const option = await prisma.mealOption.update({
    where: { id: Number(id) },
    data: { name, description },
  });
  res.json(option);
};

export const deleteMealOption = async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma');
  const { id } = req.params;
  await prisma.mealOption.delete({ where: { id: Number(id) } });
  res.status(204).send();
};
