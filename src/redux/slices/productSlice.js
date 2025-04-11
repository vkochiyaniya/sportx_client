import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Async thunks for product operations
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Products/GetAllProducts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Products/GetProductByID/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch product details');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Products/GetProductByCategoryID/${categoryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products by category');
    }
  }
);

export const fetchProductsByBrand = createAsyncThunk(
  'products/fetchProductsByBrand',
  async (brandName, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Products/GetProductByBrand/${brandName}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products by brand');
    }
  }
);

export const fetchBrandCount = createAsyncThunk(
  'products/fetchBrandCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Products/GetBrandCount`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch brand count');
    }
  }
);

export const filterProductsByPrice = createAsyncThunk(
  'products/filterProductsByPrice',
  async ({ minPrice, maxPrice }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Products/FilterByPrice`, {
        params: { minPrice, maxPrice }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to filter products by price');
    }
  }
);

export const sortProductsByPriceHighToLow = createAsyncThunk(
  'products/sortProductsByPriceHighToLow',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Products/FilterByPriceHighToLow`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to sort products by price (high to low)');
    }
  }
);

export const sortProductsByPriceLowToHigh = createAsyncThunk(
  'products/sortProductsByPriceLowToHigh',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Products/FilterByPriceLowToHigh`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to sort products by price (low to high)');
    }
  }
);

export const sortProductsByName = createAsyncThunk(
  'products/sortProductsByName',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/Products/FilterByName`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to sort products by name');
    }
  }
);

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  brandCount: [],
  filteredProducts: [],
  filters: {
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    sortBy: null
  },
  loading: false,
  error: null,
  priceFilter: null,
  brandFilter: [],
  sortOption: null,
  searchQuery: ''
};

// Create the slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearFilteredProducts: (state) => {
      state.filteredProducts = [];
    },
    setPriceFilter: (state, action) => {
      state.priceFilter = action.payload;
    },
    setBrandFilter: (state, action) => {
      state.brandFilter = action.payload;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearAllFilters: (state) => {
      state.priceFilter = null;
      state.brandFilter = [];
      state.sortOption = null;
      state.searchQuery = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
        state.filters.category = action.meta.arg;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch products by brand
      .addCase(fetchProductsByBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
        state.filters.brand = action.meta.arg;
      })
      .addCase(fetchProductsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch brand count
      .addCase(fetchBrandCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandCount.fulfilled, (state, action) => {
        state.loading = false;
        state.brandCount = action.payload;
      })
      .addCase(fetchBrandCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Filter products by price
      .addCase(filterProductsByPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterProductsByPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
        state.filters.minPrice = action.meta.arg.minPrice;
        state.filters.maxPrice = action.meta.arg.maxPrice;
      })
      .addCase(filterProductsByPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Sort products by price (high to low)
      .addCase(sortProductsByPriceHighToLow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sortProductsByPriceHighToLow.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
        state.filters.sortBy = 'priceHighToLow';
      })
      .addCase(sortProductsByPriceHighToLow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Sort products by price (low to high)
      .addCase(sortProductsByPriceLowToHigh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sortProductsByPriceLowToHigh.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
        state.filters.sortBy = 'priceLowToHigh';
      })
      .addCase(sortProductsByPriceLowToHigh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Sort products by name
      .addCase(sortProductsByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sortProductsByName.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
        state.filters.sortBy = 'name';
      })
      .addCase(sortProductsByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  clearCurrentProduct, 
  clearError, 
  setFilters, 
  resetFilters,
  clearFilteredProducts,
  setPriceFilter,
  setBrandFilter,
  setSortOption,
  setSearchQuery,
  clearAllFilters
} = productSlice.actions;

// Export reducer
export default productSlice.reducer;

// Add this selector to get filtered and sorted products
export const selectFilteredProducts = (state) => {
  const { products, priceFilter, brandFilter, sortOption, searchQuery } = state.products;
  
  if (!products || products.length === 0) return [];
  
  let filteredProducts = [...products];
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query) ||
      (product.brand && product.brand.toLowerCase().includes(query))
    );
  }
  
  // Apply price filter
  if (priceFilter) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= priceFilter.min && product.price <= priceFilter.max
    );
  }
  
  // Apply brand filter
  if (brandFilter && brandFilter.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.brand && brandFilter.includes(product.brand)
    );
  }
  
  // Apply sorting
  if (sortOption) {
    const { by, order } = sortOption;
    
    filteredProducts.sort((a, b) => {
      let comparison = 0;
      
      switch (by) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'newest':
          comparison = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          break;
        case 'featured':
        default:
          // Default sorting (featured products first, then by name)
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  }
  
  return filteredProducts;
}; 