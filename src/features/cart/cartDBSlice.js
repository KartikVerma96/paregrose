import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchCartItems, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  formatCartItemForDisplay,
  calculateCartTotals,
  getOrCreateSessionId
} from '@/lib/cart';

// Async thunks
export const loadCart = createAsyncThunk(
  'cartDB/loadCart',
  async ({ userId, sessionId }, { rejectWithValue }) => {
    try {
      const currentSessionId = userId ? null : sessionId;
      const result = await fetchCartItems(currentSessionId);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cartDB/addItem',
  async ({ product, quantity, selectedSize, selectedColor, userId, sessionId }, { rejectWithValue, dispatch }) => {
    try {
      const currentSessionId = userId ? null : sessionId;
      await addToCart(product.id, quantity, selectedSize, selectedColor, currentSessionId);
      // Reload cart after adding
      await dispatch(loadCart({ userId, sessionId }));
      return { productName: product.name };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cartDB/updateQuantity',
  async ({ cartItemId, quantity, selectedSize, selectedColor, userId, sessionId }, { rejectWithValue, dispatch }) => {
    try {
      const currentSessionId = userId ? null : sessionId;
      await updateCartItem(cartItemId, quantity, selectedSize, selectedColor, currentSessionId);
      // Reload cart after updating
      await dispatch(loadCart({ userId, sessionId }));
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cartDB/removeItem',
  async ({ cartItemId, userId, sessionId }, { rejectWithValue, dispatch }) => {
    try {
      const currentSessionId = userId ? null : sessionId;
      await removeFromCart(cartItemId, currentSessionId);
      // Reload cart after removing
      await dispatch(loadCart({ userId, sessionId }));
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearAllCart = createAsyncThunk(
  'cartDB/clearAll',
  async ({ userId, sessionId }, { rejectWithValue, dispatch }) => {
    try {
      const currentSessionId = userId ? null : sessionId;
      await clearCart(currentSessionId);
      // Reload cart after clearing
      await dispatch(loadCart({ userId, sessionId }));
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartDBSlice = createSlice({
  name: 'cartDB',
  initialState: {
    items: [],
    rawItems: [],
    count: 0,
    total: 0,
    loading: false,
    error: null,
    sessionId: null,
  },
  reducers: {
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Cart
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.rawItems = action.payload.items || [];
        state.items = (action.payload.items || []).map(formatCartItemForDisplay);
        const totals = calculateCartTotals(action.payload.items || []);
        state.count = totals.totalItems;
        state.total = totals.totalAmount;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        // Don't set error if cart is empty (initial load failure is OK)
        // Only set error if we had items before and now failed
        if (state.rawItems.length > 0) {
          state.error = action.payload;
        } else {
          // For initial load failures, just ensure empty state
          state.rawItems = [];
          state.items = [];
          state.count = 0;
          state.total = 0;
          state.error = null;
        }
      })
      // Add Item
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearAllCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearAllCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(clearAllCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSessionId, clearError } = cartDBSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cartDB.items;
export const selectCartCount = (state) => state.cartDB.count;
export const selectCartTotal = (state) => state.cartDB.total;
export const selectCartLoading = (state) => state.cartDB.loading;
export const selectCartError = (state) => state.cartDB.error;
export const selectIsInCart = (productId) => (state) => 
  state.cartDB.rawItems.some(item => item.product_id === productId || item.product?.id === productId);

export default cartDBSlice.reducer;

