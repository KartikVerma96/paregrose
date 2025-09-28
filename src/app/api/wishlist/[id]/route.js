import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

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
    
    // Find the wishlist item and verify ownership
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id
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
    await prisma.wishlistItem.delete({
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
