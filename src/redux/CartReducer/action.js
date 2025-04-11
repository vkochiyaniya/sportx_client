// src/redux/CartReducer/action.js
import * as types from './actionType.js';
import { cartApi } from '../../api/cartApi.js';

export const addToCart = (productId, quantity) => async (dispatch, getState) => {
  dispatch({ type: types.CART_REQUEST });
  
  try {
    const { auth: { userId } } = getState();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const response = await cartApi.addCartItem(userId, productId, quantity);
    
    dispatch({
      type: types.ADD_TO_CART,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: types.CART_FAILURE,
      payload: error.message
    });
    throw error;
  }
};


export const fetchCart = () => async (dispatch, getState) => {
  try {
    const { auth: { userId } } = getState();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const { data } = await cartApi.getUserCartItems(userId);
    
    dispatch({
      type: types.SET_CART,
      payload: data
    });
  } catch (error) {
    console.error('Fetch cart error:', error);
    throw error;
  }
};

export const removeItem = (cartItemId) => async (dispatch) => {
  try {
    await cartApi.deleteCartItem(cartItemId);
    
    dispatch({
      type: types.REMOVE_QTY,
      payload: cartItemId
    });
  } catch (error) {
    console.error('Remove item error:', error);
    throw error;
  }
};

export const updateQuantity = (cartItemId, quantity) => async (dispatch) => {
  try {
    await cartApi.changeQuantity(cartItemId, quantity);
    
    dispatch({
      type: types.IN_QTY,
      payload: { cartItemId, quantity }
    });
  } catch (error) {
    console.error('Update quantity error:', error);
    throw error;
  }
};

export const clearCart = () => async (dispatch, getState) => {
  try {
    const { auth: { userId } } = getState();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    await cartApi.clearUserCart(userId);
    
    dispatch({
      type: types.CLEAR_QTY
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};

export const applyVoucher = (voucherCode) => async (dispatch) => {
  try {
    const response = await cartApi.applyVoucher(voucherCode);
    
    dispatch({
      type: types.APPLY_VOUCHER,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Apply voucher error:', error);
    throw error;
  }
};
