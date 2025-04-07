// src/redux/AuthReducer/actions.js
import * as types from './actionType.js';
import { userApi } from '../../api/userApi';
import { saveLocalData, removeLocalData } from '../../utils/localStorage';

const handleError = (error) => {
  // Handle Axios error structure
  const serverMessage = error.response?.data;
  if (typeof serverMessage === 'string') return serverMessage;
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).join(', ');
  }
  return error.message || 'An error occurred';
};

// Add this to src/redux/AuthReducer/actions.js
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_REQUEST });
    
    const { data } = await userApi.login(credentials);
    
    if (!data?.token) {
      throw new Error('Invalid server response');
    }

    saveLocalData('token', data.token);
    saveLocalData('userId', data.userId);

    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: { token: data.token, userId: data.userId }
    });

    await dispatch(loadUser(data.userId));
    
    return data;

  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: types.LOGIN_FAILURE,
      payload: errorMessage
    });
    throw errorMessage;
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: types.REGISTER_REQUEST });
    
    // 1. Registration call
    await userApi.register(userData);
    
    // 2. Auto-login after registration
    const loginResponse = await userApi.login({
      email: userData.email,
      password: userData.password
    });

    // 3. Save credentials
    saveLocalData('token', loginResponse.data.token);
    saveLocalData('userId', loginResponse.data.userId);

    // 4. Dispatch success with credentials
    dispatch({
      type: types.REGISTER_SUCCESS,
      payload: {
        token: loginResponse.data.token,
        userId: loginResponse.data.userId
      }
    });

    // 5. Load user data and wait for completion
    await dispatch(loadUser(loginResponse.data.userId));
    
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({
      type: types.REGISTER_FAILURE,
      payload: errorMessage
    });
    throw errorMessage;
  }
};

// Update loadUser to propagate errors
export const loadUser = (userId) => async (dispatch) => {
  try {
    const { data } = await userApi.getUserById(userId);
    dispatch({
      type: types.USER_LOADED,
      payload: data
    });
    saveLocalData('userInfo', data);
  } catch (error) {
    const errorMessage = handleError(error);
    dispatch({ type: types.AUTH_ERROR, payload: errorMessage });
    throw errorMessage; // Propagate error to caller
  }
};

export const logoutUser = () => (dispatch) => {
  removeLocalData('token');
  removeLocalData('userId');
  removeLocalData('userInfo');
  dispatch({ type: types.LOGOUT });
};

export const updateUserProfile = (userId, updates) => async (dispatch) => {
  try {
    dispatch({ type: types.UPDATE_PROFILE_REQUEST });
    const { data } = await userApi.editProfile(userId, updates);
    
    dispatch({
      type: types.UPDATE_PROFILE_SUCCESS,
      payload: data
    });
    
    // Update local storage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    saveLocalData('userInfo', { ...userInfo, ...data });
    
  } catch (error) {
    dispatch({
      type: types.UPDATE_PROFILE_FAILURE,
      payload: handleError(error)
    });
    throw error;
  }
};

export const resetPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: types.PASSWORD_RESET_REQUEST });
    const { data } = await userApi.forgotPassword(email);
    dispatch({ type: types.PASSWORD_RESET_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: types.PASSWORD_RESET_FAILURE, payload: handleError(error) });
    throw error;
  }
};

export const setNewPassword = (userId, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: types.PASSWORD_RESET_REQUEST });
    const { data } = await userApi.setNewPassword({ userId, newPassword });
    dispatch({ type: types.PASSWORD_RESET_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: types.PASSWORD_RESET_FAILURE, payload: handleError(error) });
    throw error;
  }
};