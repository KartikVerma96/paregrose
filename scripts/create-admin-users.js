#!/usr/bin/env node

/**
 * Create Admin Users Script
 * 
 * This script creates admin users with different roles for testing the admin panel.
 * Run with: node scripts/create-admin-users.js
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const adminUsers = [
  {
    fullName: 'Admin User',
    email: 'admin@paregrose.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    fullName: 'Manager User',
    email: 'manager@paregrose.com',
    password: 'admin123',
    role: 'manager'
  },
  {
    fullName: 'Staff User',
    email: 'staff@paregrose.com',
    password: 'admin123',
    role: 'staff'
  },
  {
    fullName: 'Test Customer',
    email: 'customer@paregrose.com',
    password: 'admin123',
    role: 'customer'
  }
]

async function createAdminUsers() {
  try {
    console.log('🚀 Creating admin users...')
    
    for (const userData of adminUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      // Create or update user
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          fullName: userData.fullName,
          password: hashedPassword,
          role: userData.role,
          isActive: true
        },
        create: {
          fullName: userData.fullName,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          isActive: true,
          provider: 'credentials'
        }
      })
      
      console.log(`✅ Created/Updated user: ${user.fullName} (${user.role}) - ${user.email}`)
    }
    
    console.log('\n🎉 Admin users created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('   Admin: admin@paregrose.com')
    console.log('   Manager: manager@paregrose.com')
    console.log('   Staff: staff@paregrose.com')
    console.log('   Customer: customer@paregrose.com')
    console.log('   Password for all: admin123')
    
    console.log('\n🌐 Access the admin panel at: http://localhost:3000/admin/login')
    
  } catch (error) {
    console.error('\n❌ Error creating admin users:', error)
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
createAdminUsers()
