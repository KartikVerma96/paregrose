import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/categories - Get all categories
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const includeCount = searchParams.get('includeCount') === 'true'
    
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      include: {
        products: includeProducts ? {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
              where: { isPrimary: true },
              select: { imageUrl: true }
            }
          },
          take: 4 // Limit products per category
        } : false,
        _count: includeCount ? {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        } : false
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
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category (Admin only)
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }
    
    // Create slug from name
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        imageUrl: body.imageUrl,
        isActive: body.isActive !== false
      }
    })
    
    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating category:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Category with this name or slug already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
