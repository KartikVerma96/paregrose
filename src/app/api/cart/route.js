import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { parseUserId } from '@/lib/userId'

// GET /api/cart - Get user's cart items
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    // Get session ID from headers or query params (for guest users)
    const sessionId = request.headers.get('x-session-id') || searchParams.get('sessionId')
    
    // Return empty cart if no session and no session ID
    if (!session?.user?.id && !sessionId) {
      return NextResponse.json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalAmount: 0,
          formattedTotalAmount: '₹0'
        }
      })
    }
    
    // Build where clause for cart items
    const whereClause = {}
    if (session?.user?.id) {
      // Convert user ID to integer using helper function (validates safe integer range)
      const userId = parseUserId(session.user.id);
      if (userId && userId > 0) {
        whereClause.user_id = userId;
      } else {
        console.error("Invalid user ID in session:", session.user.id);
        // Return empty cart instead of error
        return NextResponse.json({
          success: true,
          data: {
            items: [],
            totalItems: 0,
            totalAmount: 0,
            formattedTotalAmount: '₹0'
          }
        });
      }
    } else if (sessionId) {
      whereClause.session_id = sessionId
      whereClause.user_id = null // Only guest session items
    }
    
    const cartItems = await prisma.cart_items.findMany({
      where: whereClause,
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
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    
    // Calculate totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price_at_time) * item.quantity), 0)
    
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
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    
    // Return empty cart on error instead of failing completely
    return NextResponse.json({
      success: true,
      data: {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        formattedTotalAmount: '₹0'
      }
    })
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  try {
    console.log('🛒 POST /api/cart - Add to cart request');
    const session = await getServerSession(authOptions)
    console.log('👤 Session user:', session?.user?.email || 'Guest');
    
    const body = await request.json()
    console.log('📦 Request body:', body);
    
    const { productId, quantity = 1, selectedSize, selectedColor } = body
    
    // Validate required fields
    if (!productId) {
      console.error('❌ Product ID missing');
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    // Get session ID for guest users
    const sessionId = request.headers.get('x-session-id')
    console.log('🔑 Session ID from header:', sessionId);
    
    if (!session?.user?.id && !sessionId) {
      console.error('❌ No session ID for guest user');
      return NextResponse.json(
        { success: false, error: 'Session ID required for guest users' },
        { status: 400 }
      )
    }
    
    // Check if product exists and is available
    const product = await prisma.products.findUnique({
      where: { id: parseInt(productId) },
      select: {
        id: true,
        name: true,
        price: true,
        availability: true,
        stock_quantity: true,
        is_active: true
      }
    })
    
    if (!product || !product.is_active) {
      return NextResponse.json(
        { success: false, error: 'Product not found or not available' },
        { status: 404 }
      )
    }
    
    if (product.availability === 'Out_of_Stock') {
      return NextResponse.json(
        { success: false, error: 'Product is out of stock' },
        { status: 400 }
      )
    }
    
    // Check stock availability
    if (product.stock_quantity > 0 && quantity > product.stock_quantity) {
      return NextResponse.json(
        { success: false, error: `Only ${product.stock_quantity} items available in stock` },
        { status: 400 }
      )
    }
    
    // Build where clause to check for existing cart item
    const whereClause = {
      product_id: parseInt(productId),
      selected_size: selectedSize || null,
      selected_color: selectedColor || null
    }
    
    if (session?.user?.id) {
      // Convert user ID to integer using helper function (validates safe integer range)
      const userId = parseUserId(session.user.id);
      if (userId && userId > 0) {
        whereClause.user_id = userId;
      } else {
        console.error("Invalid user ID in session for cart POST:", session.user.id);
        return NextResponse.json(
          { success: false, error: 'Invalid user session' },
          { status: 400 }
        );
      }
      // Don't include session_id in where clause for logged-in users
    } else {
      whereClause.session_id = sessionId
      whereClause.user_id = null
    }
    
    // Check if item already exists in cart
    const existingCartItem = await prisma.cart_items.findFirst({
      where: whereClause
    })
    
    if (existingCartItem) {
      // Update quantity of existing item
      const newQuantity = existingCartItem.quantity + parseInt(quantity)
      
      // Check stock again for updated quantity
      if (product.stock_quantity > 0 && newQuantity > product.stock_quantity) {
        return NextResponse.json(
          { success: false, error: `Only ${product.stock_quantity} items available in stock` },
          { status: 400 }
        )
      }
      
      const updatedCartItem = await prisma.cart_items.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
          price_at_time: product.price // Update price in case it changed
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
        message: 'Cart item quantity updated'
      })
    } else {
      // Create new cart item
      // Build create data
      const createData = {
        product_id: parseInt(productId),
        quantity: parseInt(quantity),
        selected_size: selectedSize || null,
        selected_color: selectedColor || null,
        price_at_time: product.price
      };
      
      // Add user_id for logged-in users OR session_id for guests
      if (session?.user?.id) {
        // Convert user ID to integer (it might be a string from OAuth)
        const userId = typeof session.user.id === 'string' 
          ? parseInt(session.user.id, 10) 
          : session.user.id;
        if (!isNaN(userId)) {
          createData.user_id = userId;
          createData.session_id = `user_${userId}`; // Store user-based session ID
        }
      } else {
        createData.session_id = sessionId;
        createData.user_id = null;
      }
      
      console.log('💾 Creating new cart item with data:', createData);
      
      const newCartItem = await prisma.cart_items.create({
        data: createData,
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
      
      console.log('✅ Cart item created successfully:', newCartItem.id);
      
      return NextResponse.json({
        success: true,
        data: newCartItem,
        message: 'Item added to cart successfully'
      }, { status: 201 })
    }
    
  } catch (error) {
    console.error('❌ Error adding to cart:', error)
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add item to cart' },
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
      // Convert user ID to integer using helper function (validates safe integer range)
      const userId = parseUserId(session.user.id);
      if (userId && userId > 0) {
        whereClause.user_id = userId;
      } else {
        console.error("Invalid user ID in session for cart POST:", session.user.id);
        return NextResponse.json(
          { success: false, error: 'Invalid user session' },
          { status: 400 }
        );
      }
    } else if (sessionId) {
      whereClause.session_id = sessionId
      whereClause.user_id = null
    }
    
    console.log('🗑️ Clearing cart with where clause:', whereClause);
    
    // Delete all cart items for the user/session
    const deletedItems = await prisma.cart_items.deleteMany({
      where: whereClause
    })
    
    console.log('✅ Deleted items count:', deletedItems.count);
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${deletedItems.count} items from cart`,
      deletedCount: deletedItems.count
    })
    
  } catch (error) {
    console.error('❌ Error clearing cart:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear cart' },
      { status: 500 }
    )
  }
}
