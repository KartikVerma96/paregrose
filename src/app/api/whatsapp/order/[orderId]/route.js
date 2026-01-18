import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/whatsapp/order/[orderId] - Get WhatsApp order details
export async function GET(request, { params }) {
  try {
    const { orderId } = params
    
    const whatsappOrder = await prisma.whatsapp_orders.findFirst({
      where: {
        OR: [
          { order_id: orderId },
          { id: parseInt(orderId) || 0 }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        whatsapp_order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: {
                  where: { is_primary: true },
                  select: { image_url: true },
                  orderBy: { sort_order: 'asc' },
                  take: 1
                }
              }
            }
          }
        }
      }
    })
    
    if (!whatsappOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: whatsappOrder
    })
    
  } catch (error) {
    console.error('Error fetching WhatsApp order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}

// PUT /api/whatsapp/order/[orderId] - Update WhatsApp order status
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { orderId } = params
    const body = await request.json()
    
    const { status, notes } = body
    
    // Validate status
    const validStatuses = ['sent', 'received', 'confirmed', 'cancelled', 'completed']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }
    
    // Find the order
    const existingOrder = await prisma.whatsapp_orders.findFirst({
      where: {
        OR: [
          { order_id: orderId },
          { id: parseInt(orderId) || 0 }
        ]
      }
    })
    
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Update the order
    const updateData = {}
    
    if (status) {
      updateData.status = status
      
      // Set timestamps based on status
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date()
      } else if (status === 'completed') {
        updateData.completed_at = new Date()
      }
    }
    
    if (notes !== undefined) {
      updateData.notes = notes
    }
    
    updateData.updated_at = new Date()
    
    const updatedOrder = await prisma.whatsapp_orders.update({
      where: { id: existingOrder.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        whatsapp_order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: {
                  where: { is_primary: true },
                  select: { image_url: true },
                  orderBy: { sort_order: 'asc' },
                  take: 1
                }
              }
            }
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order status updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating WhatsApp order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
