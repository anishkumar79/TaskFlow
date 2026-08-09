const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'taskflow-api',
  brokers: [process.env.KAFKA_BROKER || 'redpanda:9092'],
  retry: { retries: 3 },
});

const producer = kafka.producer();
let connected = false;

async function publishTaskEvent(event, task) {
  try {
    if (!connected) {
      await producer.connect();
      connected = true;
    }
    await producer.send({
      topic: 'task-events',
      messages: [{ value: JSON.stringify({ event, task, at: new Date().toISOString() }) }],
    });
  } catch (err) {
    // A down event bus should never take the API down with it.
    console.error('Kafka publish failed:', err.message);
  }
}

module.exports = { publishTaskEvent };
