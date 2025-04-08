// src/redux/DataReducer/actions.js
import * as types from './actionType.js';
import { productApi } from '../../api/productApi.js';

export const getProducts = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_PRODUCTS_REQUEST });
    const { data } = await productApi.getAllProducts(params);
    dispatch({ type: types.GET_PRODUCTS_SUCCESS, payload: { products: data } });
  } catch (error) {
    dispatch({ type: types.GET_PRODUCTS_FAILURE, payload: error.message });
  }
};

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_PRODUCT_DETAILS_REQUEST });
    const { data } = await productApi.getProductById(id);
    dispatch({ type: types.GET_PRODUCT_DETAILS_SUCCESS, payload: { productDetails: data } });
  } catch (error) {
    dispatch({ type: types.GET_PRODUCT_DETAILS_FAILURE, payload: error.message });
  }
};