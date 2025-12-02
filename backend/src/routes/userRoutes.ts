import { Router } from 'express';

const router = Router();

// Rotas básicas - implementar conforme necessário
router.get('/', (req, res) => res.json([]));
router.post('/', (req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
