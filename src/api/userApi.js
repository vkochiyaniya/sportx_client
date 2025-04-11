// src/Api/userApi.js
import axios from './axios';

const userApi = {
  // Login user
  login: async (credentials) => {
    try {
      console.log('Login attempt with credentials:', {
        Email: credentials.Email || credentials.email,
        Password: '********' // Don't log the actual password
      });
      
      // Create FormData with correct field names
      const formData = new FormData();
      formData.append('Email', credentials.Email || credentials.email);
      formData.append('Password', credentials.Password || credentials.password);
      
      const response = await axios.post('/Users/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Login response:', response.data);
      
      // Ensure we have a valid response with token and user ID
      if (!response.data?.token) {
        throw new Error('Invalid login response: No token received');
      }
      
      // Store the token and user ID in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      
      console.log('Stored auth data:', {
        token: response.data.token,
        userId: response.data.userId
      });
      
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      // Log the exact data received by the API
      console.log('userApi.register received data:', userData);
      
      let formData;
      
      // Check if userData is already a FormData object
      if (userData instanceof FormData) {
        formData = userData;
        
        // Log the FormData entries
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${key === 'Password' || key === 'ConfirmPassword' ? '********' : value}`);
        }
      } else {
        // Check if the required fields are present
        if (!userData.Name || !userData.Email || !userData.Password || !userData.ConfirmPassword) {
          console.error('Missing required fields in userData:', {
            Name: !!userData.Name,
            Email: !!userData.Email,
            Password: !!userData.Password,
            ConfirmPassword: !!userData.ConfirmPassword
          });
          throw new Error('Missing required fields');
        }
        
        formData = new FormData();
        formData.append('Name', userData.Name);
        formData.append('Email', userData.Email);
        formData.append('Password', userData.Password);
        formData.append('ConfirmPassword', userData.ConfirmPassword);
        
        // Log the FormData entries
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${key === 'Password' || key === 'ConfirmPassword' ? '********' : value}`);
        }
      }
      
      console.log('Sending registration data with fields:', {
        Name: formData.get('Name'),
        Email: formData.get('Email'),
        Password: '********',
        ConfirmPassword: '********'
      });
      
      const response = await axios.post('/Users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await axios.post('/Users/ForgotPassword', JSON.stringify(email), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reset password with token
  setNewPassword: async ({ userId, newPassword }) => {
    try {
      const response = await axios.post('/Users/SetNewPassword', {
        userId,
        newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`/Users/showUserInfoByID/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Edit user profile
  editProfile: async (userId, updates) => {
    try {
      const formData = new FormData();
      Object.keys(updates).forEach(key => {
        if (key === 'profilePicture' && updates[key] instanceof File) {
          formData.append(key, updates[key]);
        } else {
          formData.append(key, updates[key]);
        }
      });
      
      const response = await axios.put(`/Users/EditUserProfile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default userApi;