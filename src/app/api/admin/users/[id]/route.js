import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/users/[id] - Get single user
async function getHandler(request, context, adminUser) {
  try {
    const params = await context.params
    const userId = parseInt(params.id)
    
    console.log('🔍 Fetching user:', userId)
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        is_active: true,
        last_login: true,
        createdAt: true,
        updatedAt: true,
        provider: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: user
    })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/users/[id] - Update user
async function updateHandler(request, context, adminUser) {
  try {
    const params = await context.params
    const userId = parseInt(params.id) // Convert to integer
    const body = await request.json()
    
    console.log('🔄 Updating user:', userId, 'Type:', typeof userId, 'Admin ID:', adminUser.id, 'Type:', typeof adminUser.id)
    console.log('📦 Update data:', body)
    
    // Check if admin is trying to modify their own role
    if (userId === adminUser.id && body.role && body.role !== adminUser.role) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify your own role' },
        { status: 400 }
      )
    }
    
    // Check if admin is trying to deactivate themselves
    if (userId === adminUser.id && body.isActive === false) {
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
    
    console.log('💾 Prisma update data:', updateData)
    
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
    
    console.log('✅ User updated successfully:', updatedUser)
    
    return NextResponse.json({
      success: true,
      data: updatedUser
    })
    
  } catch (error) {
    console.error('❌ Error updating user:', error)
    console.error('❌ Error details:', error.message, error.stack)
    return NextResponse.json(
      { success: false, error: 'Failed to update user: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user (soft delete by deactivating)
async function deleteHandler(request, context, adminUser) {
  try {
    const params = await context.params
    const userId = parseInt(params.id)
    
    console.log('🗑️ Deleting user:', userId)
    
    // Prevent admin from deleting themselves
    if (userId === adminUser.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }
    
    // Soft delete by deactivating
    await prisma.user.update({
      where: { id: userId },
      data: { is_active: false }
    })
    
    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    })
    
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

export const GET = createAdminRoute(getHandler, USER_ROLES.MANAGER)
export const PUT = createAdminRoute(updateHandler, USER_ROLES.MANAGER)
export const DELETE = createAdminRoute(deleteHandler, USER_ROLES.ADMIN)
