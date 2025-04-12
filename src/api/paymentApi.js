// src/api/paymentApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const paymentApi = {
  // Create payment
  createPayment: async (paymentDetails) => {
    try {
      const response = await axios.post(`${API_URL}/api/Payment/create-payment`, paymentDetails);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
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
      console.error('Error executing payment:', error);
      throw error;
    }
  },
  
  // Cancel payment
  cancelPayment: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Payment/cancel-payment`);
      return response.data;
    } catch (error) {
      console.error('Error canceling payment:', error);
      throw error;
    }
  }
};

export default paymentApi;