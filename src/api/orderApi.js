// src/api/orderApi.js
import axios from 'axios';
import { API_URL } from './api';

const orderApi = {
  // Download order
  downloadOrder: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/download-order/${orderId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Download order error:', error);
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
  createOrder: async (orderData) => {
    try {
      console.log('Creating order with data:', orderData);
      const response = await axios.post(`${API_URL}/api/Orders/CreateOrder`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Create order response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
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
      const response = await axios.get(`${API_URL}/api/Order/GenerateInvoice`, {
        params: { orderId },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Generate invoice error:', error);
      throw error;
    }
  },

  getOrderHistory: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/OrderHistory/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get order history error:', error);
      throw error;
    }
  },

  getOrderDetails: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/OrderDetails/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order details error:', error);
      throw error;
    }
  },

  getInvoice: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/InvoiceByOrderID/${orderId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Get invoice error:', error);
      throw error;
    }
  }
};

export default orderApi;