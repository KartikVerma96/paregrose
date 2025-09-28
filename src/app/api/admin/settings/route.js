import { NextResponse } from 'next/server'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'
import { prisma } from '@/lib/db'

// Default settings structure
const defaultSettings = {
  store: {
    name: 'Paregrose',
    description: 'Premium Ethnic Wear & Fashion',
    email: 'info@paregrose.com',
    phone: '+91 9876543210',
    address: '',
    logo: '',
    favicon: ''
  },
  payment: {
    razorpayKeyId: '',
    razorpayKeySecret: '',
    upiId: '',
    bankAccount: '',
    enableRazorpay: false,
    enableUPI: false,
    enableCOD: true
  },
  shipping: {
    freeShippingThreshold: 0,
    shippingCost: 0,
    estimatedDeliveryDays: 7,
    enableFreeShipping: false
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlert: true,
    orderNotifications: true
  },
  seo: {
    metaTitle: 'Paregrose - Premium Ethnic Wear & Fashion',
    metaDescription: 'Discover exquisite ethnic wear at Paregrose. Premium sarees, lehengas, gowns, and traditional outfits for women.',
    metaKeywords: 'ethnic wear, sarees, lehengas, gowns, traditional wear, women fashion',
    googleAnalyticsId: '',
    facebookPixelId: ''
  }
}

// GET /api/admin/settings - Get current settings
async function handler(request, context, user) {
  try {
    // Fetch all settings from database
    const settingsRecords = await prisma.business_settings.findMany()
    
    // Convert array of key-value pairs to nested object structure
    const settings = {
      store: {
        name: '',
        description: '',
        email: '',
        phone: '',
        address: '',
        logo: '',
        favicon: ''
      },
      payment: {
        razorpayKeyId: '',
        razorpayKeySecret: '',
        upiId: '',
        bankAccount: '',
        enableRazorpay: false,
        enableUPI: false,
        enableCOD: true
      },
      shipping: {
        freeShippingThreshold: 0,
        shippingCost: 0,
        estimatedDeliveryDays: 7,
        enableFreeShipping: false
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        lowStockAlert: true,
        orderNotifications: true
      },
      seo: {
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        googleAnalyticsId: '',
        facebookPixelId: ''
      }
    }
    
    // Populate settings from database records
    settingsRecords.forEach(record => {
      const keys = record.setting_key.split('.')
      if (keys.length === 2) {
        const [section, field] = keys
        if (settings[section] && settings[section].hasOwnProperty(field)) {
          // Parse boolean values
          if (typeof settings[section][field] === 'boolean') {
            settings[section][field] = record.setting_value === 'true'
          }
          // Parse number values
          else if (typeof settings[section][field] === 'number') {
            settings[section][field] = parseFloat(record.setting_value) || 0
          }
          // String values
          else {
            settings[section][field] = record.setting_value
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: settings
    })
    
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update settings
async function updateSettingsHandler(request, context, user) {
  try {
    const body = await request.json()
    
    // Validate settings structure
    const validSections = ['store', 'payment', 'shipping', 'notifications', 'seo']
    
    for (const section in body) {
      if (!validSections.includes(section)) {
        return NextResponse.json(
          { success: false, error: `Invalid settings section: ${section}` },
          { status: 400 }
        )
      }
      
      // Update each field in the section
      for (const field in body[section]) {
        const settingKey = `${section}.${field}`
        const settingValue = String(body[section][field])
        
        // Upsert the setting
        await prisma.business_settings.upsert({
          where: { setting_key: settingKey },
          update: { 
            setting_value: settingValue,
            updated_at: new Date()
          },
          create: {
            setting_key: settingKey,
            setting_value: settingValue,
            description: `${section} ${field} setting`
          }
        })
      }
    }
    
    // Fetch updated settings to return
    const settingsRecords = await prisma.business_settings.findMany()
    
    // Convert to nested object structure
    const updatedSettings = {
      store: { name: '', description: '', email: '', phone: '', address: '', logo: '', favicon: '' },
      payment: { razorpayKeyId: '', razorpayKeySecret: '', upiId: '', bankAccount: '', enableRazorpay: false, enableUPI: false, enableCOD: true },
      shipping: { freeShippingThreshold: 0, shippingCost: 0, estimatedDeliveryDays: 7, enableFreeShipping: false },
      notifications: { emailNotifications: true, smsNotifications: false, lowStockAlert: true, orderNotifications: true },
      seo: { metaTitle: '', metaDescription: '', metaKeywords: '', googleAnalyticsId: '', facebookPixelId: '' }
    }
    
    settingsRecords.forEach(record => {
      const keys = record.setting_key.split('.')
      if (keys.length === 2) {
        const [section, field] = keys
        if (updatedSettings[section] && updatedSettings[section].hasOwnProperty(field)) {
          if (typeof updatedSettings[section][field] === 'boolean') {
            updatedSettings[section][field] = record.setting_value === 'true'
          } else if (typeof updatedSettings[section][field] === 'number') {
            updatedSettings[section][field] = parseFloat(record.setting_value) || 0
          } else {
            updatedSettings[section][field] = record.setting_value
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings/reset - Reset settings to default
async function resetSettingsHandler(request, context, user) {
  try {
    // Clear all existing settings
    await prisma.business_settings.deleteMany()
    
    // Insert default settings
    const defaultSettingsArray = []
    for (const section in defaultSettings) {
      for (const field in defaultSettings[section]) {
        defaultSettingsArray.push({
          setting_key: `${section}.${field}`,
          setting_value: String(defaultSettings[section][field]),
          description: `${section} ${field} setting`
        })
      }
    }
    
    await prisma.business_settings.createMany({
      data: defaultSettingsArray
    })
    
    return NextResponse.json({
      success: true,
      data: defaultSettings,
      message: 'Settings reset to default successfully'
    })
    
  } catch (error) {
    console.error('Error resetting settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset settings' },
      { status: 500 }
    )
  }
}

export const GET = createAdminRoute(handler, USER_ROLES.ADMIN)
export const PUT = createAdminRoute(updateSettingsHandler, USER_ROLES.ADMIN)
export const POST = createAdminRoute(resetSettingsHandler, USER_ROLES.ADMIN)
