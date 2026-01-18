import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { parseUserId } from '@/lib/userId'

// DELETE /api/wishlist/[id] - Remove item from wishlist
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params
    
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
    
    // Find the wishlist item and verify ownership
    const wishlistItem = await prisma.wishlist_items.findFirst({
      where: {
        id: parseInt(id),
        user_id: userId
      },
      include: {
        product: {
          select: {
            name: true
          }
        }
      }
    })
    
    if (!wishlistItem) {
      return NextResponse.json(
        { success: false, error: 'Wishlist item not found' },
        { status: 404 }
      )
    }
    
    // Delete the wishlist item
    await prisma.wishlist_items.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({
      success: true,
      message: `${wishlistItem.product.name} removed from wishlist successfully`
    })
    
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from wishlist' },
      { status: 500 }
    )
  }
}
