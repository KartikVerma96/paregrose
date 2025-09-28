// WhatsApp utility functions for client-side usage

// Create WhatsApp order from cart
export async function createWhatsAppOrder(orderData) {
  try {
    const response = await fetch('/api/whatsapp/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create WhatsApp order')
    }
    
    return result.data
  } catch (error) {
    console.error('Error creating WhatsApp order:', error)
    throw error
  }
}

// Get WhatsApp order details
export async function getWhatsAppOrder(orderId) {
  try {
    const response = await fetch(`/api/whatsapp/order/${orderId}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch order details')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching WhatsApp order:', error)
    throw error
  }
}

// Update WhatsApp order status
export async function updateWhatsAppOrderStatus(orderId, status, notes = null) {
  try {
    const response = await fetch(`/api/whatsapp/order/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, notes })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update order status')
    }
    
    return result.data
  } catch (error) {
    console.error('Error updating WhatsApp order:', error)
    throw error
  }
}

// Get all WhatsApp orders
export async function getWhatsAppOrders(filters = {}) {
  try {
    const searchParams = new URLSearchParams()
    
    // Add filters to search params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value)
      }
    })
    
    const response = await fetch(`/api/whatsapp/orders?${searchParams.toString()}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch orders')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching WhatsApp orders:', error)
    throw error
  }
}

// Format cart items for WhatsApp order
export function formatCartItemsForWhatsApp(cartItems) {
  return cartItems.map(item => ({
    productId: item.productId,
    name: item.name,
    sku: item.sku || null,
    price: parseFloat(item.price),
    quantity: parseInt(item.quantity),
    selectedSize: item.selectedSize || null,
    selectedColor: item.selectedColor || null
  }))
}

// Generate WhatsApp share URL
export function generateWhatsAppShareUrl(phoneNumber, message) {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}

// Open WhatsApp with pre-filled message
export function openWhatsApp(phoneNumber, message) {
  const url = generateWhatsAppShareUrl(phoneNumber, message)
  window.open(url, '_blank')
}

// Helper function to format order status
export function formatOrderStatus(status) {
  const statusMap = {
    'sent': 'Sent',
    'received': 'Received',
    'confirmed': 'Confirmed',
    'cancelled': 'Cancelled',
    'completed': 'Completed'
  }
  
  return statusMap[status] || status
}

// Helper function to get status color
export function getStatusColor(status) {
  const colorMap = {
    'sent': 'blue',
    'received': 'yellow',
    'confirmed': 'green',
    'cancelled': 'red',
    'completed': 'green'
  }
  
  return colorMap[status] || 'gray'
}

// Helper function to format order for display
export function formatOrderForDisplay(order) {
  return {
    ...order,
    formattedTotalAmount: `₹${parseFloat(order.totalAmount).toLocaleString('en-IN')}`,
    formattedStatus: formatOrderStatus(order.status),
    statusColor: getStatusColor(order.status),
    itemCount: order.items?.length || 0,
    formattedCreatedAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    whatsappUrl: order.whatsappUrl || generateWhatsAppShareUrl(
      order.customerPhone,
      order.whatsappMessage
    )
  }
}

// Helper function to calculate order statistics
export function calculateOrderStatistics(orders) {
  const stats = {
    total: orders.length,
    sent: 0,
    received: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    totalValue: 0,
    averageOrderValue: 0
  }
  
  orders.forEach(order => {
    stats[order.status] = (stats[order.status] || 0) + 1
    stats.totalValue += parseFloat(order.totalAmount)
  })
  
  if (stats.total > 0) {
    stats.averageOrderValue = stats.totalValue / stats.total
  }
  
  return {
    ...stats,
    formattedTotalValue: `₹${stats.totalValue.toLocaleString('en-IN')}`,
    formattedAverageOrderValue: `₹${stats.averageOrderValue.toLocaleString('en-IN')}`
  }
}
