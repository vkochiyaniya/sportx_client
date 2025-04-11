import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectAuthState = (state) => state.auth;

// Memoized selectors
export const selectAuthToken = createSelector(
  [selectAuthState],
  (auth) => auth?.token
);

export const selectAuthUser = createSelector(
  [selectAuthState],
  (auth) => auth?.user
);

export const selectAuthData = createSelector(
  [selectAuthState],
  (auth) => ({
    token: auth?.token,
    user: auth?.user
  })
); 