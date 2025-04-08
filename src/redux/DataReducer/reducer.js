import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCT_DETAILS_REQUEST,
  GET_PRODUCT_DETAILS_SUCCESS,
  GET_PRODUCT_DETAILS_FAILURE
} from './actionType';

const initialState = {
  products: [],
  productDetails: null,
  loading: true, // Initialize loading as true
  error: null,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS_REQUEST:
    case GET_PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_PRODUCTS_SUCCESS:
    case GET_PRODUCT_DETAILS_SUCCESS:
      return { ...state, loading: false, ...action.payload };

    case GET_PRODUCTS_FAILURE:
    case GET_PRODUCT_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default dataReducer;