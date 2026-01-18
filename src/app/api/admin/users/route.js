import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/users - Get users for admin with filtering and pagination
async function handler(request, context, user) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const search = searchParams.get('search')
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit
    
    // Build where clause
    const where = {}
    
    // Add search filter
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Add role filter
    if (role) {
      where.role = role
    }
    
    // Add status filter
    if (status) {
      where.is_active = status === 'active'
    }
    
    // Execute query with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          is_active: true,
          last_login: true,
          createdAt: true,
          provider: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.user.count({ where })
    ])
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return NextResponse.json({
      success: true,
      data: {
        users,
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
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/users/[id] - Update user role or status
async function updateUserHandler(request, context, user) {
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

// PUT /api/admin/users/bulk - Bulk update users
async function bulkUpdateHandler(request, context, user) {
  try {
    const body = await request.json()
    const { userIds, action } = body
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No users selected' },
        { status: 400 }
      )
    }
    
    // Check if user is trying to modify themselves in bulk action
    if (userIds.includes(user.id)) {
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
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: userIds
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
    console.error('Error bulk updating users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update users' },
      { status: 500 }
    )
  }
}

export const GET = createAdminRoute(handler, USER_ROLES.MANAGER)
export const PUT = createAdminRoute(updateUserHandler, USER_ROLES.MANAGER)
export const POST = createAdminRoute(bulkUpdateHandler, USER_ROLES.MANAGER)
