import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from './db'
import { validateAdminAccess, USER_ROLES } from './admin'
import { parseUserId } from './userId'

// Middleware to protect admin routes
export function withAdminAuth(handler, requiredRole = USER_ROLES.STAFF) {
  return async (request, context) => {
    try {
      // Get session
      const session = await getServerSession(authOptions)
      
      if (!session?.user?.id) {
        return Response.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Get user details from database
      // Convert session.user.id to integer using helper function (validates safe integer range)
      const userId = parseUserId(session.user.id);
      
      if (!userId || userId <= 0) {
        console.error("Invalid user ID in admin middleware:", session.user.id);
        return Response.json(
          { success: false, error: 'Invalid user ID' },
          { status: 400 }
        );
      }
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
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
        return Response.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      // Validate admin access
      const accessValidation = validateAdminAccess(user, requiredRole)
      
      if (!accessValidation.hasAccess) {
        return Response.json(
          { success: false, error: accessValidation.error },
          { status: 403 }
        )
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { last_login: new Date() }
      })

      // Add user to request context
      request.adminUser = user

      // Call the original handler
      return await handler(request, context, user)

    } catch (error) {
      console.error('Admin middleware error:', error)
      return Response.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// Export USER_ROLES for use in API routes
export { USER_ROLES }

// Higher-order function for admin API routes
export function createAdminRoute(handler, requiredRole = USER_ROLES.STAFF) {
  return withAdminAuth(handler, requiredRole)
}

