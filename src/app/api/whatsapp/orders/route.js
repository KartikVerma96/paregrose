import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/whatsapp/orders - Get all WhatsApp orders (Admin) or user's orders
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const status = searchParams.get('status')
    const customerName = searchParams.get('customerName')
    const customerPhone = searchParams.get('customerPhone')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit
    
    // If not admin, only show user's own orders
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Convert user ID to integer if needed
    const userId = typeof session.user.id === 'string' 
      ? parseInt(session.user.id, 10) 
      : session.user.id;
    
    // For now, show all orders for authenticated users
    // You can add admin role checking here if needed
    
    // Build where clause with correct field names
    const whereClause = {}
    if (status) {
      whereClause.status = status
    }
    if (customerName) {
      whereClause.customer_name = {
        contains: customerName,
        mode: 'insensitive'
      }
    }
    if (customerPhone) {
      whereClause.customer_phone = {
        contains: customerPhone
      }
    }
    if (startDate || endDate) {
      whereClause.created_at = {}
      if (startDate) {
        whereClause.created_at.gte = new Date(startDate)
      }
      if (endDate) {
        whereClause.created_at.lte = new Date(endDate)
      }
    }
    
    // Execute query with pagination
    const [orders, totalCount] = await Promise.all([
      prisma.whatsapp_orders.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          whatsapp_order_items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    where: { is_primary: true },
                    select: { image_url: true },
                    orderBy: { sort_order: 'asc' },
                    take: 1
                  }
                }
              }
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.whatsapp_orders.count({ where: whereClause })
    ])
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    // Calculate summary statistics
    const summary = await prisma.whatsapp_orders.aggregate({
      where: whereClause,
      _sum: {
        total_amount: true
      },
      _count: {
        id: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage
        },
        summary: {
          totalOrders: summary._count.id,
          totalValue: summary._sum.total_amount || 0,
          formattedTotalValue: `₹${(summary._sum.total_amount || 0).toLocaleString('en-IN')}`
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching WhatsApp orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
