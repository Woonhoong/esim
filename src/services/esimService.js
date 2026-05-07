const apiClient = require('./apiClient');

const esimService = {
  // Call /api/v1/open/location/list
  getLocations: async () => {
    const response = await apiClient.post('/api/v1/open/location/list', {});
    return response.data;
  },

  // Fetch package list
  getPackages: async (locationCode) => {
    const response = await apiClient.post('/api/v1/open/package/list', { locationCode });
    return response.data;
  },

  // Create eSIM order
  createOrder: async (transactionId, packageCode) => {
    const response = await apiClient.post('/api/v1/open/esim/order', {
      transactionId,
      packageCode
    });
    return response.data;
  },

  // Query eSIM details (Retrieve QR code & ICCID)
  queryEsim: async (orderNo) => {
    const response = await apiClient.post('/api/v1/open/esim/query', {
      orderNo
    });
    return response.data;
  },

  // Query Usage
  queryUsage: async (orderNo) => {
    const response = await apiClient.post('/api/v1/open/esim/usage', {
      orderNo
    });
    return response.data;
  }
};

module.exports = esimService;
