import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// PUT /api/admin/orders/[id] - Update specific order
async function handler(request, context, user) {
  try {
    const { params } = context
    const orderId = params.id
    const body = await request.json()
    
    const updatedOrder = await prisma.whatsappOrder.update({
      where: { id: orderId },
      data: {
        status: body.status,
        updatedAt: new Date()
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  take: 1,
                  select: {
                    imageUrl: true
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
