'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAlert } from '@/contexts/AlertContext'

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
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

  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subcategory.category && subcategory.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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

        {/* Search and Bulk Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🔍 Search Subcategories
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, slug, or parent category..."
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {selectedSubcategories.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                  <span className="text-sm font-semibold text-purple-700">
                    {selectedSubcategories.length} subcategories selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Deactivate
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubcategories([])
                      setSelectAll(false)
                    }}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading subcategories...</p>
            </div>
          ) : (
            <>
              {filteredSubcategories.length > 0 && (
                <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Select All ({filteredSubcategories.length} subcategories)
                    </span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredSubcategories.map((subcategory) => {
                const isActive = subcategory.is_active !== undefined ? subcategory.is_active : true;
                return (
                <div key={subcategory.id} className={`group border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedSubcategories.includes(subcategory.id) 
                    ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  {/* Header with checkbox and status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(subcategory.id)}
                        onChange={() => handleSelectSubcategory(subcategory.id)}
                        className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {subcategory.name}
                            </h3>
                            {subcategory.category && (
                              <p className="text-xs text-purple-600 mt-1">
                                Under: <span className="font-medium">{subcategory.category.name}</span>
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleToggleStatus(subcategory.id, isActive)}
                            disabled={togglingSubcategories.has(subcategory.id)}
                            className={`px-3 py-2 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${
                              isActive
                                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600'
                                : 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600'
                            }`}
                            title={`Click to ${isActive ? 'deactivate' : 'activate'} subcategory`}
                          >
                            {togglingSubcategories.has(subcategory.id) ? (
                              <span className="flex items-center gap-1">
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Updating...
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                {isActive ? (
                                  <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Inactive
                                  </>
                                )}
                              </span>
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-medium">Slug:</span> {subcategory.slug}
                        </p>
                        {subcategory.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {subcategory.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subcategory Image */}
                  {(subcategory.image_url) && (
                    <div className="mb-4">
                      <img
                        src={subcategory.image_url}
                        alt={subcategory.name}
                        className="w-full h-32 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        ID: {subcategory.id}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(subcategory)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-400 to-indigo-400 text-white hover:from-purple-500 hover:to-indigo-500 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subcategory.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
              
              {filteredSubcategories.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="text-gray-400 mb-6">
                      <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {searchTerm ? 'No subcategories found' : 'No subcategories yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? 'Try adjusting your search terms or clear the search' : 'Get started by creating your first subcategory to organize your products'}
                    </p>
                    {!searchTerm ? (
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
              )}
              </div>
            </>
          )}
        </div>

        {/* Subcategory Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Category *
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
                      Subcategory Name *
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
                      Slug *
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

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

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                    >
                      {editingSubcategory ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
