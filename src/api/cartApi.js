import axios from 'axios';
import { store } from '../redux/store';

// Get base API URL and ensure it doesn't end with /api
const getBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:7214';
  return baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
};

const API_URL = getBaseUrl();
console.log('Base API URL:', API_URL);

// Helper function to get auth token
const getAuthToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found in localStorage');
      throw new Error('No authentication token found');
    }

    // Get user ID from localStorage first
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      console.log('Using user ID from localStorage:', storedUserId);
      return `Bearer ${token}`;
    }

    // If no stored user ID, try to get it from Redux store
    const storeUserId = store?.getState()?.auth?.user?.id;
    if (storeUserId) {
      console.log('Using user ID from Redux store:', storeUserId);
      localStorage.setItem('userId', storeUserId);
      return `Bearer ${token}`;
    }

    // If still no user ID, try to decode the token
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    console.log('Token payload:', payload);

    // If token has a valid user ID, use it
    if (payload.sub && payload.sub !== 'undefined') {
      console.log('Using user ID from token:', payload.sub);
      localStorage.setItem('userId', payload.sub);
      return `Bearer ${token}`;
    }

    // If we still don't have a user ID, try to get it from the name claim
    const nameClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    if (nameClaim && nameClaim !== 'undefined') {
      console.log('Using user ID from name claim:', nameClaim);
      localStorage.setItem('userId', nameClaim);
      return `Bearer ${token}`;
    }

    console.error('No valid user ID found in token, localStorage, or Redux store');
    throw new Error('User ID not found');
  } catch (error) {
    console.error('Token validation error:', error);
    throw error;
  }
};

// Helper function to validate user ID
const validateUserId = (userId) => {
  console.log('Validating user ID:', userId);
  
  // Convert to number if it's a string
  const numericId = Number(userId);
  console.log('Converted to numeric ID:', numericId);
  
  if (isNaN(numericId) || numericId <= 0) {
    console.error('Invalid user ID format:', {
      original: userId,
      numeric: numericId,
      isNaN: isNaN(numericId),
      isPositive: numericId > 0
    });
    throw new Error('Invalid user ID format');
  }
  
  return numericId;
};

// Add item to cart
export const addCartItem = async (userId, productId, quantity = 1) => {
  try {
    console.log('Adding item to cart with:', {
      userId,
      productId,
      quantity
    });
    
    const numericUserId = validateUserId(userId);
    console.log('Validated numeric user ID:', numericUserId);
    
    const response = await axios.post(
      `${getBaseUrl()}/api/Cart/AddCartItem/${numericUserId}`,
      { productId, quantity },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    
    console.log('Add cart item response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error.message);
    console.error('Full error object:', error);
    throw error;
  }
};

// Get user's cart items
export const getUserCartItems = async (userId) => {
  try {
    const token = getAuthToken();
    const validatedUserId = validateUserId(userId);
    const fullUrl = `${API_URL}/api/Cart/getUserCartItems/${validatedUserId}`;
    console.log('Fetching cart items for user:', validatedUserId);
    console.log('Full API URL:', fullUrl);
    
    const response = await axios.get(
      fullUrl,
      {
        headers: { 
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Cart items response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error.response?.data || error.message);
    console.error('Full error object:', error);
    throw error.response?.data || 'Failed to fetch cart items';
  }
};

// Delete cart item
export const deleteCartItem = async (cartItemId) => {
  try {
    const token = getAuthToken();
    const validatedCartItemId = validateUserId(cartItemId);
    const fullUrl = `${API_URL}/api/Cart/deleteItemById/${validatedCartItemId}`;
    console.log('Deleting cart item:', validatedCartItemId);
    console.log('Full API URL:', fullUrl);
    
    await axios.delete(fullUrl, {
      headers: { 
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });
    return validatedCartItemId;
  } catch (error) {
    console.error('Error deleting cart item:', error.response?.data || error.message);
    console.error('Full error object:', error);
    throw error.response?.data || 'Failed to delete item from cart';
  }
};

// Change item quantity
export const changeQuantity = async (cartItemId, quantity) => {
  try {
    const token = getAuthToken();
    const validatedCartItemId = validateUserId(cartItemId);
    const payload = { 
      cartItemId: validatedCartItemId, 
      quantity: parseInt(quantity, 10) 
    };
    const fullUrl = `${API_URL}/api/Cart/changeQuantity`;
    console.log('Updating quantity:', payload);
    console.log('Full API URL:', fullUrl);
    
    const response = await axios.post(
      fullUrl,
      payload,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Update quantity response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error changing quantity:', error.response?.data || error.message);
    console.error('Full error object:', error);
    throw error.response?.data || 'Failed to update quantity';
  }
};

// Apply voucher
export const applyVoucher = async (code) => {
  try {
    const token = getAuthToken();
    const fullUrl = `${API_URL}/api/Cart/ApplyVoucher/${code}`;
    console.log('Applying voucher:', code);
    console.log('Full API URL:', fullUrl);
    
    const response = await axios.get(
      fullUrl,
      {
        headers: { 
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Voucher response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error applying voucher:', error.response?.data || error.message);
    console.error('Full error object:', error);
    throw error.response?.data || 'Failed to apply voucher';
  }
};

// Export all functions as named exports
export const cartApi = {
  addCartItem,
  getUserCartItems,
  deleteCartItem,
  changeQuantity,
  applyVoucher,
};