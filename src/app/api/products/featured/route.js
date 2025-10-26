import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/products/featured - Get featured products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 8
    
    const featuredProducts = await prisma.products.findMany({
      where: {
        is_featured: true,
        is_active: true
      },
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
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit
    })
    
    // Convert Decimal objects to numbers for JSON serialization
    const formattedProducts = featuredProducts.map(product => ({
      ...product,
      price: parseFloat(product.price),
      original_price: product.original_price ? parseFloat(product.original_price) : null,
      discount_percentage: product.discount_percentage ? parseFloat(product.discount_percentage) : null,
      weight: product.weight ? parseFloat(product.weight) : null,
      stock_quantity: product.stock_quantity || 0
    }))
    
    return NextResponse.json({
      success: true,
      data: formattedProducts
    })
    
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured products' },
      { status: 500 }
    )
  }
}
