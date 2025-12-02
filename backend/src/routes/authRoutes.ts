import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Auth not implemented - use dev mode' });
});

export default router;
