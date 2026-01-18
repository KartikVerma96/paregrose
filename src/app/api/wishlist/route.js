import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { parseUserId } from '@/lib/userId'

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
    
    const userId = parseUserId(session.user.id);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const wishlistItems = await prisma.wishlist_items.findMany({
      where: {
        user_id: userId
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: { sortOrder: 'asc' }
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
        createdAt: 'desc'
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
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      select: {
        id: true,
        name: true,
        isActive: true
      }
    })
    
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product not found or not available' },
        { status: 404 }
      )
    }
    
    const userId = parseUserId(session.user.id);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Check if item already exists in wishlist
    const existingWishlistItem = await prisma.wishlist_items.findFirst({
      where: {
        user_id: userId,
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
        user_id: userId,
        product_id: parseInt(productId)
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: { sortOrder: 'asc' }
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
    
    const userId = parseUserId(session.user.id);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Delete all wishlist items for the user
    const deletedItems = await prisma.wishlist_items.deleteMany({
      where: {
        user_id: userId
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
