const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const db = require('../config/db');
const { qrQueue } = require('./queues');

const webhookWorker = new Worker('webhook-queue', async (job) => {
  console.log(`[WEBHOOK WORKER] Processing job: ${job.name} | ID: ${job.id}`);
  
  if (job.name === 'process-webhook') {
    const payload = job.data;
    const { notifyId, notifyType, orderNo } = payload;
    
    // Deduplicate notifyId
    const { rowCount } = await db.query('SELECT id FROM webhook_logs WHERE notify_id = $1', [notifyId]);
    if (rowCount > 0) {
      console.log(`[WEBHOOK WORKER] Duplicate notifyId: ${notifyId}. Skipping.`);
      return;
    }
    
    // Log the webhook
    await db.query(`
      INSERT INTO webhook_logs (notify_id, notify_type, order_no, payload)
      VALUES ($1, $2, $3, $4)
    `, [notifyId, notifyType, orderNo, JSON.stringify(payload)]);
    
    // Handle specific types
    if (notifyType === 'ORDER_STATUS') {
      const { status } = payload; // Assuming payload contains status
      // When ORDER_STATUS = GOT_RESOURCE, trigger QR retrieval
      if (status === 'GOT_RESOURCE') {
        const { rows } = await db.query('SELECT user_id FROM esim_orders WHERE order_no = $1', [orderNo]);
        const userId = rows.length > 0 ? rows[0].user_id : null;
        
        await qrQueue.add('retrieve-qr', { orderNo, userId });
      } else {
        await db.query('UPDATE esim_orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_no = $2', [status, orderNo]);
      }
    } else if (notifyType === 'ESIM_STATUS') {
      const { status } = payload;
      await db.query('UPDATE esim_orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_no = $2', [status, orderNo]);
    } else if (notifyType === 'DATA_USAGE') {
      // Could also process immediate usage updates here
    } else if (notifyType === 'VALIDITY_USAGE' || notifyType === 'SMDP_EVENT') {
      // Handle lifecycle events, could just remain logged in webhook_logs
    }
  }
}, { connection: redisConnection });

module.exports = webhookWorker;
