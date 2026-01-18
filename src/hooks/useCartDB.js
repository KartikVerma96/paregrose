import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useAlert } from '@/contexts/AlertContext'
import { 
  getOrCreateSessionId, 
  fetchCartItems, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  formatCartItemForDisplay,
  calculateCartTotals
} from '@/lib/cart'

// Enhanced cart hook that integrates with database
export const useCartDB = () => {
  const { data: session } = useSession()
  const { showSuccess, showError } = useAlert()
  
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  // Initialize session ID for guest users
  useEffect(() => {
    if (!session?.user?.id) {
      const guestSessionId = getOrCreateSessionId()
      setSessionId(guestSessionId)
    }
  }, [session])

  // Load cart items on mount and when session changes
  useEffect(() => {
    loadCartItems()
  }, [session, sessionId, loadCartItems])

  // Load cart items from database
  const loadCartItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const currentSessionId = session?.user?.id ? null : sessionId
      const cartData = await fetchCartItems(currentSessionId)
      
      setCartItems(cartData.items || [])
    } catch (err) {
      console.error('Error loading cart items:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [session, sessionId])

  // Add item to cart
  const addItem = useCallback(async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    try {
      setLoading(true)
      setError(null)
      
      const currentSessionId = session?.user?.id ? null : sessionId
      const result = await addToCart(product.id, quantity, selectedSize, selectedColor, currentSessionId)
      
      // Reload cart items to get updated data
      await loadCartItems()
      
      showSuccess("Added to Cart", `${product.name} has been added to your cart!`)
      return result
    } catch (err) {
      console.error('Error adding to cart:', err)
      setError(err.message)
      showError("Cart Error", err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, sessionId, loadCartItems, showSuccess, showError])

  // Update item quantity
  const updateItemQuantity = useCallback(async (cartItemId, quantity, selectedSize = null, selectedColor = null) => {
    try {
      setLoading(true)
      setError(null)
      
      const currentSessionId = session?.user?.id ? null : sessionId
      const result = await updateCartItem(cartItemId, quantity, selectedSize, selectedColor, currentSessionId)
      
      // Reload cart items to get updated data
      await loadCartItems()
      
      return result
    } catch (err) {
      console.error('Error updating cart item:', err)
      setError(err.message)
      showError("Cart Error", err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, sessionId, loadCartItems, showError])

  // Remove item from cart
  const removeItem = useCallback(async (cartItemId) => {
    try {
      setLoading(true)
      setError(null)
      
      const currentSessionId = session?.user?.id ? null : sessionId
      await removeFromCart(cartItemId, currentSessionId)
      
      // Reload cart items to get updated data
      await loadCartItems()
      
      showSuccess("Removed from Cart", "Item has been removed from your cart")
    } catch (err) {
      console.error('Error removing from cart:', err)
      setError(err.message)
      showError("Cart Error", err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, sessionId, loadCartItems, showSuccess, showError])

  // Clear entire cart
  const clearAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const currentSessionId = session?.user?.id ? null : sessionId
      await clearCart(currentSessionId)
      
      setCartItems([])
      showSuccess("Cart Cleared", "All items have been removed from your cart")
    } catch (err) {
      console.error('Error clearing cart:', err)
      setError(err.message)
      showError("Cart Error", err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, sessionId, showSuccess, showError])

  // Check if product is in cart
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.product.id === productId)
  }, [cartItems])

  // Get quantity of product in cart
  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }, [cartItems])

  // Toggle cart item (add if not in cart, remove if in cart)
  const toggleCart = useCallback(async (product) => {
    if (isInCart(product.id)) {
      const cartItem = cartItems.find(item => item.product.id === product.id)
      if (cartItem) {
        await removeItem(cartItem.id)
      }
    } else {
      await addItem(product)
    }
  }, [cartItems, isInCart, addItem, removeItem])

  // Calculate cart totals
  const totals = calculateCartTotals(cartItems)

  // Format cart items for display
  const formattedItems = cartItems.map(formatCartItemForDisplay)

  return {
    // State
    items: formattedItems,
    rawItems: cartItems,
    count: totals.totalItems,
    total: totals.totalAmount,
    formattedTotal: totals.formattedTotalAmount,
    loading,
    error,
    sessionId: session?.user?.id ? null : sessionId,
    
    // Actions
    addItem,
    removeItem,
    updateItemQuantity,
    clearAll,
    toggleCart,
    isInCart,
    getItemQuantity,
    loadCartItems,
    
    // Utility
    refreshCart: loadCartItems
  }
}
