import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/products/bestsellers - Get bestseller products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 8
    
    const bestsellerProducts = await prisma.product.findMany({
      where: {
        isBestseller: true,
        isActive: true
      },
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })
    
    return NextResponse.json({
      success: true,
      data: bestsellerProducts
    })
    
  } catch (error) {
    console.error('Error fetching bestseller products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bestseller products' },
      { status: 500 }
    )
  }
}
