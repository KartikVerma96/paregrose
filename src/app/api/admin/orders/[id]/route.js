import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// PUT /api/admin/orders/[id] - Update specific order
async function handler(request, context, user) {
  try {
    const { params } = context
    const orderId = params.id
    const body = await request.json()
    
    const updatedOrder = await prisma.whatsapp_orders.update({
      where: { id: parseInt(orderId) },
      data: {
        status: body.status,
        updated_at: new Date()
      },
      include: {
        whatsapp_order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  where: { is_primary: true },
                  take: 1,
                  select: {
                    image_url: true
                  }
                }
              }
            }
          }
        }
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

export const PUT = createAdminRoute(handler, USER_ROLES.STAFF)
