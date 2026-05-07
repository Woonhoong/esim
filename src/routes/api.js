const express = require('express');
const { createOrder, getPackages } = require('../controllers/esimController');
const { handleWebhook } = require('../controllers/webhookController');

const router = express.Router();

router.get('/packages', getPackages);
router.post('/order', createOrder);

router.post('/webhooks/esimaccess', handleWebhook);

module.exports = router;
