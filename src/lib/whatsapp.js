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

// Format cart items into a simple WhatsApp message for direct contact
export function formatCartForWhatsApp(cartItems, totalAmount) {
  let message = `🛍️ *Hello Paregrose!*\n\n`
  message += `I'm interested in purchasing the following items:\n\n`
  message += `📦 *Cart Items:*\n\n`
  
  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`
    
    // Handle size
    if (item.selectedSize) {
      message += `   Size: ${item.selectedSize}\n`
    }
    
    // Handle color
    if (item.selectedColor) {
      message += `   Color: ${item.selectedColor}\n`
    }
    
    // Get price and quantity
    const quantity = parseInt(item.quantity) || 1
    const pricePerItem = parseFloat(item.price || 0)
    const itemTotal = parseFloat(item.totalPrice || pricePerItem * quantity)
    
    message += `   Quantity: ${quantity}\n`
    message += `   Price: ₹${pricePerItem.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`
    message += `   Total: ₹${itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`
  })
  
  message += `💰 *Total Amount: ₹${parseFloat(totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*\n\n`
  message += `Please help me with:\n`
  message += `• Delivery address confirmation\n`
  message += `• Payment options\n`
  message += `• Any other details needed\n\n`
  message += `Thank you! 🙏`
  
  return message
}

// Get WhatsApp business number from API
export async function getWhatsAppNumber() {
  try {
    const response = await fetch('/api/whatsapp/number')
    
    if (!response.ok) {
      console.error('WhatsApp API error:', response.status, response.statusText)
      throw new Error(`Failed to fetch WhatsApp number: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    if (!result.success || !result.data.whatsappNumber) {
      console.error('WhatsApp number not configured in database')
      throw new Error('WhatsApp business number not configured')
    }
    
    return result.data.formattedNumber || result.data.whatsappNumber.replace(/[^\d]/g, '')
  } catch (error) {
    console.error('Error fetching WhatsApp number:', error)
    throw error
  }
}

// Open WhatsApp with cart items (simplified version)
export async function openWhatsAppWithCart(cartItems, totalAmount) {
  try {
    const whatsappNumber = await getWhatsAppNumber()
    
    if (!whatsappNumber) {
      throw new Error('WhatsApp business number not configured')
    }
    
    const message = formatCartForWhatsApp(cartItems, totalAmount)
    const url = generateWhatsAppShareUrl(whatsappNumber, message)
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error opening WhatsApp:', error)
    throw error
  }
}