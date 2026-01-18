'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAlert } from '@/contexts/AlertContext'
import ImageUpload from '@/components/admin/ImageUpload'
import { Search, Filter, XCircle, Tag, CheckCircle, Layers } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [selectedSubcategories, setSelectedSubcategories] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [togglingSubcategories, setTogglingSubcategories] = useState(new Set())
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true,
    categoryId: ''
  })
  const { showSuccess, showError } = useAlert()

  useEffect(() => {
    fetchSubcategories()
    fetchCategories()
  }, [])

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/admin/subcategories')
      const result = await response.json()
      if (result.success) {
        setSubcategories(result.data)
      } else {
        showError("Error", result.error || 'Failed to fetch subcategories')
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      showError("Error", 'Failed to fetch subcategories')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const result = await response.json()
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingSubcategory 
        ? `/api/admin/subcategories/${editingSubcategory.id}` 
        : '/api/admin/subcategories'
      const method = editingSubcategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (result.success) {
        showSuccess("Success", `Subcategory ${editingSubcategory ? 'updated' : 'created'} successfully`)
        closeModal()
        fetchSubcategories()
      } else {
        showError("Error", result.error || 'Unknown error occurred')
      }
    } catch (error) {
      console.error('Error saving subcategory:', error)
      showError("Error", `Failed to save subcategory: ${error.message}`)
    }
  }

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory)
    setFormData({
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || '',
      imageUrl: subcategory.image_url || '',
      isActive: subcategory.is_active !== undefined ? subcategory.is_active : true,
      categoryId: subcategory.category_id.toString()
    })
    setShowModal(true)
  }

  const handleDelete = async (subcategoryId) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return

    try {
      const response = await fetch(`/api/admin/subcategories/${subcategoryId}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        showSuccess("Success", "Subcategory deleted successfully")
        fetchSubcategories()
      } else {
        showError("Error", result.error || 'Failed to delete subcategory')
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      showError("Error", "Failed to delete subcategory")
    }
  }

  const handleToggleStatus = async (subcategoryId, currentStatus) => {
    try {
      setTogglingSubcategories(prev => new Set([...prev, subcategoryId]))
      
      const response = await fetch(`/api/admin/subcategories/${subcategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })
      
      const result = await response.json()

      if (result.success) {
        showSuccess("Success", `Subcategory ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        setSubcategories(prev => prev.map(sub => 
          sub.id === subcategoryId 
            ? { ...sub, is_active: !currentStatus }
            : sub
        ))
      } else {
        showError("Error", result.error || 'Failed to update subcategory status')
      }
    } catch (error) {
      console.error('Error toggling subcategory status:', error)
      showError("Error", "Failed to update subcategory status")
    } finally {
      setTogglingSubcategories(prev => {
        const newSet = new Set(prev)
        newSet.delete(subcategoryId)
        return newSet
      })
    }
  }

  const handleSelectSubcategory = (subcategoryId) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubcategories([])
    } else {
      setSelectedSubcategories(filteredSubcategories.map(sub => sub.id))
    }
    setSelectAll(!selectAll)
  }

  const handleBulkAction = async (action) => {
    if (selectedSubcategories.length === 0) {
      showError("Error", "Please select subcategories to perform bulk action")
      return
    }

    try {
      const promises = selectedSubcategories.map(subcategoryId => {
        const subcategory = subcategories.find(sub => sub.id === subcategoryId)
        const currentStatus = subcategory.is_active
        const newStatus = action === 'activate' ? true : false

        if (currentStatus !== newStatus) {
          return fetch(`/api/admin/subcategories/${subcategoryId}`, {
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
      showSuccess("Success", `${selectedSubcategories.length} subcategories ${action}d successfully`)
      setSelectedSubcategories([])
      setSelectAll(false)
      fetchSubcategories()
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

    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    }
  }

  const openModal = () => {
    setEditingSubcategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true,
      categoryId: ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingSubcategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true,
      categoryId: ''
    })
  }

  const filteredSubcategories = subcategories.filter(subcategory => {
    const matchesSearch = subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subcategory.category && subcategory.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
      subcategory.category_id.toString() === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Subcategories Management</h1>
              <p className="text-gray-600 text-lg mb-4">Manage subcategories for your product categories</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {subcategories.filter(sub => sub.is_active !== false).length} Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {subcategories.filter(sub => sub.is_active === false).length} Inactive
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {subcategories.length} Total Subcategories
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={openModal}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Subcategory
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-md">
                <Filter className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Search & Filter</h2>
                <p className="text-xs text-gray-500">Find subcategories by name, slug, or parent category</p>
              </div>
            </div>
            {(searchTerm || selectedCategory !== 'all') && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold"
              >
                Filters Active
              </motion.div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2.5 flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                Search Subcategories
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, slug, or parent category..."
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

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2.5 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                Filter by Parent Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all cursor-pointer bg-white font-semibold text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name} ({subcategories.filter(sub => sub.category_id === category.id).length})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchTerm || selectedCategory !== 'all') && (
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
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <Layers className="w-3 h-3" />
                      {categories.find(c => c.id.toString() === selectedCategory)?.name || selectedCategory}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
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
          {selectedSubcategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                  {selectedSubcategories.length} Selected
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
                    setSelectedSubcategories([])
                    setSelectAll(false)
                  }}
                  className="text-purple-700 hover:text-purple-900 text-sm font-semibold underline cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subcategories Table/List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading subcategories...</p>
            </div>
          ) : filteredSubcategories.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-6">
                  <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {searchTerm || selectedCategory !== 'all' ? 'No subcategories found' : 'No subcategories yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your filters or clear them' : 'Get started by creating your first subcategory to organize your products'}
                </p>
                {!searchTerm && selectedCategory === 'all' ? (
                  <button
                    onClick={openModal}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create First Subcategory
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                    }}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
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
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div className="col-span-3">Subcategory Name</div>
                  <div className="col-span-2">Parent Category</div>
                  <div className="col-span-2">Slug</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredSubcategories.map((subcategory) => {
                  const isActive = subcategory.is_active !== undefined ? subcategory.is_active : true;
                  return (
                    <div
                      key={subcategory.id}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150 ${
                        selectedSubcategories.includes(subcategory.id) ? 'bg-purple-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(subcategory.id)}
                          onChange={() => handleSelectSubcategory(subcategory.id)}
                          className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                        />
                      </div>

                      {/* Name */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          {subcategory.image_url && (
                            <img
                              src={subcategory.image_url}
                              alt={subcategory.name}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {subcategory.name}
                            </h3>
                            <p className="text-xs text-gray-500">ID: {subcategory.id}</p>
                          </div>
                        </div>
                      </div>

                      {/* Parent Category */}
                      <div className="col-span-2">
                        {subcategory.category ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {subcategory.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No category</span>
                        )}
                      </div>

                      {/* Slug */}
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                          {subcategory.slug}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => handleToggleStatus(subcategory.id, isActive)}
                          disabled={togglingSubcategories.has(subcategory.id)}
                          className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                            isActive
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {togglingSubcategories.has(subcategory.id) ? (
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
                          onClick={() => handleEdit(subcategory)}
                          className="px-3 py-1.5 bg-purple-500 text-white hover:bg-purple-600 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md"
                          title="Edit subcategory"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(subcategory.id)}
                          className="px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md"
                          title="Delete subcategory"
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

        {/* Subcategory Modal */}
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
                    {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
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
                  {editingSubcategory ? 'Update the subcategory information below' : 'Fill in the details to create a new subcategory'}
                </p>
              </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select a parent category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <ImageUpload
                    currentImage={formData.imageUrl}
                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    type="subcategories"
                    label="Subcategory Image"
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
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
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      {editingSubcategory ? 'Update Subcategory' : 'Create Subcategory'}
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
