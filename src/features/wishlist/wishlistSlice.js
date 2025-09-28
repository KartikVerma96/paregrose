import { createSlice } from '@reduxjs/toolkit';

// Helper function to load wishlist from localStorage
const loadWishlistFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      return [];
    }
  }
  return [];
};

// Helper function to save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlistFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (!existingItem) {
        state.items.push({
          id: product.id,
          name: product.name,
          image: product.image,
          originalPrice: product.originalPrice || product.price,
          discountedPrice: product.discountedPrice || product.price,
          category: product.category,
          rating: product.rating,
          reviews: product.reviews,
          addedAt: new Date().toISOString(),
        });
        saveWishlistToStorage(state.items);
      }
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      saveWishlistToStorage(state.items);
    },
    
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
    
    setWishlist: (state, action) => {
      state.items = action.payload;
      saveWishlistToStorage(state.items);
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
  clearError,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (productId) => (state) => 
  state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;
