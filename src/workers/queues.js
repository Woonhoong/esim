const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

// Workflows required:
// 1. Sync Regions Workflow (Every 6 hours)
// 2. Sync Packages Workflow (Every 1 hour)
// 3. Create Order Workflow (Retry failed requests, wait for webhook)
// 5. QR Retrieval Workflow (When order status = GOT_RESOURCE)
// 7. Usage Monitoring Workflow (Every 3 hours)

const queueOptions = {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000 // 5s, 10s, 20s...
    },
    removeOnComplete: true,
    removeOnFail: false
  }
};

const syncQueue = new Queue('sync-queue', queueOptions);
const orderQueue = new Queue('order-queue', queueOptions);
const qrQueue = new Queue('qr-queue', queueOptions);
const usageQueue = new Queue('usage-queue', queueOptions);
const webhookQueue = new Queue('webhook-queue', queueOptions);

module.exports = {
  syncQueue,
  orderQueue,
  qrQueue,
  usageQueue,
  webhookQueue
};
