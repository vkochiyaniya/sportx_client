import * as types from './actionType.js';
import { getLocalData } from '../../utils/localStorage';

const initialState = {
  token: getLocalData('token'),
  userId: getLocalData('userId'),
  user: getLocalData('userInfo') || null,
  loading: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.REGISTER_REQUEST:
    case types.LOGIN_REQUEST:
    case types.UPDATE_PROFILE_REQUEST:
    case types.PASSWORD_RESET_REQUEST:
      return { ...state, loading: true, error: null };

    case types.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        userId: action.payload.userId,
        // Keep existing user data if present
        user: state.user  
      };

    case types.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        userId: action.payload.userId,
        user: null
      };

    case types.USER_LOADED:
      return {
        ...state,
        loading: false,
        user: action.payload
      };

    case types.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: { ...state.user, ...action.payload }
      };

    case types.LOGOUT:
      return {
        ...initialState,
        token: null,
        userId: null,
        user: null
      };

    case types.AUTH_ERROR:
    case types.REGISTER_FAILURE:
    case types.LOGIN_FAILURE:
    case types.UPDATE_PROFILE_FAILURE:
    case types.PASSWORD_RESET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default authReducer;