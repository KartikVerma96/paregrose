import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import wishlistReducer from '@/features/wishlist/wishlistSlice';
import cartReducer from '@/features/cart/cartSlice';
import cartDBReducer from '@/features/cart/cartDBSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    cartDB: cartDBReducer,
    // We'll add more slices here later (products, etc.)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
