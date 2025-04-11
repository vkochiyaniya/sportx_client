import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectCartState = (state) => state.cart;

// Memoized selectors
export const selectCartItems = createSelector(
  [selectCartState],
  (cart) => cart?.cart ?? []
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + (item.price * item.quantity), 0)
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.length
); 