import { createSlice } from '@reduxjs/toolkit';

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }
  return [];
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        existingItem.quantity += 1;
      } else {
        // If item doesn't exist, add it with quantity 1
        state.items.push({
          id: product.id,
          name: product.name,
          image: product.image,
          originalPrice: product.originalPrice || product.price,
          discountedPrice: product.discountedPrice || product.price,
          category: product.category,
          rating: product.rating,
          reviews: product.reviews,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
      }
      saveCartToStorage(state.items);
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      saveCartToStorage(state.items);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(item => item.id !== productId);
        } else {
          item.quantity = quantity;
        }
        saveCartToStorage(state.items);
      }
    },
    
    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        item.quantity += 1;
        saveCartToStorage(state.items);
      }
    },
    
    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove item if quantity becomes 0
          state.items = state.items.filter(item => item.id !== productId);
        }
        saveCartToStorage(state.items);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    
    setCart: (state, action) => {
      state.items = action.payload;
      saveCartToStorage(state.items);
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  setCart,
  clearError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
export const selectCartSubtotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
export const selectIsInCart = (productId) => (state) => 
  state.cart.items.some(item => item.id === productId);
export const selectCartItemQuantity = (productId) => (state) => {
  const item = state.cart.items.find(item => item.id === productId);
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;
