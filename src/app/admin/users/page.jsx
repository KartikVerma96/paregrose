'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAlert } from '@/contexts/AlertContext'
import { Search, Filter, RefreshCw, Users, Mail, Calendar, Clock, Shield, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const { showSuccess, showError } = useAlert()

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter) params.append('role', roleFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/admin/users?${params}`)
      const result = await response.json()

      if (result.success) {
        setUsers(result.data.users)
        setTotalPages(result.data.pagination.totalPages)
      } else {
        showError("Error", result.error)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      showError("Error", "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      console.log('🔄 Updating role for user:', userId, 'to:', newRole)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      })
      
      console.log('📡 Response status:', response.status)
      const result = await response.json()
      console.log('📦 Response data:', result)

      if (result.success) {
        showSuccess("Success", `User role updated to ${newRole}`)
        fetchUsers()
      } else {
        showError("Error", result.error || "Failed to update user role")
      }
    } catch (error) {
      console.error('❌ Error updating user role:', error)
      showError("Error", "Failed to update user role: " + error.message)
    }
  }

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      console.log('🔄 Updating status for user:', userId, 'to:', newStatus)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: newStatus })
      })
      
      console.log('📡 Response status:', response.status)
      const result = await response.json()
      console.log('📦 Response data:', result)

      if (result.success) {
        showSuccess("Success", `User ${newStatus ? 'activated' : 'deactivated'} successfully`)
        fetchUsers()
      } else {
        showError("Error", result.error || "Failed to update user status")
      }
    } catch (error) {
      console.error('❌ Error updating user status:', error)
      showError("Error", "Failed to update user status: " + error.message)
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) {
      showError("Error", "Please select users and an action")
      return
    }

    try {
      console.log('🔄 Performing bulk action:', bulkAction, 'for users:', selectedUsers)
      const response = await fetch('/api/admin/users/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          action: bulkAction
        })
      })
      
      console.log('📡 Response status:', response.status)
      const result = await response.json()
      console.log('📦 Response data:', result)

      if (result.success) {
        showSuccess("Success", `Bulk action completed for ${result.data.updatedCount} users`)
        setSelectedUsers([])
        setBulkAction('')
        fetchUsers()
      } else {
        showError("Error", result.error || "Failed to perform bulk action")
      }
    } catch (error) {
      console.error('❌ Error performing bulk action:', error)
      showError("Error", "Failed to perform bulk action: " + error.message)
    }
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user.id))
    }
  }

  const openUserModal = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-purple-100 text-purple-800'
      case 'staff': return 'bg-blue-100 text-blue-800'
      case 'customer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'manager': return 'Manager'
      case 'staff': return 'Staff'
      case 'customer': return 'Customer'
      default: return 'Unknown'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Users className="w-8 h-8" />
                Users Management
              </h1>
              <p className="text-indigo-100">Manage user accounts, roles, and permissions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchUsers}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-md">
                <Filter className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Search & Filter</h2>
                <p className="text-xs text-gray-500">Find users by name, email, role, or status</p>
              </div>
            </div>
            {(searchTerm || roleFilter || statusFilter) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold"
              >
                Filters Active
              </motion.div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-2.5 flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                Search Users
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white font-medium text-sm placeholder:text-gray-400"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                {searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2.5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                Filter by Role
              </label>
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all cursor-pointer bg-white font-semibold text-sm"
                >
                  <option value="">All Roles</option>
                  <option value="admin">🔴 Administrator</option>
                  <option value="manager">🟣 Manager</option>
                  <option value="staff">🔵 Staff</option>
                  <option value="customer">⚪ Customer</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2.5 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                Filter by Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all cursor-pointer bg-white font-semibold text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">🟢 Active</option>
                  <option value="inactive">🔴 Inactive</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Summary & Clear Button */}
          {(searchTerm || roleFilter || statusFilter) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 pt-5 border-t-2 border-gray-200"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-600">Active Filters:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <Search className="w-3 h-3" />
                      "{searchTerm}"
                    </span>
                  )}
                  {roleFilter && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <Shield className="w-3 h-3" />
                      {roleFilter}
                    </span>
                  )}
                  {statusFilter && (
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <CheckCircle className="w-3 h-3" />
                      {statusFilter}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm('')
                    setRoleFilter('')
                    setStatusFilter('')
                    setCurrentPage(1)
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Clear All Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedUsers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4 flex-wrap gap-3">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                    {selectedUsers.length} Selected
                  </div>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-4 py-2 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium cursor-pointer"
                  >
                    <option value="">Choose Action...</option>
                    <option value="activate">✅ Activate Users</option>
                    <option value="deactivate">❌ Deactivate Users</option>
                    <option value="make_staff">👔 Make Staff</option>
                    <option value="make_customer">👤 Make Customer</option>
                    <option value="make_manager">⭐ Make Manager</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer"
                  >
                    Apply Action
                  </motion.button>
                </div>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="text-blue-700 hover:text-blue-900 text-sm font-semibold underline cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users Display */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Only on Large Screens */}
              <div className="hidden min-[1400px]:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-4 text-left w-12">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={selectAllUsers}
                          className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[200px]">
                        User
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[200px]">
                        Email
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[130px]">
                        Role
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[110px]">
                        Status
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px]">
                        Last Login
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[150px]">
                        Joined
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[280px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {users.map((user, index) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200"
                      >
                        <td className="px-4 py-5 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-base font-bold text-white">
                                  {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-gray-900 truncate">
                                {user.fullName}
                              </div>
                              <div className="text-xs text-gray-500 font-medium">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700 max-w-[200px]">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg ${getRoleColor(user.role)} shadow-sm`}>
                            <Shield className="w-3.5 h-3.5" />
                            {getRoleDisplayName(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                            user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{user.last_login ? formatDate(user.last_login) : 'Never'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{formatDate(user.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openUserModal(user)}
                              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </motion.button>
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                              className="text-xs border-2 border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer font-semibold bg-white hover:border-purple-300 min-w-[90px]"
                            >
                              <option value="customer">Customer</option>
                              <option value="staff">Staff</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatusUpdate(user.id, !user.is_active)}
                              className={`text-xs px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                                user.is_active 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {user.is_active ? (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Enable
                                </>
                              )}
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card View - Visible on All Screens Below 1400px */}
              <div className="min-[1400px]:hidden p-4 space-y-4">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
                  >
                    {/* Card Header with Avatar */}
                    <div className="flex items-start gap-4 mb-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer mt-1"
                      />
                      <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold text-white">
                          {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{user.fullName}</h3>
                        <p className="text-xs text-gray-500 font-medium">ID: {user.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg ${getRoleColor(user.role)} shadow-sm`}>
                        <Shield className="w-3.5 h-3.5" />
                        {getRoleDisplayName(user.role)}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Inactive
                          </>
                        )}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                        <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="font-semibold">Last Login</span>
                        </div>
                        <p className="text-gray-900 font-bold text-xs">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Never'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                        <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span className="font-semibold">Joined</span>
                        </div>
                        <p className="text-gray-900 font-bold text-xs">
                          {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Actions - Stacked for better touch */}
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openUserModal(user)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        View Full Details
                      </motion.button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                          className="text-xs border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer font-bold bg-white hover:border-purple-300"
                        >
                          <option value="customer">👤 Customer</option>
                          <option value="staff">👔 Staff</option>
                          <option value="manager">⭐ Manager</option>
                          <option value="admin">🔐 Admin</option>
                        </select>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStatusUpdate(user.id, !user.is_active)}
                          className={`text-xs px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            user.is_active 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200'
                          }`}
                        >
                          {user.is_active ? (
                            <>
                              <XCircle className="w-4 h-4" />
                              Disable
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Enable
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between min-[1400px]:hidden">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border-2 border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                      >
                        Previous
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border-2 border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                      >
                        Next
                      </motion.button>
                    </div>
                    <div className="hidden min-[1400px]:flex-1 min-[1400px]:flex min-[1400px]:items-center min-[1400px]:justify-between">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-700 font-semibold">
                          Page <span className="text-purple-600 font-bold">{currentPage}</span> of{' '}
                          <span className="text-purple-600 font-bold">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-xl shadow-md overflow-hidden">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-6 py-2.5 border-r border-gray-300 bg-white text-sm font-bold text-gray-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ← Previous
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-6 py-2.5 bg-white text-sm font-bold text-gray-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Next →
                          </motion.button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* User Details Modal */}
        <AnimatePresence>
          {showUserModal && selectedUser && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 overflow-y-auto p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowUserModal(false)
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 my-8"
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-lg font-bold text-white">
                          {selectedUser.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      User Details
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowUserModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Complete information about this user account
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" />
                      Full Name
                    </label>
                    <p className="text-base text-gray-900 font-bold">{selectedUser.fullName}</p>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      Email Address
                    </label>
                    <p className="text-base text-gray-900 font-bold">{selectedUser.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        Role
                      </label>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg ${getRoleColor(selectedUser.role)} shadow-sm`}>
                        <Shield className="w-3.5 h-3.5" />
                        {getRoleDisplayName(selectedUser.role)}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Status
                      </label>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                        selectedUser.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.is_active ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Inactive
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Last Login
                    </label>
                    <p className="text-sm text-gray-900 font-semibold">
                      {selectedUser.last_login ? formatDate(selectedUser.last_login) : 'Never logged in'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      Member Since
                    </label>
                    <p className="text-sm text-gray-900 font-semibold">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-6 border-t-2 border-gray-100 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
