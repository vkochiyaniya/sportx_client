import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Async thunks for order operations
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/Orders/CreateOrder`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order');
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

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/GetUserOrders/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Order/GetOrderById/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order details');
    }
  }
);

// Initial state
const initialState = {
  currentOrder: null,
  userOrders: [],
  paymentDetails: null,
  invoiceUrl: null,
  orderItems: [],
  shippingInfo: {
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    email: ''
  },
  paymentMethod: 'paypal', // Default payment method
  loading: false,
  error: null,
  paymentLoading: false,
  paymentError: null
};

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.paymentDetails = null;
      state.invoiceUrl = null;
      state.orderItems = [];
    },
    clearError: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    setShippingInfo: (state, action) => {
      state.shippingInfo = { ...state.shippingInfo, ...action.payload };
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    resetOrderState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order
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
      
      // Initialize payment
      .addCase(initializePayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentDetails = action.payload;
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })
      
      // Execute payment
      .addCase(executePayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(executePayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.currentOrder = {
          ...state.currentOrder,
          status: 'paid',
          paymentDetails: action.payload
        };
      })
      .addCase(executePayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })
      
      // Cancel payment
      .addCase(cancelPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(cancelPayment.fulfilled, (state) => {
        state.paymentLoading = false;
        state.paymentDetails = null;
      })
      .addCase(cancelPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })
      
      // Generate invoice
      .addCase(generateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceUrl = action.payload.url;
      })
      .addCase(generateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get invoice by order ID
      .addCase(getInvoiceByOrderId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoiceByOrderId.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceUrl = action.payload.url;
      })
      .addCase(getInvoiceByOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get order items
      .addCase(getOrderItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderItems.fulfilled, (state, action) => {
        state.loading = false;
        state.orderItems = action.payload.items;
      })
      .addCase(getOrderItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch order by ID
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
      });
  },
});

export const { 
  clearCurrentOrder, 
  clearError, 
  setShippingInfo, 
  setPaymentMethod,
  resetOrderState
} = orderSlice.actions;

export default orderSlice.reducer; 