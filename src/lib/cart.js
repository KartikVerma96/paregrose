// Cart utility functions for client-side usage

// Generate a unique session ID for guest users
export function generateSessionId() {
  return 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

// Get session ID from localStorage or generate new one
export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return null
  
  let sessionId = localStorage.getItem('cart_session_id')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('cart_session_id', sessionId)
  }
  return sessionId
}

// Fetch cart items
export async function fetchCartItems(sessionId) {
  try {
    const headers = {}
    if (sessionId) {
      headers['x-session-id'] = sessionId
    }
    
    const response = await fetch('/api/cart', {
      headers,
      credentials: 'include' // Include cookies for session
    })
    
    if (!response.ok) {
      // If response is not ok, return empty cart instead of throwing
      console.warn('Cart API returned non-OK status:', response.status)
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        formattedTotalAmount: '₹0'
      }
    }
    
    const result = await response.json()
    
    if (!result.success) {
      console.warn('Cart API returned success:false:', result.error)
      // Return empty cart instead of throwing error
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        formattedTotalAmount: '₹0'
      }
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching cart items:', error)
    // Return empty cart instead of throwing error to prevent UI crashes
    return {
      items: [],
      totalItems: 0,
      totalAmount: 0,
      formattedTotalAmount: '₹0'
    }
  }
}

// Add item to cart
export async function addToCart(productId, quantity = 1, selectedSize = null, selectedColor = null, sessionId = null) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (sessionId) {
      headers['x-session-id'] = sessionId
    }
    
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        productId,
        quantity,
        selectedSize,
        selectedColor
      })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to add item to cart')
    }
    
    return result.data
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

// Update cart item quantity
export async function updateCartItem(cartItemId, quantity, selectedSize = null, selectedColor = null, sessionId = null) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (sessionId) {
      headers['x-session-id'] = sessionId
    }
    
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        quantity,
        selectedSize,
        selectedColor
      })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update cart item')
    }
    
    return result.data
  } catch (error) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

// Remove item from cart
export async function removeFromCart(cartItemId, sessionId = null) {
  try {
    const headers = {}
    
    if (sessionId) {
      headers['x-session-id'] = sessionId
    }
    
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: 'DELETE',
      headers
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to remove item from cart')
    }
    
    return result.message
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

// Clear entire cart
export async function clearCart(sessionId = null) {
  try {
    const headers = {}
    
    if (sessionId) {
      headers['x-session-id'] = sessionId
    }
    
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to clear cart')
    }
    
    return result.message
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}

// Helper function to format cart item for display
export function formatCartItemForDisplay(cartItem) {
  const product = cartItem.product
  const primaryImage = product.images?.[0]
  
  return {
    id: cartItem.id,
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: parseFloat(cartItem.price_at_time),
    formattedPrice: `₹${parseFloat(cartItem.price_at_time).toLocaleString('en-IN')}`,
    quantity: cartItem.quantity,
    selectedSize: cartItem.selected_size,
    selectedColor: cartItem.selected_color,
    totalPrice: parseFloat(cartItem.price_at_time) * cartItem.quantity,
    formattedTotalPrice: `₹${(parseFloat(cartItem.price_at_time) * cartItem.quantity).toLocaleString('en-IN')}`,
    image: primaryImage?.image_url || primaryImage?.imageUrl || null,
    category: product.category?.name,
    availability: product.availability,
    stockQuantity: product.stock_quantity,
    createdAt: cartItem.created_at,
    updatedAt: cartItem.updated_at
  }
}

// Helper function to calculate cart totals
export function calculateCartTotals(cartItems) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price_at_time) * item.quantity), 0)
  
  return {
    totalItems,
    totalAmount,
    formattedTotalAmount: `₹${totalAmount.toLocaleString('en-IN')}`
  }
}
