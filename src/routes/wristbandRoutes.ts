import { Router } from 'express';
import { assignWristband, getUnassignedParticipants } from '../controllers/WristbandController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.post('/assign', authenticateJWT, assignWristband);
router.get('/unassigned', authenticateJWT, getUnassignedParticipants);

export default router;
