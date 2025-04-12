import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import orderApi from '../../api/orderApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderDetails(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const initializePayment = createAsyncThunk(
  'orders/initializePayment',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/Payment/create-payment`, {
        orderId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to initialize payment');
    }
  }
);

export const executePayment = createAsyncThunk(
  'orders/executePayment',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Payment/execute-payment?paymentId=${paymentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to execute payment');
    }
  }
);

export const cancelPayment = createAsyncThunk(
  'orders/cancelPayment',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Payment/cancel-payment?paymentId=${paymentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel payment');
    }
  }
);

export const generateInvoice = createAsyncThunk(
  'orders/generateInvoice',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/GenerateInvoice`, {
        params: { orderId },
        responseType: 'blob'
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      return {
        url,
        orderId
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to generate invoice');
    }
  }
);

export const getInvoiceByOrderId = createAsyncThunk(
  'orders/getInvoiceByOrderId',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/InvoiceByOrderID/${orderId}`, {
        responseType: 'blob'
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      return {
        url,
        orderId
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get invoice');
    }
  }
);

export const getOrderItems = createAsyncThunk(
  'orders/getOrderItems',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/download-orderItems/${orderId}`);
      return {
        items: response.data,
        orderId
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get order items');
    }
  }
);

export const fetchOrderHistory = createAsyncThunk(
  'order/fetchOrderHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderHistory(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'order/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderDetails(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  orderHistory: [],
  orderDetails: null,
  shippingInfo: null
};

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order By Id
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order History
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentOrder, clearError, setShippingInfo } = orderSlice.actions;
export default orderSlice.reducer; 