import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/products/featured - Get featured products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 8
    
    const featuredProducts = await prisma.product.findMany({
      where: {
        isFeatured: true,
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
      data: featuredProducts
    })
    
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured products' },
      { status: 500 }
    )
  }
}
