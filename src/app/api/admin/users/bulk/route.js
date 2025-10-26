import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// PUT /api/admin/users/bulk - Bulk update users
async function handler(request, context, user) {
  try {
    const body = await request.json()
    const { userIds, action } = body
    
    // Convert user IDs to integers
    const numericUserIds = userIds.map(id => parseInt(id))
    
    console.log('🔄 Bulk action:', action, 'for users:', numericUserIds)
    console.log('📊 Admin user ID:', user.id, 'Type:', typeof user.id)
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No users selected' },
        { status: 400 }
      )
    }
    
    // Check if user is trying to modify themselves in bulk action
    if (numericUserIds.includes(user.id)) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify your own account in bulk actions' },
        { status: 400 }
      )
    }
    
    let updateData = {}
    
    switch (action) {
      case 'activate':
        updateData.is_active = true
        break
      case 'deactivate':
        updateData.is_active = false
        break
      case 'make_staff':
        updateData.role = 'staff'
        break
      case 'make_customer':
        updateData.role = 'customer'
        break
      case 'make_manager':
        updateData.role = 'manager'
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    console.log('💾 Updating with data:', updateData)
    
    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: numericUserIds
        }
      },
      data: updateData
    })
    
    console.log('✅ Bulk update complete. Updated count:', result.count)
    
    return NextResponse.json({
      success: true,
      data: {
        updatedCount: result.count
      }
    })
    
  } catch (error) {
    console.error('❌ Error bulk updating users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update users' },
      { status: 500 }
    )
  }
}

export const PUT = createAdminRoute(handler, USER_ROLES.MANAGER)

