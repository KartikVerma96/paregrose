import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/wishlist - Get user's wishlist items
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const wishlistItems = await prisma.wishlist_items.findMany({
      where: {
        user_id: session.user.id
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: { sort_order: 'asc' }
            },
            _count: {
              select: {
                reviews: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        items: wishlistItems,
        totalItems: wishlistItems.length
      }
    })
    
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist items' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { productId } = body
    
    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    // Check if product exists and is active
    const product = await prisma.products.findUnique({
      where: { id: parseInt(productId) },
      select: {
        id: true,
        name: true,
        is_active: true
      }
    })
    
    if (!product || !product.is_active) {
      return NextResponse.json(
        { success: false, error: 'Product not found or not available' },
        { status: 404 }
      )
    }
    
    // Check if item already exists in wishlist
    const existingWishlistItem = await prisma.wishlist_items.findFirst({
      where: {
        user_id: session.user.id,
        product_id: parseInt(productId)
      }
    })
    
    if (existingWishlistItem) {
      return NextResponse.json(
        { success: false, error: 'Product is already in your wishlist' },
        { status: 409 }
      )
    }
    
    // Add item to wishlist
    const wishlistItem = await prisma.wishlist_items.create({
      data: {
        user_id: session.user.id,
        product_id: parseInt(productId)
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: { sort_order: 'asc' }
            },
            _count: {
              select: {
                reviews: true
              }
            }
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: wishlistItem,
      message: 'Item added to wishlist successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Clear entire wishlist
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Delete all wishlist items for the user
    const deletedItems = await prisma.wishlist_items.deleteMany({
      where: {
        user_id: session.user.id
      }
    })
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${deletedItems.count} items from wishlist`,
      deletedCount: deletedItems.count
    })
    
  } catch (error) {
    console.error('Error clearing wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to clear wishlist' },
      { status: 500 }
    )
  }
}
