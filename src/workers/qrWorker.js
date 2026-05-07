const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const db = require('../config/db');
const esimService = require('../services/esimService');
const notificationService = require('../services/notificationService');

const qrWorker = new Worker('qr-queue', async (job) => {
  console.log(`[QR WORKER] Processing job: ${job.name} | ID: ${job.id}`);
  
  if (job.name === 'retrieve-qr') {
    const { orderNo, userId } = job.data;
    
    // Call API to retrieve ICCID and QR Code
    const queryResponse = await esimService.queryEsim(orderNo);
    
    if (queryResponse && queryResponse.success) {
      const { iccid, smdpAddress, activationCode } = queryResponse.obj;
      
      const qrCode = `LPA:1$${smdpAddress}$${activationCode}`;
      
      await db.query(`
        UPDATE esim_orders 
        SET iccid = $1, qr_code = $2, smdp_address = $3, activation_code = $4, status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP
        WHERE order_no = $5
      `, [iccid, qrCode, smdpAddress, activationCode, orderNo]);
      
      // Trigger notification
      if (userId) {
        await notificationService.notifyEsimReady(userId, iccid, qrCode);
      }
      
      console.log(`[QR WORKER] Retrieved QR and ICCID for order ${orderNo}. Marked as COMPLETED.`);
    } else {
      throw new Error(queryResponse?.msg || 'Failed to retrieve QR code');
    }
  }
}, { connection: redisConnection });

qrWorker.on('failed', (job, err) => {
  console.error(`[QR WORKER] Job ${job.id} failed:`, err.message);
});

module.exports = qrWorker;
