import axios from './axios';

export const categoryApi = {
  // Get all categories
  getAllCategories: async () => {
    return axios.get('/api/Category/GetAllCategory');
  }
};

export default categoryApi;