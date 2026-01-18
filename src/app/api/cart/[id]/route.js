import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params
    const body = await request.json()
    
    const { quantity, selectedSize, selectedColor } = body
    
    // Validate quantity
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Valid quantity is required' },
        { status: 400 }
      )
    }
    
    // Get session ID for guest users
    const sessionId = request.headers.get('x-session-id')
    
    if (!session?.user?.id && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required for guest users' },
        { status: 400 }
      )
    }
    
    // Build where clause to find the cart item
    const whereClause = { id: parseInt(id) }
    
    if (session?.user?.id) {
      // Convert user ID to integer (it might be a string from OAuth)
      const userId = typeof session.user.id === 'string' 
        ? parseInt(session.user.id, 10) 
        : session.user.id;
      if (!isNaN(userId)) {
        whereClause.user_id = userId;
      }
    } else {
      whereClause.session_id = sessionId
      whereClause.user_id = null
    }
    
    // Find the cart item
    const existingCartItem = await prisma.cart_items.findFirst({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            availability: true,
            stock_quantity: true,
            is_active: true
          }
        }
      }
    })
    
    if (!existingCartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      )
    }
    
    // Check product availability
    if (!existingCartItem.product.is_active || existingCartItem.product.availability === 'Out_of_Stock') {
      return NextResponse.json(
        { success: false, error: 'Product is no longer available' },
        { status: 400 }
      )
    }
    
    // Check stock availability
    if (existingCartItem.product.stock_quantity > 0 && quantity > existingCartItem.product.stock_quantity) {
      return NextResponse.json(
        { success: false, error: `Only ${existingCartItem.product.stock_quantity} items available in stock` },
        { status: 400 }
      )
    }
    
    // Update the cart item
    const updatedCartItem = await prisma.cart_items.update({
      where: { id: parseInt(id) },
      data: {
        quantity: parseInt(quantity),
        selected_size: selectedSize !== undefined ? selectedSize : existingCartItem.selected_size,
        selected_color: selectedColor !== undefined ? selectedColor : existingCartItem.selected_color,
        price_at_time: existingCartItem.product.price // Update price in case it changed
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              where: { is_primary: true },
              take: 1,
              orderBy: { sort_order: 'asc' }
            }
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedCartItem,
      message: 'Cart item updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params
    
    // Get session ID for guest users
    const sessionId = request.headers.get('x-session-id')
    
    if (!session?.user?.id && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required for guest users' },
        { status: 400 }
      )
    }
    
    // Build where clause to find the cart item
    const whereClause = { id: parseInt(id) }
    
    if (session?.user?.id) {
      // Convert user ID to integer (it might be a string from OAuth)
      const userId = typeof session.user.id === 'string' 
        ? parseInt(session.user.id, 10) 
        : session.user.id;
      if (!isNaN(userId)) {
        whereClause.user_id = userId;
      }
    } else {
      whereClause.session_id = sessionId
      whereClause.user_id = null
    }
    
    // Find the cart item first to verify ownership
    const existingCartItem = await prisma.cart_items.findFirst({
      where: whereClause
    })
    
    if (!existingCartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      )
    }
    
    // Delete the cart item
    await prisma.cart_items.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    })
    
  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
