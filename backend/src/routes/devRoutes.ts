import { Router } from 'express';

const router = Router();

type DevUser = { id: number; name: string; email: string; role: string; active: boolean };

const users: DevUser[] = [
  { id: 1, name: 'Dev Admin', email: 'devadmin@example.com', role: 'admin', active: true },
];

router.get('/users', (_req, res) => {
  res.json(users);
});

router.post('/users', (req, res) => {
  const { name, email, role, active } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'name and email required' });
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const user = { id, name, email, role: role || 'scanner', active: active ?? true };
  users.push(user);
  res.status(201).json(user);
});

export default router;
