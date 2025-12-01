import { Router } from 'express';
import { getMealOptions, createMealOption, updateMealOption, deleteMealOption } from '../controllers/MealOptionController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/', authenticateJWT, getMealOptions);
router.post('/', authenticateJWT, createMealOption);
router.put('/:id', authenticateJWT, updateMealOption);
router.delete('/:id', authenticateJWT, deleteMealOption);

export default router;
