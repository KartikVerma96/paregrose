// Admin utilities and role management

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  MANAGER: 'manager',
  ADMIN: 'admin'
}

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [USER_ROLES.CUSTOMER]: 0,
  [USER_ROLES.STAFF]: 1,
  [USER_ROLES.MANAGER]: 2,
  [USER_ROLES.ADMIN]: 3
}

// Check if user has required role or higher
export function hasRole(userRole, requiredRole) {
  const userLevel = ROLE_HIERARCHY[userRole] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0
  return userLevel >= requiredLevel
}

// Check if user is admin
export function isAdmin(userRole) {
  return hasRole(userRole, USER_ROLES.ADMIN)
}

// Check if user is staff or higher
export function isStaff(userRole) {
  return hasRole(userRole, USER_ROLES.STAFF)
}

// Check if user can manage users
export function canManageUsers(userRole) {
  return hasRole(userRole, USER_ROLES.MANAGER)
}

// Check if user can manage products
export function canManageProducts(userRole) {
  return hasRole(userRole, USER_ROLES.STAFF)
}

// Check if user can manage orders
export function canManageOrders(userRole) {
  return hasRole(userRole, USER_ROLES.STAFF)
}

// Check if user can manage settings
export function canManageSettings(userRole) {
  return hasRole(userRole, USER_ROLES.ADMIN)
}

// Get role display name
export function getRoleDisplayName(role) {
  const roleNames = {
    [USER_ROLES.CUSTOMER]: 'Customer',
    [USER_ROLES.STAFF]: 'Staff',
    [USER_ROLES.MANAGER]: 'Manager',
    [USER_ROLES.ADMIN]: 'Administrator'
  }
  return roleNames[role] || 'Unknown'
}

// Get role color for UI
export function getRoleColor(role) {
  const roleColors = {
    [USER_ROLES.CUSTOMER]: 'gray',
    [USER_ROLES.STAFF]: 'blue',
    [USER_ROLES.MANAGER]: 'purple',
    [USER_ROLES.ADMIN]: 'red'
  }
  return roleColors[role] || 'gray'
}

// Admin navigation items based on role
export function getAdminNavItems(userRole) {
  const baseItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'dashboard',
      roles: [USER_ROLES.STAFF, USER_ROLES.MANAGER, USER_ROLES.ADMIN]
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: 'orders',
      roles: [USER_ROLES.STAFF, USER_ROLES.MANAGER, USER_ROLES.ADMIN]
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: 'products',
      roles: [USER_ROLES.STAFF, USER_ROLES.MANAGER, USER_ROLES.ADMIN]
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: 'categories',
      roles: [USER_ROLES.STAFF, USER_ROLES.MANAGER, USER_ROLES.ADMIN]
    },
    {
      name: 'Subcategories',
      href: '/admin/subcategories',
      icon: 'subcategories',
      roles: [USER_ROLES.STAFF, USER_ROLES.MANAGER, USER_ROLES.ADMIN]
    }
  ]

  const managerItems = [
    {
      name: 'Users',
      href: '/admin/users',
      icon: 'users',
      roles: [USER_ROLES.MANAGER, USER_ROLES.ADMIN]
    }
  ]

  const adminItems = [
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: 'settings',
      roles: [USER_ROLES.ADMIN]
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: 'analytics',
      roles: [USER_ROLES.ADMIN]
    }
  ]

  const allItems = [...baseItems, ...managerItems, ...adminItems]
  
  return allItems.filter(item => 
    item.roles.some(role => hasRole(userRole, role))
  )
}

// Validate admin access
export function validateAdminAccess(user, requiredRole = USER_ROLES.STAFF) {
  if (!user) {
    return {
      hasAccess: false,
      error: 'Authentication required'
    }
  }

  if (!user.is_active) {
    return {
      hasAccess: false,
      error: 'Account is deactivated'
    }
  }

  if (!hasRole(user.role, requiredRole)) {
    return {
      hasAccess: false,
      error: 'Insufficient permissions'
    }
  }

  return {
    hasAccess: true,
    user
  }
}

// Format user for display
export function formatUserForDisplay(user) {
  return {
    ...user,
    roleDisplayName: getRoleDisplayName(user.role),
    roleColor: getRoleColor(user.role),
    formattedLastLogin: user.last_login 
      ? new Date(user.last_login).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Never',
    formattedCreatedAt: new Date(user.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
