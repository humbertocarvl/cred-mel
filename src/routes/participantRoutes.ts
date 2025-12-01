import { Router } from 'express';
import { getParticipants, createParticipant, updateParticipant, bulkCreateParticipants } from '../controllers/ParticipantController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/', authenticateJWT, getParticipants);
router.post('/', authenticateJWT, createParticipant);
router.post('/bulk', authenticateJWT, bulkCreateParticipants);
router.put('/:id', authenticateJWT, updateParticipant);

export default router;
