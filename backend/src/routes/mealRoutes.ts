import { Router } from 'express';
import { registerMeal, getMeals } from '../controllers/MealController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

// create meal (scanner posts to POST /api/meals)
router.post('/', authenticateJWT, registerMeal);
router.post('/register', authenticateJWT, registerMeal);
router.get('/', authenticateJWT, getMeals);

export default router;
