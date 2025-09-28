import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// PUT /api/admin/users/[id] - Update specific user
async function handler(request, context, user) {
  try {
    const { params } = context
    const userId = params.id
    const body = await request.json()
    
    // Check if user is trying to modify their own role
    if (userId === user.id && body.role && body.role !== user.role) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify your own role' },
        { status: 400 }
      )
    }
    
    // Check if user is trying to deactivate themselves
    if (userId === user.id && body.isActive === false) {
      return NextResponse.json(
        { success: false, error: 'Cannot deactivate your own account' },
        { status: 400 }
      )
    }
    
    const updateData = {}
    if (body.role) updateData.role = body.role
    if (body.isActive !== undefined) updateData.is_active = body.isActive
    if (body.fullName) updateData.fullName = body.fullName
    if (body.email) updateData.email = body.email
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        is_active: true,
        last_login: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedUser
    })
    
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export const PUT = createAdminRoute(handler, USER_ROLES.MANAGER)
