const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const db = require('../config/db');
const esimService = require('../services/esimService');

const orderWorker = new Worker('order-queue', async (job) => {
  console.log(`[ORDER WORKER] Processing job: ${job.name} | ID: ${job.id}`);
  
  if (job.name === 'create-order') {
    const { userId, transactionId, packageCode } = job.data;
    
    // Call eSIMAccess API to create order
    const orderResponse = await esimService.createOrder(transactionId, packageCode);
    
    if (orderResponse && orderResponse.success) {
      const orderNo = orderResponse.obj.orderNo;
      
      // Store pending order
      await db.query(`
        UPDATE esim_orders 
        SET order_no = $1, status = 'API_PENDING', updated_at = CURRENT_TIMESTAMP
        WHERE transaction_id = $2
      `, [orderNo, transactionId]);
      
      console.log(`[ORDER WORKER] Created order ${orderNo} for transaction ${transactionId}`);
      // Now wait for webhook event to update status further.
    } else {
      throw new Error(orderResponse?.msg || 'Failed to create order');
    }
  }
}, { connection: redisConnection });

orderWorker.on('failed', (job, err) => {
  console.error(`[ORDER WORKER] Job ${job.id} failed:`, err.message);
  // Dead-letter logic is handled by BullMQ's default fail queue.
});

module.exports = orderWorker;
