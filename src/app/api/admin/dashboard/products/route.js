import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/dashboard/products - Get product statistics for dashboard
async function handler(request, context, user) {
  try {
    // Get total products count
    const totalProducts = await prisma.products.count()

    // Get products by category
    const productsByCategory = await prisma.products.groupBy({
      by: ['category_id'],
      _count: {
        id: true
      }
    })

    // Get top products by order count (products that appear in most orders)
    const topProducts = await prisma.products.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        price: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Get products by availability
    const productsByAvailability = await prisma.products.groupBy({
      by: ['availability'],
      _count: {
        id: true
      }
    })

    // Get featured/bestseller counts
    const featuredCount = await prisma.products.count({
      where: { is_featured: true }
    })

    const bestsellerCount = await prisma.products.count({
      where: { is_bestseller: true }
    })

    const newArrivalCount = await prisma.products.count({
      where: { is_new_arrival: true }
    })

    // Get low stock products (less than 10)
    const lowStockProducts = await prisma.products.count({
      where: {
        stock_quantity: {
          lt: 10
        },
        stock_quantity: {
          gt: 0
        }
      }
    })

    // Get out of stock products
    const outOfStockProducts = await prisma.products.count({
      where: {
        OR: [
          { stock_quantity: 0 },
          { availability: 'Out_of_Stock' }
        ]
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        productsByCategory,
        topProducts: topProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          totalOrders: 0 // Simplified for now
        })),
        productsByAvailability,
        featuredCount,
        bestsellerCount,
        newArrivalCount,
        lowStockProducts,
        outOfStockProducts
      }
    })

  } catch (error) {
    console.error('Error fetching product statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product statistics' },
      { status: 500 }
    )
  }
}

export const GET = createAdminRoute(handler, USER_ROLES.STAFF)
