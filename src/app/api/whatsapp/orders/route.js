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
    
    // Build where clause
    const where = {}
    
    // If not admin, only show user's own orders
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // For now, show all orders for authenticated users
    // You can add admin role checking here if needed
    
    // Add filters
    if (status) {
      where.status = status
    }
    
    if (customerName) {
      where.customerName = {
        contains: customerName,
        mode: 'insensitive'
      }
    }
    
    if (customerPhone) {
      where.customerPhone = {
        contains: customerPhone
      }
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }
    
    // Execute query with pagination
    const [orders, totalCount] = await Promise.all([
      prisma.whatsappOrder.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          items: {
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
          },
          _count: {
            select: {
              items: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.whatsappOrder.count({ where })
    ])
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    // Calculate summary statistics
    const summary = await prisma.whatsappOrder.aggregate({
      where: where,
      _sum: {
        totalAmount: true
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
          totalValue: summary._sum.totalAmount || 0,
          formattedTotalValue: `₹${(summary._sum.totalAmount || 0).toLocaleString('en-IN')}`
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
