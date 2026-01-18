import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/test-categories - Test category creation
export async function GET() {
  try {
    // Test database connection
    const categories = await prisma.category.findMany()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      categories: categories,
      count: categories.length
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// POST /api/test-categories - Test category creation
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Create a test category
    const category = await prisma.category.create({
      data: {
        name: body.name || 'Test Category',
        slug: body.slug || 'test-category',
        description: body.description || 'Test description',
        imageUrl: body.imageUrl || '',
        isActive: body.isActive !== false
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: category
    }, { status: 201 })
    
  } catch (error) {
    console.error('Category creation test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create category',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
