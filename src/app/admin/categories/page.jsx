'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAlert } from '@/contexts/AlertContext'
import { Search, Filter, XCircle, Tag, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { categorySchema } from '@/lib/validations/admin'
import ImageUpload from '@/components/admin/ImageUpload'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [togglingCategories, setTogglingCategories] = useState(new Set())
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true
  })
  const { showSuccess, showError } = useAlert()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      console.log('Fetching categories...')
      const response = await fetch('/api/admin/categories')
      const result = await response.json()
      
      console.log('Categories response:', result)

      if (result.success) {
        setCategories(result.data)
      } else {
        // Check if it's a table not found error
        if (result.error && result.error.includes('does not exist')) {
          showError("Database Error", "Category table not found. Please run the database migration or SQL script.")
        } else {
          showError("Error", result.error || 'Failed to fetch categories')
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      showError("Error", `Failed to fetch categories: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      console.log('Submitting category:', formData)
      
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      console.log('Making request to:', url, 'with method:', method)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response result:', result)

      if (result.success) {
        showSuccess(
          editingCategory ? "Category Updated" : "Category Created",
          editingCategory ? "Category has been updated successfully" : "Category has been created successfully"
        )
        setShowModal(false)
        setEditingCategory(null)
        setFormData({
          name: '',
          slug: '',
          description: '',
          imageUrl: '',
          isActive: true
        })
        fetchCategories()
      } else {
        showError("Error", result.error || 'Unknown error occurred')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      showError("Error", `Failed to save category: ${error.message}`)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.image_url || category.imageUrl || '',
      isActive: category.is_active !== undefined ? category.is_active : category.isActive !== undefined ? category.isActive : true
    })
    setShowModal(true)
  }

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Success", "Category deleted successfully")
        fetchCategories()
      } else {
        showError("Error", result.error)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      showError("Error", "Failed to delete category")
    }
  }

  const handleToggleStatus = async (categoryId, currentStatus) => {
    try {
      console.log('Toggling category status:', { categoryId, currentStatus, newStatus: !currentStatus })
      
      // Add to toggling state
      setTogglingCategories(prev => new Set([...prev, categoryId]))
      
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })
      
      console.log('Toggle response status:', response.status)
      const result = await response.json()
      console.log('Toggle response result:', result)

      if (result.success) {
        showSuccess("Success", `Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        // Immediately update the local state for better UX
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, is_active: !currentStatus }
            : cat
        ))
      } else {
        showError("Error", result.error || 'Failed to update category status')
      }
    } catch (error) {
      console.error('Error toggling category status:', error)
      showError("Error", "Failed to update category status")
    } finally {
      // Remove from toggling state
      setTogglingCategories(prev => {
        const newSet = new Set(prev)
        newSet.delete(categoryId)
        return newSet
      })
    }
  }

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(filteredCategories.map(cat => cat.id))
    }
    setSelectAll(!selectAll)
  }

  const handleBulkAction = async (action) => {
    if (selectedCategories.length === 0) {
      showError("Error", "Please select categories to perform bulk action")
      return
    }

    try {
      const promises = selectedCategories.map(categoryId => {
        const category = categories.find(cat => cat.id === categoryId)
        const currentStatus = category.is_active !== undefined ? category.is_active : category.isActive
        const newStatus = action === 'activate' ? true : false

        if (currentStatus !== newStatus) {
          return fetch(`/api/admin/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              isActive: newStatus
            })
          })
        }
        return Promise.resolve()
      })

      await Promise.all(promises)
      showSuccess("Success", `${selectedCategories.length} categories ${action}d successfully`)
      setSelectedCategories([])
      setSelectAll(false)
      fetchCategories()
    } catch (error) {
      console.error('Error performing bulk action:', error)
      showError("Error", "Failed to perform bulk action")
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Auto-generate slug from name
    if (name === 'name' && !editingCategory) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    }
  }

  const openModal = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true
    })
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories Management</h1>
              <p className="text-gray-600 text-lg mb-4">Organize your products with beautiful categories</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {categories.filter(cat => cat.is_active !== false).length} Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {categories.filter(cat => cat.is_active === false).length} Inactive
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {categories.length} Total Categories
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/admin/subcategories"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Manage Subcategories
              </a>
              <button
                onClick={openModal}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Category
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-md">
                <Filter className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Search & Filter</h2>
                <p className="text-xs text-gray-500">Find categories by name or slug</p>
              </div>
            </div>
            {searchTerm && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold"
              >
                Filters Active
              </motion.div>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2.5 flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                Search Categories
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or slug..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white font-medium text-sm placeholder:text-gray-400"
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
          </div>

          {/* Active Filters Summary */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 pt-5 border-t-2 border-gray-200"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-600">Active Filters:</span>
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                    <Search className="w-3 h-3" />
                    "{searchTerm}"
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm('')}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Clear Search
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="bg-amber-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                  {selectedCategories.length} Selected
                </div>
                <div className="flex gap-2 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkAction('activate')}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Activate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkAction('deactivate')}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md hover:shadow-lg"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Deactivate
                  </motion.button>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectAll(false)
                  }}
                  className="text-amber-700 hover:text-amber-900 text-sm font-semibold underline cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Table/List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-6">
                  <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {searchTerm ? 'No categories found' : 'No categories yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try adjusting your search terms or clear the search' : 'Get started by creating your first category to organize your products'}
                </p>
                {!searchTerm ? (
                  <button
                    onClick={openModal}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create First Category
                  </button>
                ) : (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center font-semibold text-gray-700 text-sm">
                  <div className="col-span-1 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div className="col-span-3">Category Name</div>
                  <div className="col-span-2">Slug</div>
                  <div className="col-span-2">Subcategories</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredCategories.map((category) => {
                  const isActive = category.is_active !== undefined ? category.is_active : category.isActive;
                  return (
                    <div
                      key={category.id}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150 ${
                        selectedCategories.includes(category.id) ? 'bg-amber-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleSelectCategory(category.id)}
                          className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                        />
                      </div>

                      {/* Name */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          {(category.image_url || category.imageUrl) && (
                            <img
                              src={category.image_url || category.imageUrl}
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {category.name}
                            </h3>
                            <p className="text-xs text-gray-500">ID: {category.id}</p>
                          </div>
                        </div>
                      </div>

                      {/* Slug */}
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                          {category.slug}
                        </p>
                      </div>

                      {/* Subcategories Count */}
                      <div className="col-span-2">
                        {category.subcategories && category.subcategories.length > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category.subcategories.length} subcategor{category.subcategories.length === 1 ? 'y' : 'ies'}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No subcategories</span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => handleToggleStatus(category.id, isActive)}
                          disabled={togglingCategories.has(category.id)}
                          className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                            isActive
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {togglingCategories.has(category.id) ? (
                            'Loading...'
                          ) : isActive ? (
                            'Active'
                          ) : (
                            'Inactive'
                          )}
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="col-span-3 flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="px-3 py-1.5 bg-amber-500 text-white hover:bg-amber-600 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md"
                          title="Edit category"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md"
                          title="Delete category"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Category Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 overflow-y-auto p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal()
            }}
          >
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 my-8 animate-in fade-in zoom-in duration-200">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer p-1 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {editingCategory ? 'Update the category information below' : 'Fill in the details to create a new category'}
                </p>
              </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  
                  <ImageUpload
                    currentImage={formData.imageUrl}
                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    type="categories"
                    label="Category Image"
                  />
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
