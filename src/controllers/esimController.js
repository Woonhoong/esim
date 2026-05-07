const db = require('../config/db');
const { orderQueue } = require('../workers/queues');
const crypto = require('crypto');

const createOrder = async (req, res) => {
  try {
    const { userId, packageCode } = req.body;
    
    // In a real app, validate payment here
    
    // Generate transactionId
    const transactionId = `TXN-${crypto.randomUUID()}`;
    
    // Insert pending order
    await db.query(`
      INSERT INTO esim_orders (user_id, transaction_id, package_code, status)
      VALUES ($1, $2, $3, 'PENDING')
    `, [userId, transactionId, packageCode]);
    
    // Add job to order queue to call API
    await orderQueue.add('create-order', {
      userId,
      transactionId,
      packageCode
    });
    
    res.status(200).json({ success: true, transactionId, message: 'Order initiated.' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getPackages = async (req, res) => {
  try {
    const { locationCode } = req.query;
    let query = 'SELECT * FROM esim_packages WHERE status = $1';
    let params = ['ACTIVE'];
    
    if (locationCode) {
      query += ' AND location_code = $2';
      params.push(locationCode);
    }
    
    const { rows } = await db.query(query, params);
    res.status(200).json({ success: true, packages: rows });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  createOrder,
  getPackages
};
