// src/api/commentApi.js
import axios from './axios';

export const commentApi = {
  // Get comments by product ID
  getCommentsByProduct: async (productId) => {
    return axios.get(`/Comments/GetComments/${productId}`);
  },
  
  // Add a new comment
  addComment: async (commentData) => {
    return axios.post('/Comments/AddComment', commentData);
  }
};

export default commentApi;