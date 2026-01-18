import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// PUT /api/admin/subcategories/[id] - Update specific subcategory
async function updateHandler(request, context, user) {
  try {
    const { params } = await context
    const subcategoryId = parseInt(params.id)
    const body = await request.json()
    
    // Check if subcategory exists
    const existingSubcategory = await prisma.subcategories.findUnique({
      where: { id: subcategoryId }
    })
    
    if (!existingSubcategory) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      )
    }
    
    // Build update data
    const updateData = {}
    if (body.name) updateData.name = body.name
    if (body.slug) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl
    if (body.isActive !== undefined) updateData.is_active = body.isActive
    if (body.categoryId) updateData.category_id = parseInt(body.categoryId)
    
    const updatedSubcategory = await prisma.subcategories.update({
      where: { id: subcategoryId },
      data: updateData
    })
    
    return NextResponse.json({
      success: true,
      data: updatedSubcategory
    })
    
  } catch (error) {
    console.error('Error updating subcategory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update subcategory' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/subcategories/[id] - Delete specific subcategory
async function deleteHandler(request, context, user) {
  try {
    const { params } = await context
    const subcategoryId = parseInt(params.id)
    
    // Check if subcategory exists
    const existingSubcategory = await prisma.subcategories.findUnique({
      where: { id: subcategoryId }
    })
    
    if (!existingSubcategory) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      )
    }
    
    await prisma.subcategories.delete({
      where: { id: subcategoryId }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Subcategory deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting subcategory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete subcategory' },
      { status: 500 }
    )
  }
}

export const PUT = createAdminRoute(updateHandler, USER_ROLES.STAFF)
export const DELETE = createAdminRoute(deleteHandler, USER_ROLES.STAFF)
