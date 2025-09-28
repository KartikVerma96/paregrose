import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/analytics - Get analytics data for admin dashboard
async function handler(request, context, user) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days')) || 30
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Get basic counts
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue
    ] = await Promise.all([
      prisma.whatsapp_orders.count(),
      prisma.user.count(),
      prisma.products.count(),
      prisma.whatsapp_orders.aggregate({
        _sum: {
          total_amount: true
        }
      })
    ])
    
    // Get recent data (within date range)
    const [
      recentOrders,
      recentUsers,
      recentRevenue
    ] = await Promise.all([
      prisma.whatsapp_orders.count({
        where: {
          created_at: {
            gte: startDate
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.whatsapp_orders.aggregate({
        where: {
          created_at: {
            gte: startDate
          }
        },
        _sum: {
          total_amount: true
        }
      })
    ])
    
    // Get average order value
    const avgOrderValue = totalOrders > 0 ? (totalRevenue._sum.total_amount || 0) / totalOrders : 0
    
    // Get conversion rate (simplified - users who made orders)
    const usersWithOrders = await prisma.user.count({
      where: {
        whatsapp_orders: {
          some: {}
        }
      }
    })
    const conversionRate = totalUsers > 0 ? (usersWithOrders / totalUsers) * 100 : 0
    
    // Get top products by order count
    const topProducts = await prisma.products.findMany({
      take: 10,
      include: {
        _count: {
          select: {
            whatsapp_order_items: true
          }
        }
      },
      orderBy: {
        whatsapp_order_items: {
          _count: 'desc'
        }
      }
    })
    
    // Get top categories by revenue
    const topCategories = await prisma.categories.findMany({
      include: {
        products: {
          include: {
            whatsapp_order_items: {
              include: {
                whatsapp_orders: true
              }
            }
          }
        }
      }
    })
    
    // Calculate category performance
    const categoryPerformance = topCategories.map(category => {
      const totalRevenue = category.products.reduce((sum, product) => {
        return sum + product.whatsapp_order_items.reduce((productSum, item) => {
          return productSum + (item.quantity * parseFloat(item.unit_price))
        }, 0)
      }, 0)
      
      const totalOrders = category.products.reduce((sum, product) => {
        return sum + product.whatsapp_order_items.length
      }, 0)
      
      return {
        id: category.id,
        name: category.name,
        productCount: category.products.length,
        totalRevenue,
        orderCount: totalOrders
      }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5)
    
    // Get product performance
    const productPerformance = topProducts.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category?.name || 'Uncategorized',
      orderCount: product._count.whatsapp_order_items,
      totalRevenue: 0 // This would need additional calculation
    }))
    
    // Get sales data by day (simplified)
    const salesData = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const dayRevenue = await prisma.whatsapp_orders.aggregate({
        where: {
          created_at: {
            gte: date,
            lt: nextDate
          }
        },
        _sum: {
          total_amount: true
        }
      })
      
      salesData.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue._sum.total_amount || 0,
        orders: await prisma.whatsapp_orders.count({
          where: {
            created_at: {
              gte: date,
              lt: nextDate
            }
          }
        })
      })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: totalRevenue._sum.total_amount || 0,
        recentOrders,
        recentUsers,
        recentRevenue: recentRevenue._sum.total_amount || 0,
        averageOrderValue: avgOrderValue,
        conversionRate: Math.round(conversionRate * 100) / 100,
        topProducts: productPerformance,
        topCategories: categoryPerformance,
        salesData,
        conversionRates: {
          overall: Math.round(conversionRate * 100) / 100
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

export const GET = createAdminRoute(handler, USER_ROLES.ADMIN)
