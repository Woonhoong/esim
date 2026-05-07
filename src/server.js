require('dotenv').config();
const app = require('./app');
const scheduleJobs = require('./jobs/scheduler');

// Start Workers
require('./workers/syncWorker');
require('./workers/orderWorker');
require('./workers/qrWorker');
require('./workers/usageWorker');
require('./workers/webhookWorker');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Start recurring jobs
    await scheduleJobs();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
