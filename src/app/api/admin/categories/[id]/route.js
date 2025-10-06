import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// PUT /api/admin/categories/[id] - Update specific category
async function updateHandler(request, context, user) {
  try {
    const { params } = await context
    const categoryId = parseInt(params.id)
    const body = await request.json()
    
    // Check if category exists
    const existingCategory = await prisma.categories.findUnique({
      where: { id: categoryId }
    })
    
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }
    
    // Check if slug is being changed and if it already exists
    if (body.slug && body.slug !== existingCategory.slug) {
      const slugExists = await prisma.categories.findUnique({
        where: { slug: body.slug }
      })
      
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Category with this slug already exists' },
          { status: 409 }
        )
      }
    }
    
    const updateData = {}
    if (body.name) updateData.name = body.name
    if (body.slug) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl
    if (body.isActive !== undefined) updateData.is_active = body.isActive
    
    const updatedCategory = await prisma.categories.update({
      where: { id: categoryId },
      data: updateData
    })
    
    return NextResponse.json({
      success: true,
      data: updatedCategory
    })
    
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id] - Delete specific category
async function deleteHandler(request, context, user) {
  try {
    const { params } = await context
    const categoryId = parseInt(params.id)
    
    // Check if category exists
    const existingCategory = await prisma.categories.findUnique({
      where: { id: categoryId }
    })
    
    // Check if category has products
    const productsCount = await prisma.products.count({
      where: { category_id: categoryId }
    })
    
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }
    
    if (productsCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete category. It has ${productsCount} products associated with it.` },
        { status: 400 }
      )
    }
    
    await prisma.categories.delete({
      where: { id: categoryId }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}

export const PUT = createAdminRoute(updateHandler, USER_ROLES.STAFF)
export const DELETE = createAdminRoute(deleteHandler, USER_ROLES.STAFF)
