// src/Api/productApi.js
import axiosInstance from './axios';

export const productApi = {
  getAllProducts: () => axiosInstance.get('/Products/GetAllProducts'),
  getProductById: (id) => axiosInstance.get(`/Products/GetProductByID/${id}`),
  getProductsByCategory: (categoryId) => 
    axiosInstance.get(`/Products/GetProductByCategoryID${categoryId}`),
  getProductsByBrand: (brand) => 
    axiosInstance.get(`/Products/GetProductByBrand/${brand}`),
  filterByPrice: (min, max) => 
    axiosInstance.get(`/Products/FilterByPrice?minPrice=${min}&maxPrice=${max}`),
  getBrandCounts: () => axiosInstance.get('/Products/GetBrandCount'),
  sortByPriceHighToLow: () => 
    axiosInstance.get('/Products/FilterByPriceHighToLow'),
  sortByPriceLowToHigh: () => 
    axiosInstance.get('/Products/FilterByPriceLowToHigh')
};