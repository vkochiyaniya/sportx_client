// src/Api/userApi.js
import axios from './axios';

export const userApi = {
  register: (userData) => {
    const formData = new FormData();
    // Match EXACT server parameter names with correct case
    formData.append('Name', userData.name);
    formData.append('Email', userData.email);
    formData.append('Password', userData.password);
    formData.append('ConfirmPassword', userData.confirmPassword); // Capital C
    
    return axios.post('/Users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  login: async (credentials) => {
    const formData = new FormData();
    formData.append('Email', credentials.email);
    formData.append('Password', credentials.password);
    
    return axios.post('/Users/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getUserById: (userId) => axios.get(`/Users/showUserInfoByID/${userId}`),

  editProfile: (userId, updates) => {
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return axios.put(`/Users/EditUserProfile/${userId}`, formData);
  },

  forgotPassword: (email) => axios.post('/Users/ForgotPassword', email, {
    headers: { 'Content-Type': 'application/json' }
  }),

  setNewPassword: (data) => axios.post('/Users/SetNewPassword', data, {
    headers: { 'Content-Type': 'application/json' }
  })
};