import { Router } from 'express';
import { getParticipants, createParticipant, updateParticipant, bulkCreateParticipants } from '../controllers/ParticipantController';

const router = Router();

router.get('/', getParticipants);
router.post('/', createParticipant);
router.put('/:id', updateParticipant);
router.post('/bulk', bulkCreateParticipants);

export default router;
