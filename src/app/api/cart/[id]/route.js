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
      whereClause.userId = session.user.id
    } else {
      whereClause.sessionId = sessionId
      whereClause.userId = null
    }
    
    // Find the cart item
    const existingCartItem = await prisma.cartItem.findFirst({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            availability: true,
            stockQuantity: true,
            isActive: true
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
    if (!existingCartItem.product.isActive || existingCartItem.product.availability === 'Out of Stock') {
      return NextResponse.json(
        { success: false, error: 'Product is no longer available' },
        { status: 400 }
      )
    }
    
    // Check stock availability
    if (existingCartItem.product.stockQuantity > 0 && quantity > existingCartItem.product.stockQuantity) {
      return NextResponse.json(
        { success: false, error: `Only ${existingCartItem.product.stockQuantity} items available in stock` },
        { status: 400 }
      )
    }
    
    // Update the cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: {
        quantity: parseInt(quantity),
        selectedSize: selectedSize !== undefined ? selectedSize : existingCartItem.selectedSize,
        selectedColor: selectedColor !== undefined ? selectedColor : existingCartItem.selectedColor,
        priceAtTime: existingCartItem.product.price // Update price in case it changed
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              where: { isPrimary: true },
              take: 1
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
      whereClause.userId = session.user.id
    } else {
      whereClause.sessionId = sessionId
      whereClause.userId = null
    }
    
    // Find the cart item first to verify ownership
    const existingCartItem = await prisma.cartItem.findFirst({
      where: whereClause
    })
    
    if (!existingCartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      )
    }
    
    // Delete the cart item
    await prisma.cartItem.delete({
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
