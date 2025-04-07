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