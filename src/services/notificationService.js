const notificationService = {
  notifyUser: async (userId, type, payload) => {
    // In a real scenario, integrate with SES, SendGrid, or SMS API
    console.log(`[NOTIFICATION] To User ${userId} | Type: ${type}`);
    console.log(`[NOTIFICATION PAYLOAD]`, payload);
  },

  notifyEsimReady: async (userId, iccid, qrCode) => {
    await notificationService.notifyUser(userId, 'ESIM_READY', { iccid, qrCode });
  },

  notifyDataWarning: async (userId, percentage) => {
    await notificationService.notifyUser(userId, 'DATA_WARNING', {
      message: `You have used ${percentage}% of your data. Consider topping up soon.`
    });
  },

  notifyExpiryWarning: async (userId, daysLeft) => {
    await notificationService.notifyUser(userId, 'EXPIRY_WARNING', {
      message: `Your eSIM expires in ${daysLeft} days.`
    });
  }
};

module.exports = notificationService;
