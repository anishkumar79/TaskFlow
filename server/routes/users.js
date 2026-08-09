const express = require('express');
const prisma = require('../prisma');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Lightweight teammate directory used by the assignee picker.
router.get('/', async (req, res) => {
  const q = req.query.q?.trim();
  const users = await prisma.user.findMany({
    where: q
      ? { OR: [{ email: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }] }
      : undefined,
    select: { id: true, name: true, email: true },
    take: 20,
  });
  res.json(users);
});

module.exports = router;
