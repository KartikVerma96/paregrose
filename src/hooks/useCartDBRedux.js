import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { 
  loadCart, 
  addItemToCart, 
  updateCartItemQuantity, 
  removeCartItem, 
  clearAllCart,
  setSessionId,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartLoading,
  selectCartError,
  selectIsInCart
} from '@/features/cart/cartDBSlice';
import { getOrCreateSessionId } from '@/lib/cart';
import { useAlert } from '@/contexts/AlertContext';

export const useCartDBRedux = () => {
  const dispatch = useDispatch();
  const { data: session, status: sessionStatus } = useSession();
  const { showSuccess, showError } = useAlert();
  
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const sessionId = useSelector(state => state.cartDB.sessionId);
  
  // Initialize session ID and load cart
  useEffect(() => {
    // Don't load cart if session is still loading
    if (sessionStatus === 'loading') {
      return;
    }
    
    let currentSessionId = sessionId;
    
    if (!session?.user?.id && !currentSessionId) {
      currentSessionId = getOrCreateSessionId();
      dispatch(setSessionId(currentSessionId));
    }
    
    // Load cart items only when session is ready
    dispatch(loadCart({ 
      userId: session?.user?.id, 
      sessionId: currentSessionId 
    }));
  }, [session?.user?.id, sessionId, sessionStatus, dispatch]);
  
  // Add item to cart
  const addItem = async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    try {
      const result = await dispatch(addItemToCart({ 
        product, 
        quantity, 
        selectedSize, 
        selectedColor, 
        userId: session?.user?.id,
        sessionId: sessionId || getOrCreateSessionId()
      })).unwrap();
      
      showSuccess("Added to Cart", `${product.name} has been added to your cart!`);
      return result;
    } catch (err) {
      showError("Cart Error", err);
      throw err;
    }
  };
  
  // Update item quantity
  const updateItemQuantity = async (cartItemId, quantity, selectedSize = null, selectedColor = null) => {
    try {
      await dispatch(updateCartItemQuantity({ 
        cartItemId, 
        quantity, 
        selectedSize, 
        selectedColor,
        userId: session?.user?.id,
        sessionId: sessionId || getOrCreateSessionId()
      })).unwrap();
    } catch (err) {
      showError("Cart Error", err);
      throw err;
    }
  };
  
  // Remove item from cart
  const removeItem = async (cartItemId) => {
    try {
      await dispatch(removeCartItem({ 
        cartItemId,
        userId: session?.user?.id,
        sessionId: sessionId || getOrCreateSessionId()
      })).unwrap();
      
      showSuccess("Removed", "Item removed from cart");
    } catch (err) {
      showError("Cart Error", err);
      throw err;
    }
  };
  
  // Clear entire cart
  const clearAll = async () => {
    try {
      await dispatch(clearAllCart({
        userId: session?.user?.id,
        sessionId: sessionId || getOrCreateSessionId()
      })).unwrap();
      
      showSuccess("Cart Cleared", "All items removed from cart");
    } catch (err) {
      showError("Cart Error", err);
      throw err;
    }
  };
  
  // Get raw items for checking
  const rawItems = useSelector(state => state.cartDB.rawItems);
  
  // Check if product is in cart
  const isInCart = (productId) => {
    return rawItems.some(item => 
      item.product_id === productId || item.product?.id === productId
    );
  };
  
  // Refresh cart
  const refreshCart = () => {
    dispatch(loadCart({ 
      userId: session?.user?.id, 
      sessionId: sessionId || getOrCreateSessionId()
    }));
  };
  
  return {
    items,
    count,
    total,
    loading,
    error,
    addItem,
    removeItem,
    updateItemQuantity,
    clearAll,
    isInCart,
    refreshCart,
  };
};

