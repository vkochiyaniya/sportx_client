import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';
import { 
  setToken, 
  setUserId, 
  setUserInfo, 
  clearAuthData,
  getToken,
  getUserId
} from '../../utils/localStorage';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Logging in with credentials:', credentials.email);
      const response = await userApi.login(credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Log the exact data received by the thunk
      console.log('Register thunk received data:', userData);
      
      // Check if userData is a FormData object
      if (userData instanceof FormData) {
        // Extract values from FormData
        const name = userData.get('name');
        const email = userData.get('email');
        const password = userData.get('password');
        const confirmPassword = userData.get('confirmPassword');
        
        console.log('Extracted from FormData:', {
          name,
          email,
          password: '********',
          confirmPassword: '********'
        });
        
        // Check if the required fields are present
        if (!name || !email || !password || !confirmPassword) {
          console.error('Missing required fields in FormData:', {
            name: !!name,
            email: !!email,
            password: !!password,
            confirmPassword: !!confirmPassword
          });
          return rejectWithValue('Missing required fields');
        }
        
        // Validate passwords match before sending to API
        if (password !== confirmPassword) {
          return rejectWithValue('Passwords do not match');
        }
        
        // Create a new FormData with the correct case-sensitive field names
        const apiFormData = new FormData();
        apiFormData.append('Name', name);
        apiFormData.append('Email', email);
        apiFormData.append('Password', password);
        apiFormData.append('ConfirmPassword', confirmPassword);
        
        // Log the FormData entries
        console.log('API FormData entries:');
        for (let [key, value] of apiFormData.entries()) {
          console.log(`${key}: ${key === 'Password' || key === 'ConfirmPassword' ? '********' : value}`);
        }
        
        const response = await userApi.register(apiFormData);
        console.log('Registration response:', response.data);
        return response.data;
      } else {
        // Handle regular object (not FormData)
        // Check if the required fields are present
        if (!userData.Name || !userData.Email || !userData.Password || !userData.ConfirmPassword) {
          console.error('Missing required fields in userData:', {
            Name: !!userData.Name,
            Email: !!userData.Email,
            Password: !!userData.Password,
            ConfirmPassword: !!userData.ConfirmPassword
          });
          return rejectWithValue('Missing required fields');
        }
        
        // Validate passwords match before sending to API
        if (userData.Password !== userData.ConfirmPassword) {
          return rejectWithValue('Passwords do not match');
        }

        // Create FormData with correct case-sensitive field names
        const formData = new FormData();
        formData.append('Name', userData.Name);
        formData.append('Email', userData.Email);
        formData.append('Password', userData.Password);
        formData.append('ConfirmPassword', userData.ConfirmPassword);
        
        // Log the FormData entries
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${key === 'Password' || key === 'ConfirmPassword' ? '********' : value}`);
        }
        
        console.log('Registering user with data:', {
          Name: userData.Name,
          Email: userData.Email,
          Password: '********', // Don't log actual password
          ConfirmPassword: '********' // Don't log actual password
        });
        
        const response = await userApi.register(userData);
        console.log('Registration response:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(
        // error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {l̥
      console.log('Sending password reset email to:', email);
      const response = await userApi.forgotPassword(email);
      console.log('Forgot password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to send password reset email.'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      console.log('Resetting password with token');
      const response = await userApi.setNewPassword({ token, password });
      console.log('Reset password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Password reset failed. Please try again.'
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userId } = getState().auth;
      if (!userId) {
        console.log('No user ID found in state');
        return null;
      }
      
      console.log('Fetching user data for ID:', userId);
      const response = await userApi.getUserById(userId);
      console.log('User data fetched successfully');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to fetch user information.'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      console.log('Updating user profile for ID:', userId);
      const response = await userApi.editProfile(userId, updates);
      console.log('Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to update profile.'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    console.log('Logging out user');
    clearAuthData();
    return null;
  }
);

// Initial state
const initialState = {
  user: null,
  token: getToken(),
  userId: getUserId(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
  success: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        
        // Use the userId from the response instead of the token's sub claim
        state.userId = action.payload.userId;
        
        state.user = action.payload.user;
        state.success = 'Login successful';
        
        // Save to localStorage
        setToken(action.payload.token);
        setUserId(action.payload.userId);
        setUserInfo(action.payload.user);
        
        console.log('Auth state after login:', {
          userId: state.userId,
          token: state.token,
          isAuthenticated: state.isAuthenticated
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.userId = null;
        state.user = null;
        
        // Clear localStorage on login failure
        clearAuthData();
      })
      
    // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Registration successful. Please login.';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Password reset email sent. Please check your inbox.';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Password reset successful. Please login with your new password.';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          setUserInfo(action.payload);
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.userId = null;
        clearAuthData();
      })
      
    // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.success = 'Profile updated successfully.';
        setUserInfo(state.user);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.userId = null;
        state.isAuthenticated = false;
        state.success = 'Logged out successfully';
      });
  },
});

export const { clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer; 