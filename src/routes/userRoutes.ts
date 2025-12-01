import { Router } from 'express';
import { getUsers, createUser, updateUser, toggleUser } from '../controllers/UserController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/', authenticateJWT, getUsers);
router.post('/', authenticateJWT, createUser);
router.put('/:id', authenticateJWT, updateUser);
router.patch('/:id/toggle', authenticateJWT, toggleUser);

export default router;
