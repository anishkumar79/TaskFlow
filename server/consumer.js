require('dotenv').config();
const { Kafka } = require('kafkajs');
const prisma = require('./prisma');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER || 'redpanda:9092'],
  retry: { retries: 10, initialRetryTime: 1000 },
});

const consumer = kafka.consumer({ groupId: 'notification-service' });

function messageFor(event, task) {
  switch (event) {
    case 'task.created':
      return `"${task.title}" was created`;
    case 'task.updated':
      return `"${task.title}" moved to ${task.status.replace('_', ' ').toLowerCase()}`;
    case 'task.deleted':
      return `"${task.title}" was deleted`;
    default:
      return `${event}: ${task.title}`;
  }
}

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'task-events', fromBeginning: false });

  console.log('notification-service: listening on task-events');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const { event, task } = JSON.parse(message.value.toString());

        // A deleted task no longer exists to attach a notification row to —
        // log it and move on rather than writing a dangling foreign key.
        if (event === 'task.deleted') {
          console.log(`notification-service: ${messageFor(event, task)}`);
          return;
        }

        await prisma.notification.create({
          data: { message: messageFor(event, task), taskId: task.id },
        });
        console.log(`notification-service: recorded "${messageFor(event, task)}"`);
      } catch (err) {
        console.error('notification-service: failed to process message', err.message);
      }
    },
  });
}

run().catch((err) => {
  console.error('notification-service crashed:', err);
  process.exit(1);
});
