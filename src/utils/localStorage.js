// src/utils/localStorage.js
export const getLocalData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return localStorage.getItem(key);
  }
};

export const saveLocalData = (key, value) => {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};

export const removeLocalData = (key) => {
  localStorage.removeItem(key);
};

// Token management
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

// User ID management
export const setUserId = (userId) => {
  localStorage.setItem('userId', userId);
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const removeUserId = () => {
  localStorage.removeItem('userId');
};

// User info management
export const setUserInfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

export const removeUserInfo = () => {
  localStorage.removeItem('userInfo');
};

// Clear all auth data
export const clearAuthData = () => {
  removeToken();
  removeUserId();
  removeUserInfo();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken() && !!getUserId();
};