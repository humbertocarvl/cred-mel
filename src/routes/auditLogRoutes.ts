import { Router } from 'express';
import { getAuditLogs } from '../controllers/AuditLogController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/', authenticateJWT, getAuditLogs);

export default router;
