const { syncQueue, usageQueue } = require('../workers/queues');

const scheduleJobs = async () => {
  console.log('[SCHEDULER] Setting up repeatable jobs...');
  
  // 1. Sync Regions Workflow (Every 6 hours)
  await syncQueue.add('sync-regions', {}, {
    repeat: {
      pattern: '0 */6 * * *' // Every 6 hours
    }
  });

  // 2. Sync Packages Workflow (Every 1 hour)
  await syncQueue.add('sync-packages', {}, {
    repeat: {
      pattern: '0 * * * *' // Every 1 hour
    }
  });

  // 7. Usage Monitoring Workflow (Every 3 hours)
  await usageQueue.add('check-usage', {}, {
    repeat: {
      pattern: '0 */3 * * *' // Every 3 hours
    }
  });
  
  console.log('[SCHEDULER] Repeatable jobs scheduled.');
};

module.exports = scheduleJobs;
