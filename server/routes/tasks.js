const express = require('express');
const prisma = require('../prisma');
const requireAuth = require('../middleware/auth');
const { getClient } = require('../redisClient');
const { publishTaskEvent } = require('../kafka');

const router = express.Router();
router.use(requireAuth);

const cacheKey = (userId) => `tasks:${userId}`;
const CACHE_TTL_SECONDS = 30;

const taskInclude = {
  createdBy: { select: { id: true, name: true, email: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
};

async function invalidateCache(userIds) {
  const redis = await getClient();
  await Promise.all(userIds.filter(Boolean).map((id) => redis.del(cacheKey(id))));
}

// Every task the user created or is assigned to. Cached for 30s per user
// because this is the one endpoint the board polls most often.
router.get('/', async (req, res) => {
  const redis = await getClient();
  const key = cacheKey(req.userId);

  const cached = await redis.get(key);
  if (cached) return res.json(JSON.parse(cached));

  const tasks = await prisma.task.findMany({
    where: { OR: [{ createdById: req.userId }, { assignedToId: req.userId }] },
    include: taskInclude,
    orderBy: { createdAt: 'desc' },
  });

  await redis.setEx(key, CACHE_TTL_SECONDS, JSON.stringify(tasks));
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title, description, assignedToId } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'title is required' });

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      createdById: req.userId,
      assignedToId: assignedToId || null,
    },
    include: taskInclude,
  });

  await invalidateCache([req.userId, assignedToId]);
  await publishTaskEvent('task.created', task);

  res.status(201).json(task);
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  if (existing.createdById !== req.userId && existing.assignedToId !== req.userId) {
    return res.status(403).json({ error: 'You do not have access to this task' });
  }

  const { title, description, status, assignedToId } = req.body;
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(assignedToId !== undefined && { assignedToId }),
    },
    include: taskInclude,
  });

  await invalidateCache([existing.createdById, existing.assignedToId, task.assignedToId]);
  await publishTaskEvent('task.updated', task);

  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  if (existing.createdById !== req.userId) {
    return res.status(403).json({ error: 'Only the task creator can delete it' });
  }

  await prisma.notification.deleteMany({ where: { taskId: id } });
  await prisma.task.delete({ where: { id } });
  await invalidateCache([existing.createdById, existing.assignedToId]);
  await publishTaskEvent('task.deleted', existing);

  res.status(204).send();
});

module.exports = router;
