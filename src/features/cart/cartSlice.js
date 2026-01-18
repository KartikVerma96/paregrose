import { createSlice } from '@reduxjs/toolkit';

// Helper function to migrate old cart data structure
const migrateCartItem = (item) => {
  return {
    ...item,
    originalPrice: typeof item.originalPrice === 'string' ? parseFloat(item.originalPrice) : item.originalPrice,
    discountedPrice: typeof item.discountedPrice === 'string' ? parseFloat(item.discountedPrice) : item.discountedPrice,
    quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
    rating: item.rating || 4.5,
    reviews: item.reviews || 0,
  };
};

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const cartItems = JSON.parse(saved);
        // Migrate old cart items to new structure
        return cartItems.map(migrateCartItem);
      }
      return [];
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
        const productPrice = parseFloat(product.price);
        const originalPrice = parseFloat(product.original_price || product.originalPrice || product.price);
        // Extract image URL from various possible structures
        let imageUrl = null;
        
        console.log('🔍 DETAILED IMAGE EXTRACTION DEBUG:');
        console.log('📦 Product object keys:', Object.keys(product));
        console.log('📷 Product.images:', product.images);
        
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          const firstImage = product.images[0];
          console.log('🖼️ First image object:', firstImage);
          console.log('🖼️ First image keys:', Object.keys(firstImage));
          
          // Try different image field names (snake_case and camelCase)
          imageUrl = firstImage.image_url ||   // Database field
                     firstImage.imageUrl ||     // Possible transformation
                     firstImage.url ||          // Alternative field
                     firstImage.src ||          // Another alternative
                     firstImage.image;          // Yet another alternative
                     
          console.log('✅ Extracted from images array:', imageUrl);
        }
        
        // Fallback to direct product image field
        if (!imageUrl) {
          imageUrl = product.image || product.imageUrl || product.image_url;
          console.log('✅ Extracted from product direct field:', imageUrl);
        }
        
        console.log('🛒 Adding to cart - Product:', product.name);
        console.log('📷 Product images array:', product.images);
        console.log('🖼️ Product.image:', product.image);
        console.log('🖼️ Product.imageUrl:', product.imageUrl);
        console.log('🖼️ Product.image_url:', product.image_url);
        console.log('✅ Extracted image URL:', imageUrl);
        
        // Warn if no image URL found but still allow adding to cart
        if (!imageUrl) {
          console.warn('⚠️ No image URL found for product:', product.name);
          console.warn('⚠️ Product will be added without image');
        }
        
        state.items.push({
          id: product.id,
          name: product.name,
          image: imageUrl,
          originalPrice: originalPrice,
          discountedPrice: productPrice,
          category: product.category,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
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
