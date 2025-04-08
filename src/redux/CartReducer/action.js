import * as types from './actionType.js';
import { cartApi } from '../../api/cartApi.js';

export const addToCart = (productId, quantity) => async (dispatch, getState) => {
  try {
    const { auth: { userId } } = getState();
    const response = await cartApi.addCartItem(userId, productId, quantity);
    dispatch({
      type: types.ADD_TO_CART,
      payload: response.data
    });
  } catch (error) {
    console.error('Add to cart error:', error);
  }
};

export const fetchCart = () => async (dispatch, getState) => {
  try {
    const { auth: { userId } } = getState();
    const { data } = await cartApi.getUserCartItems(userId);
    dispatch({
      type: types.SET_CART,
      payload: data
    });
  } catch (error) {
    console.error('Fetch cart error:', error);
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
  }
};