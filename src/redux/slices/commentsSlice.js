import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Async thunks for comment operations
export const fetchProductComments = createAsyncThunk(
  'comments/fetchProductComments',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Comments/GetComments/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/Comments/AddComment`, commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add comment');
    }
  }
);

export const fetchAllComments = createAsyncThunk(
  'comments/fetchAllComments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/AdminControllers/Commint`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all comments');
    }
  }
);

export const updateCommentStatus = createAsyncThunk(
  'comments/updateCommentStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/AdminControllers/UpdatateStatusComment/${id}`, { status });
      return { id, status, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update comment status');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/AdminControllers/DeleteComment/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete comment');
    }
  }
);

// Initial state
const initialState = {
  productComments: [],
  allComments: [],
  loading: false,
  error: null,
  addCommentLoading: false,
  addCommentError: null,
  adminLoading: false,
  adminError: null,
};

// Comments slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.productComments = [];
      state.error = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.addCommentError = null;
      state.adminError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch product comments
    builder
      .addCase(fetchProductComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductComments.fulfilled, (state, action) => {
        state.loading = false;
        state.productComments = action.payload;
      })
      .addCase(fetchProductComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.addCommentLoading = true;
        state.addCommentError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.addCommentLoading = false;
        state.productComments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addCommentLoading = false;
        state.addCommentError = action.payload;
      })
      
      // Fetch all comments (admin)
      .addCase(fetchAllComments.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.allComments = action.payload;
      })
      .addCase(fetchAllComments.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload;
      })
      
      // Update comment status (admin)
      .addCase(updateCommentStatus.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(updateCommentStatus.fulfilled, (state, action) => {
        state.adminLoading = false;
        // Update in product comments if exists
        const productCommentIndex = state.productComments.findIndex(
          comment => comment.id === action.payload.id
        );
        if (productCommentIndex !== -1) {
          state.productComments[productCommentIndex].status = action.payload.status;
        }
        // Update in all comments
        const allCommentIndex = state.allComments.findIndex(
          comment => comment.id === action.payload.id
        );
        if (allCommentIndex !== -1) {
          state.allComments[allCommentIndex].status = action.payload.status;
        }
      })
      .addCase(updateCommentStatus.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload;
      })
      
      // Delete comment (admin)
      .addCase(deleteComment.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.adminLoading = false;
        // Remove from product comments if exists
        state.productComments = state.productComments.filter(
          comment => comment.id !== action.payload
        );
        // Remove from all comments
        state.allComments = state.allComments.filter(
          comment => comment.id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload;
      });
  },
});

export const { clearComments, clearErrors } = commentsSlice.actions;

export default commentsSlice.reducer; 