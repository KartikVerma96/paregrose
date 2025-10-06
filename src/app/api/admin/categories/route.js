import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/categories - Get categories for admin
async function handler(request, context, user) {
  try {
    const categories = await prisma.categories.findMany({
      include: {
        subcategories: {
          orderBy: { name: 'asc' }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: categories
    })
    
  } catch (error) {
    console.error('Error fetching admin categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create new category
async function createCategoryHandler(request, context, user) {
  try {
    const body = await request.json()
    
    console.log('Creating category with data:', body)
    console.log('User:', user)
    
    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      )
    }
    
    // Check if slug already exists
    const existingCategory = await prisma.categories.findUnique({
      where: { slug: body.slug }
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 409 }
      )
    }
    
    const category = await prisma.categories.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || '',
        image_url: body.imageUrl || '',
        is_active: body.isActive !== false
      }
    })
    
    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/categories/[id] - Update category
async function updateCategoryHandler(request, context, user) {
  try {
    const { params } = context
    const categoryId = params.id
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

// DELETE /api/admin/categories/[id] - Delete category
async function deleteCategoryHandler(request, context, user) {
  try {
    const { params } = context
    const categoryId = params.id
    
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
    
    // Check if category has products
    const productsCount = await prisma.products.count({
      where: { category_id: categoryId }
    })
    
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

export const GET = createAdminRoute(handler, USER_ROLES.STAFF)
export const POST = createAdminRoute(createCategoryHandler, USER_ROLES.STAFF)
export const PUT = createAdminRoute(updateCategoryHandler, USER_ROLES.STAFF)
export const DELETE = createAdminRoute(deleteCategoryHandler, USER_ROLES.STAFF)
