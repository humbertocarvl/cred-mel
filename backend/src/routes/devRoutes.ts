import { Router } from 'express';

const router = Router();

// Dev routes - sem autenticação para testes
router.get('/reset', (req, res) => {
  res.json({ message: 'Dev route' });
});

export default router;
