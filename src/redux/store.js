// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dataReducer from "./DataReducer/reducer";
import cartReducer from './slices/cartSlice';
import pagesReducer from "./PagesReducer/reducer";
import orderReducer from './slices/orderSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    cart: cartReducer,
    pages: pagesReducer,
    orders: orderReducer,
    payment: paymentReducer
  },
});