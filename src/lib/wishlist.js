// Wishlist utility functions for client-side usage

// Fetch wishlist items
export async function fetchWishlistItems() {
  try {
    const response = await fetch('/api/wishlist')
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch wishlist items')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching wishlist items:', error)
    throw error
  }
}

// Add item to wishlist
export async function addToWishlist(productId) {
  try {
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to add item to wishlist')
    }
    
    return result.data
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw error
  }
}

// Remove item from wishlist
export async function removeFromWishlist(wishlistItemId) {
  try {
    const response = await fetch(`/api/wishlist/${wishlistItemId}`, {
      method: 'DELETE'
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to remove item from wishlist')
    }
    
    return result.message
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw error
  }
}

// Clear entire wishlist
export async function clearWishlist() {
  try {
    const response = await fetch('/api/wishlist', {
      method: 'DELETE'
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to clear wishlist')
    }
    
    return result.message
  } catch (error) {
    console.error('Error clearing wishlist:', error)
    throw error
  }
}

// Check if product is in wishlist
export async function checkWishlistStatus(productId) {
  try {
    const response = await fetch(`/api/wishlist/check/${productId}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to check wishlist status')
    }
    
    return result.data
  } catch (error) {
    console.error('Error checking wishlist status:', error)
    throw error
  }
}

// Helper function to format wishlist item for display
export function formatWishlistItemForDisplay(wishlistItem) {
  const product = wishlistItem.product
  const primaryImage = product.images?.[0]
  
  return {
    id: wishlistItem.id,
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    formattedPrice: `₹${parseFloat(product.price).toLocaleString('en-IN')}`,
    originalPrice: product.originalPrice,
    formattedOriginalPrice: product.originalPrice ? `₹${parseFloat(product.originalPrice).toLocaleString('en-IN')}` : null,
    discountPercentage: product.originalPrice && product.originalPrice > product.price 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0,
    image: primaryImage?.imageUrl || '/images/carousel/pic_1.jpg',
    category: product.category?.name,
    availability: product.availability,
    stockQuantity: product.stockQuantity,
    totalReviews: product._count?.reviews || 0,
    addedAt: wishlistItem.createdAt
  }
}

// Helper function to calculate wishlist totals
export function calculateWishlistTotals(wishlistItems) {
  const totalItems = wishlistItems.length
  const totalValue = wishlistItems.reduce((sum, item) => sum + parseFloat(item.product.price), 0)
  const totalSavings = wishlistItems.reduce((sum, item) => {
    const savings = item.product.originalPrice && item.product.originalPrice > item.product.price
      ? item.product.originalPrice - item.product.price
      : 0
    return sum + savings
  }, 0)
  
  return {
    totalItems,
    totalValue,
    formattedTotalValue: `₹${totalValue.toLocaleString('en-IN')}`,
    totalSavings,
    formattedTotalSavings: `₹${totalSavings.toLocaleString('en-IN')}`
  }
}
