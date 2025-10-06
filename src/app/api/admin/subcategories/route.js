import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/subcategories - Get subcategories for admin
async function getHandler(request, context, user) {
  try {
    const subcategories = await prisma.subcategories.findMany({
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: subcategories
    })
    
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subcategories' },
      { status: 500 }
    )
  }
}

// POST /api/admin/subcategories - Create new subcategory
async function postHandler(request, context, user) {
  try {
    const body = await request.json()
    
    if (!body.name || !body.slug || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, and category ID are required' },
        { status: 400 }
      )
    }
    
    // Check if slug already exists
    const existingSubcategory = await prisma.subcategories.findUnique({
      where: { slug: body.slug }
    })
    
    if (existingSubcategory) {
      return NextResponse.json(
        { success: false, error: 'Subcategory with this slug already exists' },
        { status: 409 }
      )
    }
    
    // Check if category exists
    const category = await prisma.categories.findUnique({
      where: { id: parseInt(body.categoryId) }
    })
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }
    
    const subcategory = await prisma.subcategories.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || '',
        image_url: body.imageUrl || '',
        is_active: body.isActive !== false,
        category_id: parseInt(body.categoryId)
      }
    })
    
    return NextResponse.json({
      success: true,
      data: subcategory
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating subcategory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create subcategory' },
      { status: 500 }
    )
  }
}

export const GET = createAdminRoute(getHandler, USER_ROLES.STAFF)
export const POST = createAdminRoute(postHandler, USER_ROLES.STAFF)
