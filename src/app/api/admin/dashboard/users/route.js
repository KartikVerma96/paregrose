import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/dashboard/users - Get user statistics for dashboard
async function handler(request, context, user) {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count()

    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    })

    // Get active vs inactive users
    const activeUsers = await prisma.user.count({
      where: { is_active: true }
    })

    const inactiveUsers = await prisma.user.count({
      where: { is_active: false }
    })

    // Get users by provider (credentials vs Google)
    const usersByProvider = await prisma.user.groupBy({
      by: ['provider'],
      _count: {
        id: true
      }
    })

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Get users with orders (simplified for now)
    const usersWithOrders = 0

    // Get users with wishlist items (simplified for now)
    const usersWithWishlist = 0

    // Get user growth over last 7 days
    const userGrowth = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      })

      userGrowth.push({
        date: date.toISOString().split('T')[0],
        count
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        usersByRole,
        activeUsers,
        inactiveUsers,
        usersByProvider,
        recentUsers,
        usersWithOrders,
        usersWithWishlist,
        userGrowth
      }
    })

  } catch (error) {
    console.error('Error fetching user statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user statistics' },
      { status: 500 }
    )
  }
}

export const GET = createAdminRoute(handler, USER_ROLES.STAFF)
