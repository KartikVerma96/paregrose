import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useAlert } from '@/contexts/AlertContext'
import { 
  fetchWishlistItems, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  checkWishlistStatus,
  formatWishlistItemForDisplay,
  calculateWishlistTotals
} from '@/lib/wishlist'

// Enhanced wishlist hook that integrates with database
export const useWishlistDB = () => {
  const { data: session } = useSession()
  const { showSuccess, showError } = useAlert()
  
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  // Load wishlist items on mount and when session changes
  useEffect(() => {
    if (session?.user?.id) {
      loadWishlistItems()
    } else {
      setWishlistItems([])
    }
  }, [session, loadWishlistItems])

  // Load wishlist items from database
  const loadWishlistItems = useCallback(async () => {
    if (!session?.user?.id) return
    
    try {
      setLoading(true)
      setError(null)
      
      const wishlistData = await fetchWishlistItems()
      setWishlistItems(wishlistData.items || [])
    } catch (err) {
      console.error('Error loading wishlist items:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [session])

  // Add item to wishlist
  const addItem = useCallback(async (product) => {
    if (!session?.user?.id) {
      showError("Login Required", "Please log in to add items to your wishlist")
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const result = await addToWishlist(product.id)
      
      // Reload wishlist items to get updated data
      await loadWishlistItems()
      
      showSuccess("Added to Wishlist", `${product.name} has been added to your wishlist!`)
      return result
    } catch (err) {
      console.error('Error adding to wishlist:', err)
      setError(err.message)
      
      // Handle specific error messages
      if (err.message.includes('already in your wishlist')) {
        showError("Already in Wishlist", "This item is already in your wishlist")
      } else {
        showError("Wishlist Error", err.message)
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, loadWishlistItems, showSuccess, showError])

  // Remove item from wishlist
  const removeItem = useCallback(async (wishlistItemId) => {
    if (!session?.user?.id) {
      showError("Login Required", "Please log in to manage your wishlist")
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      await removeFromWishlist(wishlistItemId)
      
      // Reload wishlist items to get updated data
      await loadWishlistItems()
      
      showSuccess("Removed from Wishlist", "Item has been removed from your wishlist")
    } catch (err) {
      console.error('Error removing from wishlist:', err)
      setError(err.message)
      showError("Wishlist Error", err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, loadWishlistItems, showSuccess, showError])

  // Clear entire wishlist
  const clearAll = useCallback(async () => {
    if (!session?.user?.id) {
      showError("Login Required", "Please log in to manage your wishlist")
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      await clearWishlist()
      setWishlistItems([])
      
      showSuccess("Wishlist Cleared", "All items have been removed from your wishlist")
    } catch (err) {
      console.error('Error clearing wishlist:', err)
      setError(err.message)
      showError("Wishlist Error", err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, showSuccess, showError])

  // Check if product is in wishlist
  const isInWishlist = useCallback(async (productId) => {
    if (!session?.user?.id) return false
    
    try {
      setIsCheckingStatus(true)
      const status = await checkWishlistStatus(productId)
      return status.isInWishlist
    } catch (err) {
      console.error('Error checking wishlist status:', err)
      return false
    } finally {
      setIsCheckingStatus(false)
    }
  }, [session])

  // Toggle wishlist item (add if not in wishlist, remove if in wishlist)
  const toggleWishlist = useCallback(async (product) => {
    if (!session?.user?.id) {
      showError("Login Required", "Please log in to add items to your wishlist")
      return
    }
    
    const existingItem = wishlistItems.find(item => item.product.id === product.id)
    
    if (existingItem) {
      await removeItem(existingItem.id)
    } else {
      await addItem(product)
    }
  }, [wishlistItems, addItem, removeItem, session, showError])

  // Move item from wishlist to cart (helper function)
  const moveToCart = useCallback(async (product, cartAddFunction) => {
    try {
      // Find the wishlist item
      const wishlistItem = wishlistItems.find(item => item.product.id === product.id)
      
      if (wishlistItem) {
        // Add to cart
        await cartAddFunction(product)
        
        // Remove from wishlist
        await removeItem(wishlistItem.id)
        
        showSuccess("Moved to Cart", `${product.name} has been moved to your cart`)
      }
    } catch (err) {
      console.error('Error moving to cart:', err)
      showError("Error", "Failed to move item to cart")
    }
  }, [wishlistItems, removeItem, showSuccess, showError])

  // Calculate wishlist totals
  const totals = calculateWishlistTotals(wishlistItems)

  // Format wishlist items for display
  const formattedItems = wishlistItems.map(formatWishlistItemForDisplay)

  return {
    // State
    items: formattedItems,
    rawItems: wishlistItems,
    count: totals.totalItems,
    totalValue: totals.totalValue,
    formattedTotalValue: totals.formattedTotalValue,
    totalSavings: totals.totalSavings,
    formattedTotalSavings: totals.formattedTotalSavings,
    loading,
    error,
    isCheckingStatus,
    isAuthenticated: !!session?.user?.id,
    
    // Actions
    addItem,
    removeItem,
    clearAll,
    toggleWishlist,
    isInWishlist,
    moveToCart,
    loadWishlistItems,
    
    // Utility
    refreshWishlist: loadWishlistItems
  }
}
