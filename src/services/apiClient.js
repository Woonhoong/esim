require('dotenv').config();
const axios = require('axios');

const apiClient = axios.create({
  baseURL: process.env.ESIM_ACCESS_API_URL,
  headers: {
    'RT-AccessCode': process.env.ESIM_ACCESS_ACCESS_CODE,
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('eSIMAccess API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

module.exports = apiClient;
