import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/cart - Get user's cart items
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    // Get session ID from headers or query params (for guest users)
    const sessionId = request.headers.get('x-session-id') || searchParams.get('sessionId')
    
    if (!session?.user?.id && !sessionId) {
      return NextResponse.json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalAmount: 0
        }
      })
    }
    
    // Build where clause for cart items
    const whereClause = {}
    if (session?.user?.id) {
      whereClause.userId = session.user.id
    } else if (sessionId) {
      whereClause.sessionId = sessionId
      whereClause.userId = null // Only guest session items
    }
    
    const cartItems = await prisma.cartItem.findMany({
      where: whereClause,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Calculate totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0)
    
    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        totalItems,
        totalAmount,
        formattedTotalAmount: `₹${totalAmount.toLocaleString('en-IN')}`
      }
    })
    
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart items' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    const { productId, quantity = 1, selectedSize, selectedColor } = body
    
    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
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
    
    // Check if product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      select: {
        id: true,
        name: true,
        price: true,
        availability: true,
        stockQuantity: true,
        isActive: true
      }
    })
    
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product not found or not available' },
        { status: 404 }
      )
    }
    
    if (product.availability === 'Out of Stock') {
      return NextResponse.json(
        { success: false, error: 'Product is out of stock' },
        { status: 400 }
      )
    }
    
    // Check stock availability
    if (product.stockQuantity > 0 && quantity > product.stockQuantity) {
      return NextResponse.json(
        { success: false, error: `Only ${product.stockQuantity} items available in stock` },
        { status: 400 }
      )
    }
    
    // Build where clause to check for existing cart item
    const whereClause = {
      productId: parseInt(productId),
      selectedSize: selectedSize || null,
      selectedColor: selectedColor || null
    }
    
    if (session?.user?.id) {
      whereClause.userId = session.user.id
      whereClause.sessionId = null
    } else {
      whereClause.sessionId = sessionId
      whereClause.userId = null
    }
    
    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: whereClause
    })
    
    if (existingCartItem) {
      // Update quantity of existing item
      const newQuantity = existingCartItem.quantity + parseInt(quantity)
      
      // Check stock again for updated quantity
      if (product.stockQuantity > 0 && newQuantity > product.stockQuantity) {
        return NextResponse.json(
          { success: false, error: `Only ${product.stockQuantity} items available in stock` },
          { status: 400 }
        )
      }
      
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
          priceAtTime: product.price // Update price in case it changed
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
        message: 'Cart item quantity updated'
      })
    } else {
      // Create new cart item
      const newCartItem = await prisma.cartItem.create({
        data: {
          sessionId: sessionId || null,
          userId: session?.user?.id || null,
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          selectedSize: selectedSize || null,
          selectedColor: selectedColor || null,
          priceAtTime: product.price
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
        data: newCartItem,
        message: 'Item added to cart successfully'
      }, { status: 201 })
    }
    
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    // Get session ID for guest users
    const sessionId = request.headers.get('x-session-id') || searchParams.get('sessionId')
    
    if (!session?.user?.id && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required for guest users' },
        { status: 400 }
      )
    }
    
    // Build where clause
    const whereClause = {}
    if (session?.user?.id) {
      whereClause.userId = session.user.id
    } else if (sessionId) {
      whereClause.sessionId = sessionId
      whereClause.userId = null
    }
    
    // Delete all cart items for the user/session
    const deletedItems = await prisma.cartItem.deleteMany({
      where: whereClause
    })
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${deletedItems.count} items from cart`,
      deletedCount: deletedItems.count
    })
    
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}
