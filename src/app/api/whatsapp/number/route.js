import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/whatsapp/number - Get WhatsApp business number (public endpoint)
export async function GET() {
  try {
    const setting = await prisma.business_settings.findUnique({
      where: {
        setting_key: 'whatsapp_business_number'
      }
    })
    
    const whatsappNumber = setting?.setting_value || null
    
    return NextResponse.json({
      success: true,
      data: {
        whatsappNumber,
        formattedNumber: whatsappNumber ? whatsappNumber.replace(/[^\d]/g, '') : null
      }
    })
  } catch (error) {
    console.error('Error fetching WhatsApp number:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch WhatsApp number',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

