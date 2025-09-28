import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { validateAdminAccess, formatUserForDisplay } from '@/lib/admin'

// GET /api/admin/auth/check - Check admin authentication status
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Not authenticated'
      })
    }

    // Get user details from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        is_active: true,
        last_login: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'User not found'
      })
    }

    // Validate admin access
    const accessValidation = validateAdminAccess(user)
    
    if (!accessValidation.hasAccess) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: accessValidation.error
      })
    }

    // Format user for display
    const formattedUser = formatUserForDisplay(user)

    return NextResponse.json({
      success: true,
      authenticated: true,
      data: formattedUser
    })

  } catch (error) {
    console.error('Admin auth check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        authenticated: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
