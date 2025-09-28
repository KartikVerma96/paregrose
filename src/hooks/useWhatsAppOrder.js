import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useAlert } from '@/contexts/AlertContext'
import { 
  createWhatsAppOrder,
  getWhatsAppOrder,
  updateWhatsAppOrderStatus,
  getWhatsAppOrders,
  formatCartItemsForWhatsApp,
  openWhatsApp,
  formatOrderForDisplay
} from '@/lib/whatsapp'

// WhatsApp order management hook
export const useWhatsAppOrder = () => {
  const { data: session } = useSession()
  const { showSuccess, showError } = useAlert()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Create WhatsApp order from cart
  const createOrder = useCallback(async (cartItems, customerDetails) => {
    if (!session?.user?.id) {
      showError("Login Required", "Please log in to create an order")
      return null
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const orderData = {
        cartItems: formatCartItemsForWhatsApp(cartItems),
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        customerEmail: customerDetails.email || null,
        notes: customerDetails.notes || null
      }
      
      const result = await createWhatsAppOrder(orderData)
      
      showSuccess("Order Created!", "Your WhatsApp order has been generated successfully")
      return result
    } catch (err) {
      console.error('Error creating WhatsApp order:', err)
      setError(err.message)
      showError("Order Error", err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [session, showSuccess, showError])

  // Get order details
  const getOrder = useCallback(async (orderId) => {
    try {
      setLoading(true)
      setError(null)
      
      const order = await getWhatsAppOrder(orderId)
      return formatOrderForDisplay(order)
    } catch (err) {
      console.error('Error fetching order:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update order status
  const updateOrderStatus = useCallback(async (orderId, status, notes = null) => {
    try {
      setLoading(true)
      setError(null)
      
      const updatedOrder = await updateWhatsAppOrderStatus(orderId, status, notes)
      
      showSuccess("Status Updated", "Order status has been updated successfully")
      return formatOrderForDisplay(updatedOrder)
    } catch (err) {
      console.error('Error updating order status:', err)
      setError(err.message)
      showError("Update Error", err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  // Get all orders
  const getOrders = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const ordersData = await getWhatsAppOrders(filters)
      
      return {
        ...ordersData,
        orders: ordersData.orders.map(formatOrderForDisplay)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Share order to WhatsApp
  const shareToWhatsApp = useCallback((order) => {
    try {
      if (order.whatsappUrl) {
        window.open(order.whatsappUrl, '_blank')
      } else {
        showError("Share Error", "WhatsApp URL not available for this order")
      }
    } catch (err) {
      console.error('Error sharing to WhatsApp:', err)
      showError("Share Error", "Failed to open WhatsApp")
    }
  }, [showError])

  // Create and share order in one action
  const createAndShareOrder = useCallback(async (cartItems, customerDetails) => {
    try {
      const orderResult = await createOrder(cartItems, customerDetails)
      
      if (orderResult && orderResult.whatsappUrl) {
        // Automatically open WhatsApp
        setTimeout(() => {
          window.open(orderResult.whatsappUrl, '_blank')
        }, 1000)
        
        return orderResult
      }
    } catch (err) {
      console.error('Error creating and sharing order:', err)
      throw err
    }
  }, [createOrder])

  // Validate customer details
  const validateCustomerDetails = useCallback((details) => {
    const errors = []
    
    if (!details.name || details.name.trim().length < 2) {
      errors.push('Please enter a valid name (at least 2 characters)')
    }
    
    if (!details.phone || !/^[\+]?[1-9][\d]{0,15}$/.test(details.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number')
    }
    
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.push('Please enter a valid email address')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }, [])

  // Validate cart items
  const validateCartItems = useCallback((cartItems) => {
    const errors = []
    
    if (!cartItems || cartItems.length === 0) {
      errors.push('Your cart is empty')
    }
    
    cartItems.forEach((item, index) => {
      if (!item.name || !item.price || !item.quantity) {
        errors.push(`Item ${index + 1} is missing required information`)
      }
      
      if (parseFloat(item.price) <= 0) {
        errors.push(`Item ${index + 1} has invalid price`)
      }
      
      if (parseInt(item.quantity) <= 0) {
        errors.push(`Item ${index + 1} has invalid quantity`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }, [])

  return {
    // State
    loading,
    error,
    
    // Actions
    createOrder,
    getOrder,
    updateOrderStatus,
    getOrders,
    shareToWhatsApp,
    createAndShareOrder,
    
    // Validation
    validateCustomerDetails,
    validateCartItems,
    
    // Utility
    clearError: () => setError(null)
  }
}
