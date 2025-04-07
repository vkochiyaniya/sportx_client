import axios from './axios';

export const productApi = {
  // Get all products
  getAllProducts: async () => {
    return axios.get('/Products/GetAllProducts');
  },
  
  // Get product by ID
  getProductById: async (productId) => {
    return axios.get(`/Products/GetProductByID/${productId}`);
  },
  
  // Get product by ID with stars/ratings
  getProductWithStars: async (productId) => {
    return axios.get(`/Products/GetProductByIDStars/${productId}`);
  },
  
  // Get products by category ID
  getProductsByCategory: async (categoryId) => {
    return axios.get(`/Products/GetProductByCategoryID/${categoryId}`); // Fixed missing slash
  },
  
  // Get brand count
  getBrandCount: async () => {
    return axios.get('/Products/GetBrandCount');
  },
  
  // Get products by brand name
  getProductsByBrand: async (brandName) => {
    return axios.get(`/Products/GetProductByBrand/${brandName}`);
  },
  
  // Filter products by price range
  filterByPrice: async (minPrice, maxPrice) => {
    return axios.get(`/Products/FilterByPrice?minPrice=${minPrice}&maxPrice=${maxPrice}`);
  },
  
  // Filter products by price (high to low)
  filterByPriceHighToLow: async () => {
    return axios.get('/Products/FilterByPriceHighToLow');
  },
  
  // Filter products by price (low to high)
  filterByPriceLowToHigh: async () => {
    return axios.get('/Products/FilterByPriceLowToHigh');
  },
  
  // Filter products by name
  filterByName: async () => {
    return axios.get('/Products/FilterByName');
  }
};

export default productApi;