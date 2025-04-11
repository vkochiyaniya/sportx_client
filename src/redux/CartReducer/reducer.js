// src/redux/CartReducer/reducer.js
import * as types from "./actionType";

const initialState = {
  cart: [],
  loading: false,
  error: null,
  voucher: null
};

const cartReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.ADD_TO_CART: {
      // Check if the item is already in the cart
      const existingCartItem = state.cart.find(
        item => item.productId === payload.productId
      );

      if (existingCartItem) {
        // If item exists, update its quantity
        const updatedCart = state.cart.map(item => 
          item.productId === payload.productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        return {
          ...state,
          cart: updatedCart,
          loading: false,
          error: null
        };
      } else {
        // If item doesn't exist, add new item to cart
        return {
          ...state,
          cart: [...state.cart, { ...payload, quantity: 1 }],
          loading: false,
          error: null
        };
      }
    }

    case types.SET_CART: {
      return {
        ...state,
        cart: payload,
        loading: false,
        error: null
      };
    }

    case types.IN_QTY: {
      const { cartItemId, quantity } = payload;
      return {
        ...state,
        cart: state.cart.map(item => 
          item.cartItemId === cartItemId 
            ? { ...item, quantity }
            : item
        ),
        loading: false,
        error: null
      };
    }

    case types.REMOVE_QTY: {
      return {
        ...state,
        cart: state.cart.filter(item => item.cartItemId !== payload),
        loading: false,
        error: null
      };
    }

    case types.CLEAR_QTY: {
      return {
        ...state,
        cart: [],
        loading: false,
        error: null
      };
    }

    case types.APPLY_VOUCHER: {
      return {
        ...state,
        voucher: payload,
        loading: false,
        error: null
      };
    }

    // Error handling cases
    case 'CART_REQUEST': {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case 'CART_FAILURE': {
      return {
        ...state,
        loading: false,
        error: payload
      };
    }

    default:
      return state;
  }
};

export default cartReducer;
