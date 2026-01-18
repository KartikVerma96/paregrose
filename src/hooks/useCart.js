import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  setCart,
  clearError,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartSubtotal,
  selectIsInCart,
  selectCartItemQuantity,
} from '@/features/cart/cartSlice';

// Custom hook for cart state and actions
export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // Selectors
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const subtotal = useSelector(selectCartSubtotal);
  const isInCart = useCallback(
    (productId) => items.some(item => item.id === productId),
    [items]
  );
  const getItemQuantity = useCallback(
    (productId) => {
      const item = items.find(item => item.id === productId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  // Actions
  const addItem = useCallback(
    (product) => {
      dispatch(addToCart(product));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  const updateItemQuantity = useCallback(
    (productId, quantity) => {
      dispatch(updateQuantity({ productId, quantity }));
    },
    [dispatch]
  );

  const incrementItemQuantity = useCallback(
    (productId) => {
      dispatch(incrementQuantity(productId));
    },
    [dispatch]
  );

  const decrementItemQuantity = useCallback(
    (productId) => {
      dispatch(decrementQuantity(productId));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const setItems = useCallback(
    (items) => {
      dispatch(setCart(items));
    },
    [dispatch]
  );

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Toggle function - adds if not in cart, removes if already in cart
  const toggleCart = useCallback(
    (product) => {
      const isCurrentlyInCart = items.some(item => item.id === product.id);
      if (isCurrentlyInCart) {
        removeItem(product.id);
      } else {
        addItem(product);
      }
    },
    [items, addItem, removeItem]
  );

  // Calculate savings
  const savings = subtotal - total;

  return {
    // State
    items,
    count,
    total,
    subtotal,
    savings,
    loading: cart.loading,
    error: cart.error,
    
    // Actions
    addItem,
    removeItem,
    updateItemQuantity,
    incrementItemQuantity,
    decrementItemQuantity,
    clearAll,
    setItems,
    clearError: clearErrorAction,
    toggleCart,
    isInCart,
    getItemQuantity,
  };
};
