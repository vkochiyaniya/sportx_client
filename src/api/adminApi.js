import axios from './axios';

// Products
export const getProducts = () => axios.get('/AdminControllers/Product');

export const addProduct = (productData) => 
  axios.post('/AdminControllers/Product', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateProduct = (id, productData) => 
  axios.put(`/AdminControllers/Product?id=${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteProduct = (id) => axios.delete(`/AdminControllers/Product?id=${id}`);

export const getProductByName = (name) => axios.get(`/AdminControllers/GetProductByName?name=${name}`);

export const getProductsByCategoryId = (categoryId) => 
  axios.get(`/AdminControllers/ProductbyGetCategoryId/${categoryId}`);

// Categories
export const getCategories = () => axios.get('/AdminControllers/Category');

export const addCategory = (categoryData) => 
  axios.post('/AdminControllers/Category', categoryData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateCategory = (id, categoryData) => 
  axios.put(`/AdminControllers/Category?id=${id}`, categoryData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteCategory = (id) => axios.delete(`/AdminControllers/Category?id=${id}`);

// Users
export const getUsers = () => axios.get('/AdminControllers/User');

export const addUser = (userData) => 
  axios.post('/AdminControllers/USer', userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateUser = (id, userData) => 
  axios.put(`/AdminControllers/User?id=${id}`, userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteUser = (id) => axios.delete(`/AdminControllers/User?id=${id}`);

// Admin
export const getAdmins = () => axios.get('/AdminControllers/Admin');

export const addAdmin = (adminData, id) => 
  axios.post(`/AdminControllers/Admin?id=${id}`, adminData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateAdmin = (id, adminData) => 
  axios.put(`/AdminControllers/Admin?id=${id}`, adminData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// Comments
export const getComments = () => axios.get('/AdminControllers/Commint');

export const updateCommentStatus = (id) => axios.put(`/AdminControllers/UpdatateStatusComment/${id}`);

export const deleteComment = (id) => axios.delete(`/AdminControllers/DeleteComment${id}`);

// Contacts
export const getContacts = () => axios.get('/AdminControllers/Contact');