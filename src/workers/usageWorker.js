const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const db = require('../config/db');
const esimService = require('../services/esimService');
const notificationService = require('../services/notificationService');

const usageWorker = new Worker('usage-queue', async (job) => {
  console.log(`[USAGE WORKER] Processing job: ${job.name} | ID: ${job.id}`);
  
  if (job.name === 'check-usage') {
    // Get all active orders
    const { rows: activeOrders } = await db.query(`
      SELECT o.order_no, o.iccid, o.user_id, p.data_limit
      FROM esim_orders o
      JOIN esim_packages p ON o.package_code = p.package_code
      WHERE o.status = 'COMPLETED'
    `);
    
    for (const order of activeOrders) {
      try {
        const usageResponse = await esimService.queryUsage(order.order_no);
        
        if (usageResponse && usageResponse.success) {
          const { totalData, usedData, remainingData, status } = usageResponse.obj;
          
          let usagePercentage = 0;
          if (totalData > 0) {
            usagePercentage = (usedData / totalData) * 100;
          }
          
          await db.query(`
            INSERT INTO usage_logs (order_no, iccid, total_data, used_data, remaining_data, usage_percentage, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [order.order_no, order.iccid, totalData, usedData, remainingData, usagePercentage, status]);
          
          // Triggers for low data alerts
          if (usagePercentage >= 80 && usagePercentage < 100) {
            await notificationService.notifyDataWarning(order.user_id, usagePercentage.toFixed(2));
          } else if (usagePercentage >= 100) {
            await notificationService.notifyDataWarning(order.user_id, 100);
          }
        }
      } catch (err) {
        console.error(`[USAGE WORKER] Failed to query usage for ${order.order_no}:`, err.message);
      }
    }
  }
}, { connection: redisConnection });

module.exports = usageWorker;
