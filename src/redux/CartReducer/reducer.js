import * as types from './actionType.js';

const initialState = {
  cart: [],
  loading: false,
  error: null
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_CART:
      return {
        ...state,
        cart: action.payload
      };

    case types.ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };

    case types.IN_QTY:
      return {
        ...state,
        cart: state.cart.map(item => 
          item.cartItemId === action.payload.cartItemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case types.REMOVE_QTY:
      return {
        ...state,
        cart: state.cart.filter(item => 
          item.cartItemId !== action.payload
        )
      };

    case types.CLEAR_QTY:
      return {
        ...state,
        cart: []
      };

    default:
      return state;
  }
};

export default cartReducer;