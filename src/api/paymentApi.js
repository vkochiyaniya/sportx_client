// src/api/paymentApi.js
import axios from './axios';

export const paymentApi = {
  // Create payment
  createPayment: async (paymentData) => {
    return axios.post('/Payment/create-payment', paymentData);
  },
  
  // Execute payment
  executePayment: async (paymentId, payerId) => {
    return axios.get(`/Payment/execute-payment?paymentId=${paymentId}&payerId=${payerId}`);
  },
  
  // Cancel payment
  cancelPayment: async () => {
    return axios.get('/Payment/cancel-payment');
  }
};

export default paymentApi;