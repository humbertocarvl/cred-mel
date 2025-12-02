import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => res.json([]));
router.post('/', (req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
