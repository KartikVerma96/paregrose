import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/orders - Get orders for admin with filtering and pagination
async function handler(request, context, user) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit
    
    // Build where clause
    const where = {}
    
    // Add search filter
    if (search) {
      where.OR = [
        { order_id: { contains: search, mode: 'insensitive' } },
        { customer_name: { contains: search, mode: 'insensitive' } },
        { customer_phone: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Add status filter
    if (status) {
      where.status = status
    }
    
    // Add date filter
    if (date) {
      const now = new Date()
      let startDate
      
      switch (date) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
          break
        default:
          startDate = null
      }
      
      if (startDate) {
        where.created_at = {
          gte: startDate
        }
      }
    }
    
    // Execute query with pagination
    const [orders, totalCount] = await Promise.all([
      prisma.whatsapp_orders.findMany({
        where,
        select: {
          id: true,
          order_id: true,
          customer_name: true,
          customer_phone: true,
          total_amount: true,
          status: true,
          created_at: true
        },
        orderBy: {
          created_at: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.whatsapp_orders.count({ where })
    ])
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
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
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders/[id] - Update order status
async function updateOrderHandler(request, context, user) {
  try {
    const { params } = context
    const orderId = params.id
    const body = await request.json()
    
    const updatedOrder = await prisma.whatsapp_orders.update({
      where: { id: orderId },
      data: {
        status: body.status,
        updated_at: new Date()
      },
      select: {
        id: true,
        order_id: true,
        customer_name: true,
        total_amount: true,
        status: true,
        updated_at: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedOrder
    })
    
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders/bulk - Bulk update orders
async function bulkUpdateHandler(request, context, user) {
  try {
    const body = await request.json()
    const { orderIds, action } = body
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No orders selected' },
        { status: 400 }
      )
    }
    
    let updateData = {}
    
    switch (action) {
      case 'confirm':
        updateData.status = 'confirmed'
        break
      case 'ship':
        updateData.status = 'shipped'
        break
      case 'complete':
        updateData.status = 'completed'
        break
      case 'cancel':
        updateData.status = 'cancelled'
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    updateData.updated_at = new Date()
    
    const result = await prisma.whatsapp_orders.updateMany({
      where: {
        id: {
          in: orderIds
        }
      },
      data: updateData
    })
    
    return NextResponse.json({
      success: true,
      data: {
        updatedCount: result.count
      }
    })
    
  } catch (error) {
    console.error('Error bulk updating orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update orders' },
      { status: 500 }
    )
  }
}

export const GET = createAdminRoute(handler, USER_ROLES.STAFF)
export const PUT = createAdminRoute(updateOrderHandler, USER_ROLES.STAFF)
export const POST = createAdminRoute(bulkUpdateHandler, USER_ROLES.STAFF)
