// Database connection test utility
import { prisma } from './db.js'

export async function testDatabaseConnection() {
  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test if we can query categories (should have 5 sample categories)
    const categories = await prisma.category.findMany()
    console.log(`✅ Found ${categories.length} categories`)
    
    // Test if we can query products (should have 3 sample products)
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true
      }
    })
    console.log(`✅ Found ${products.length} products`)
    
    // Test if we can query business settings (should have 5 settings)
    const settings = await prisma.businessSetting.findMany()
    console.log(`✅ Found ${settings.length} business settings`)
    
    return {
      success: true,
      categories: categories.length,
      products: products.length,
      settings: settings.length
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return {
      success: false,
      error: error.message
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Test function that can be called from API routes
export async function GET() {
  try {
    const result = await testDatabaseConnection()
    return Response.json(result)
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
