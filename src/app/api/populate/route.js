import { NextResponse } from 'next/server'
import { populateDatabase } from '@/lib/populateProducts'

// POST /api/populate - Populate database with sample data
export async function POST(request) {
  try {
    console.log('🚀 Starting database population via API...')
    
    const result = await populateDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Database populated successfully',
      data: result
    })
    
  } catch (error) {
    console.error('❌ Error in population API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to populate database',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// GET /api/populate - Check population status
export async function GET(request) {
  try {
    const { prisma } = await import('@/lib/db')
    
    // Get counts of existing data
    const [categoriesCount, productsCount, imagesCount, settingsCount] = await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.productImage.count(),
      prisma.businessSetting.count()
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesCount,
        products: productsCount,
        images: imagesCount,
        settings: settingsCount,
        isPopulated: categoriesCount > 0 && productsCount > 0
      }
    })
    
  } catch (error) {
    console.error('❌ Error checking population status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check population status',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
