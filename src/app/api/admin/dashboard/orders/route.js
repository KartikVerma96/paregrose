import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/dashboard/orders - Get order statistics for dashboard
async function handler(request, context, user) {
  try {
    // Get date range for statistics (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get total orders count
    const totalOrders = await prisma.whatsapp_orders.count()

    // Get total revenue
    const revenueResult = await prisma.whatsapp_orders.aggregate({
      _sum: {
        total_amount: true
      }
    })
    const totalRevenue = revenueResult._sum.total_amount || 0

    // Get recent orders (last 10)
    const recentOrders = await prisma.whatsapp_orders.findMany({
      take: 10,
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        order_id: true,
        customer_name: true,
        total_amount: true,
        status: true,
        created_at: true
      }
    })

    // Get orders by status
    const ordersByStatus = await prisma.whatsapp_orders.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Get orders in last 30 days
    const recentOrdersCount = await prisma.whatsapp_orders.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Get revenue in last 30 days
    const recentRevenueResult = await prisma.whatsapp_orders.aggregate({
      where: {
        created_at: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        total_amount: true
      }
    })
    const recentRevenue = recentRevenueResult._sum.total_amount || 0

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        recentOrders,
        ordersByStatus,
        recentOrdersCount,
        recentRevenue,
        formattedTotalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
        formattedRecentRevenue: `₹${recentRevenue.toLocaleString('en-IN')}`
      }
    })

  } catch (error) {
    console.error('Error fetching order statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order statistics' },
      { status: 500 }
    )
  }
}

export const GET = createAdminRoute(handler, USER_ROLES.STAFF)
