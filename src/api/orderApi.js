// src/api/orderApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const orderApi = {
  // Download order
  downloadOrder: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/download-order/${orderId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading order:', error);
      throw error;
    }
  },
  
  // Download specific order by ID
  downloadOrderById: async (orderId) => {
    return axios.get(`/Order/download-order/${orderId}`);
  },
  
  // Get order items
  getOrderItems: async (orderId) => {
    return axios.get(`/Order/OrderItem?id=${orderId}`);
  },
  
  // Create new order
  createOrder: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/api/Order/create-order`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  // Download order iteml̥s by order ID
  downloadOrderItems: async (orderId) => {
    return axios.get(`/Order/download-orderItems/${orderId}`);
  },
  
  // Get invoice by order ID
  getInvoiceByOrderId: async (orderId) => {
    return axios.get(`/Order/InvoiceByOrderID/(${orderId})`);
  },
  
  // Generate invoice
  generateInvoice: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/GenerateInvoice/${orderId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  },

  getOrderHistory: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  },

  getOrderDetails: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/details/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  getInvoice: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/InvoiceByOrderID/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  }
};

export default orderApi;