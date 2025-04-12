// src/api/paymentApi.js
import axios from 'axios';
import { API_URL } from './api.js';

const paymentApi = {
  // Create payment
  createPayment: async (orderId) => {
    try {
      const response = await axios.post(`${API_URL}/api/Payment/create-payment`, {
        orderId
      });
      return response.data;
    } catch (error) {
      console.error('Create payment error:', error);
      throw error;
    }
  },
  
  // Execute payment
  executePayment: async (paymentId, payerId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Payment/execute-payment`, {
        params: { paymentId, payerId }
      });
      return response.data;
    } catch (error) {
      console.error('Execute payment error:', error);
      throw error;
    }
  },
  
  // Cancel payment
  cancelPayment: async (paymentId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Payment/cancel-payment`, {
        params: { paymentId }
      });
      return response.data;
    } catch (error) {
      console.error('Cancel payment error:', error);
      throw error;
    }
  }
};

export default paymentApi;