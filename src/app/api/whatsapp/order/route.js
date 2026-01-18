import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// POST /api/whatsapp/order - Generate WhatsApp order from cart
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    const { 
      cartItems, 
      customerName, 
      customerPhone, 
      customerEmail,
      notes 
    } = body
    
    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart items are required' },
        { status: 400 }
      )
    }
    
    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Customer name and phone number are required' },
        { status: 400 }
      )
    }
    
    // Get business settings
    const businessSettings = await prisma.business_settings.findMany({
      where: {
        setting_key: {
          in: ['whatsapp_business_number', 'business_name', 'business_address']
        }
      }
    })
    
    const settings = {}
    businessSettings.forEach(setting => {
      settings[setting.setting_key] = setting.setting_value
    })
    
    if (!settings.whatsapp_business_number) {
      return NextResponse.json(
        { success: false, error: 'WhatsApp business number not configured' },
        { status: 500 }
      )
    }
    
    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity))
    }, 0)
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // Create WhatsApp message
    const whatsappMessage = generateWhatsAppMessage({
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      cartItems,
      totalAmount,
      businessName: settings.business_name || 'Paregrose',
      businessAddress: settings.business_address,
      notes
    })
    
    // Convert user ID to integer if present
    const userId = session?.user?.id 
      ? (typeof session.user.id === 'string' ? parseInt(session.user.id, 10) : session.user.id)
      : null;
    
    // Create WhatsApp order in database
    const whatsappOrder = await prisma.whatsapp_orders.create({
      data: {
        order_id: orderId,
        user_id: userId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        whatsapp_message: whatsappMessage,
        total_amount: totalAmount,
        status: 'sent',
        notes: notes || null
      }
    })
    
    // Create order items
    const orderItems = await Promise.all(
      cartItems.map(async (item) => {
        return prisma.whatsapp_order_items.create({
          data: {
            order_id: whatsappOrder.id,
            product_id: item.productId || null,
            product_name: item.name,
            product_sku: item.sku || null,
            quantity: parseInt(item.quantity),
            unit_price: parseFloat(item.price),
            total_price: parseFloat(item.price) * parseInt(item.quantity),
            selected_size: item.selectedSize || null,
            selected_color: item.selectedColor || null
          }
        })
      })
    )
    
    // Generate WhatsApp URL
    const whatsappNumber = settings.whatsapp_business_number.replace(/[^\d]/g, '')
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    
    return NextResponse.json({
      success: true,
      data: {
        order: whatsappOrder,
        items: orderItems,
        whatsappUrl,
        totalAmount,
        formattedTotalAmount: `₹${totalAmount.toLocaleString('en-IN')}`,
        message: 'WhatsApp order generated successfully'
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating WhatsApp order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create WhatsApp order' },
      { status: 500 }
    )
  }
}

// Helper function to generate WhatsApp message
function generateWhatsAppMessage({
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  cartItems,
  totalAmount,
  businessName,
  businessAddress,
  notes
}) {
  let message = `🛍️ *New Order - ${businessName}*\n\n`
  message += `📋 *Order ID:* ${orderId}\n`
  message += `👤 *Customer:* ${customerName}\n`
  message += `📞 *Phone:* ${customerPhone}\n`
  
  if (customerEmail) {
    message += `📧 *Email:* ${customerEmail}\n`
  }
  
  message += `\n📦 *Order Items:*\n`
  
  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`
    if (item.selectedSize) {
      message += `   Size: ${item.selectedSize}\n`
    }
    if (item.selectedColor) {
      message += `   Color: ${item.selectedColor}\n`
    }
    message += `   Quantity: ${item.quantity}\n`
    message += `   Price: ₹${parseFloat(item.price).toLocaleString('en-IN')}\n`
    message += `   Total: ₹${(parseFloat(item.price) * parseInt(item.quantity)).toLocaleString('en-IN')}\n\n`
  })
  
  message += `💰 *Total Amount: ₹${totalAmount.toLocaleString('en-IN')}*\n\n`
  
  if (businessAddress) {
    message += `📍 *Delivery Address:* ${businessAddress}\n\n`
  }
  
  if (notes) {
    message += `📝 *Special Instructions:* ${notes}\n\n`
  }
  
  message += `Please confirm this order and provide delivery details.\n\n`
  message += `Thank you for choosing ${businessName}! 🙏`
  
  return message
}
