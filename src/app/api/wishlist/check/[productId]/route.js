import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/wishlist/check/[productId] - Check if product is in wishlist
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { productId } = params
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        data: {
          isInWishlist: false,
          wishlistItemId: null
        }
      })
    }
    
    // Check if product exists in user's wishlist
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        productId: parseInt(productId)
      },
      select: {
        id: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        isInWishlist: !!wishlistItem,
        wishlistItemId: wishlistItem?.id || null
      }
    })
    
  } catch (error) {
    console.error('Error checking wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check wishlist status' },
      { status: 500 }
    )
  }
}
