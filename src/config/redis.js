require('dotenv').config();
const Redis = require('ioredis');

const redisOptions = {
  maxRetriesPerRequest: null, // Required by bullmq
  ...(process.env.REDIS_URL && process.env.REDIS_URL.startsWith('rediss://') && {
    tls: { rejectUnauthorized: false }
  })
};

const connectionString = process.env.REDIS_URL;
const connection = connectionString ? new Redis(connectionString, redisOptions) : new Redis(redisOptions);

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = connection;
