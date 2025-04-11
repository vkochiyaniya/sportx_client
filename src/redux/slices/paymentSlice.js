import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const executePayment = createAsyncThunk(
  'orders/executePayment',
  async ({ orderId, paymentId, paypalOrderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/Payment/execute-payment`, {
        orderId,
        paymentId,
        paypalOrderId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Payment execution failed');
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  paymentDetails: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearPaymentDetails: (state) => {
      state.paymentDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload;
      })
      .addCase(executePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentError, clearPaymentDetails } = paymentSlice.actions;
export default paymentSlice.reducer; 