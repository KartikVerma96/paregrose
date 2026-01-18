import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
  clearError,
  selectWishlistItems,
  selectWishlistCount,
  selectIsInWishlist,
} from '@/features/wishlist/wishlistSlice';

// Custom hook for wishlist state and actions
export const useWishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);

  // Selectors
  const items = useSelector(selectWishlistItems);
  const count = useSelector(selectWishlistCount);
  const isInWishlist = useCallback(
    (productId) => items.some(item => item.id === productId),
    [items]
  );

  // Actions
  const addItem = useCallback(
    (product) => {
      dispatch(addToWishlist(product));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId) => {
      dispatch(removeFromWishlist(productId));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearWishlist());
  }, [dispatch]);

  const setItems = useCallback(
    (items) => {
      dispatch(setWishlist(items));
    },
    [dispatch]
  );

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Toggle function - adds if not in wishlist, removes if already in wishlist
  const toggleWishlist = useCallback(
    (product) => {
      const isCurrentlyInWishlist = items.some(item => item.id === product.id);
      if (isCurrentlyInWishlist) {
        removeItem(product.id);
      } else {
        addItem(product);
      }
    },
    [items, addItem, removeItem]
  );

  return {
    // State
    items,
    count,
    loading: wishlist.loading,
    error: wishlist.error,
    
    // Actions
    addItem,
    removeItem,
    clearAll,
    setItems,
    clearError: clearErrorAction,
    toggleWishlist,
    isInWishlist,
  };
};
