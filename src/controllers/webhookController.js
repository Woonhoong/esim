const { webhookQueue } = require('../workers/queues');

const handleWebhook = async (req, res) => {
  try {
    const payload = req.body;
    
    // Ensure we have a notifyId
    if (!payload.notifyId) {
      return res.status(400).json({ error: 'Missing notifyId' });
    }
    
    // Push the payload to webhook processing queue
    await webhookQueue.add('process-webhook', payload);
    
    // Respond to the API to acknowledge receipt quickly
    res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  handleWebhook
};
