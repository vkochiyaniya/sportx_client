import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentApi from '../../api/paymentApi';

// Async thunks
export const initializePayment = createAsyncThunk(
  'payment/initializePayment',
  async (paymentDetails, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createPayment(paymentDetails);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const executePayment = createAsyncThunk(
  'payment/executePayment',
  async ({ paymentId, payerId }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.executePayment(paymentId, payerId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelPayment = createAsyncThunk(
  'payment/cancelPayment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.cancelPayment();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  paymentUrl: null,
  paymentStatus: null,
  loading: false,
  error: null
};

// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.paymentUrl = null;
      state.paymentStatus = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initialize Payment
      .addCase(initializePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload.paymentUrl;
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Execute Payment
      .addCase(executePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'completed';
      })
      .addCase(executePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Payment
      .addCase(cancelPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelPayment.fulfilled, (state) => {
        state.loading = false;
        state.paymentStatus = 'cancelled';
      })
      .addCase(cancelPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer; 