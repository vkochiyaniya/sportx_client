import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectWishlistState = (state) => state.wishReducer;

// Memoized selectors
export const selectWishlistItems = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist?.wishlist ?? []
);

export const selectWishlistItemCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
); 