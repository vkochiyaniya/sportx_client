// src/api/orderApi.js
import axios from './axios';

export const orderApi = {
  // Download order
  downloadOrder: async () => {
    return axios.get('/Order/download-order');
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
    return axios.post(`/Order/CreateOrder/${userId}`);
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
    return axios.get(`/Order/GenerateInvoice?orderId=${orderId}`);
  }
};

export default orderApi;