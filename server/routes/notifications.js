const express = require('express');
const prisma = require('../prisma');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Activity feed: notifications for tasks the current user created or is
// assigned to. Rows here are written by the standalone consumer process
// (consumer.js) as it reads events off the task-events topic.
router.get('/', async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: {
      task: { OR: [{ createdById: req.userId }, { assignedToId: req.userId }] },
    },
    include: { task: { select: { id: true, title: true } } },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
  res.json(notifications);
});

module.exports = router;
