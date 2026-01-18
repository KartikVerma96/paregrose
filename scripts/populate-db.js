#!/usr/bin/env node

/**
 * Database Population Script
 * 
 * This script populates the database with sample products, categories, and business settings.
 * Run with: node scripts/populate-db.js
 */

import { populateDatabase } from '../src/lib/populateProducts.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🚀 Starting database population script...')
    console.log('📊 Checking database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Run population
    const result = await populateDatabase()
    
    console.log('\n🎉 Population completed successfully!')
    console.log('📈 Summary:')
    console.log(`   ✅ Categories: ${result.categories}`)
    console.log(`   ✅ Products: ${result.products}`)
    console.log(`   ✅ Images: ${result.images}`)
    console.log(`   ✅ Settings: ${result.settings}`)
    
    console.log('\n🌐 Your application is now ready!')
    console.log('   • Visit /admin/populate to manage via web interface')
    console.log('   • Visit /api/products to see the products API')
    console.log('   • Visit /api/categories to see the categories API')
    console.log('   • Visit /api/test-db to test database connection')
    
  } catch (error) {
    console.error('\n❌ Error during population:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n👋 Database connection closed')
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err)
  process.exit(1)
})

// Run the script
main()
