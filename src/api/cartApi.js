import axios from './axios';

export const cartApi = {
  // Add item to cart
  addCartItem: async (userId, productId, quantity) => {
    return axios.post(`/api/Cart/AddCartItem/${userId}`, {
      productId,
      quantity
    });
  },
  
  // Get user cart items
  getUserCartItems: async (userId) => {
    return axios.get(`/api/Cart/getUserCartItems/${userId}`);
  },
  
  // Delete cart item by ID
  deleteCartItem: async (cartItemId) => {
    return axios.delete(`/api/Cart/deleteItemById/${cartItemId}`);
  },
  
  // Change item quantity
  changeQuantity: async (cartItemId, quantity) => {
    return axios.post('/api/Cart/changeQuantity', {
      cartItemId,
      quantity
    });
  },
  
  // Apply voucher
  applyVoucher: async (code) => {
    return axios.get(`/api/Cart/ApplyVoucher/${code}`);
  }
};

export default cartApi;