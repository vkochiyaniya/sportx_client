// src/api/axios.js
import axios from 'axios';

const BASE_URL = 'https://localhost:7214/api/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle errors (e.g., 401 Unauthorized, refresh token logic, etc.)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Handle token refresh or redirect to login
      // This is where you'd implement token refresh logic if needed
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;