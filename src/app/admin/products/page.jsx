'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAlert } from '@/contexts/AlertContext'
import { Search, Filter, RefreshCw, Package, Tag, XCircle, Grid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'cards'
  const [togglingProducts, setTogglingProducts] = useState(new Set())
  const { showSuccess, showError } = useAlert()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSubcategories()
  }, [currentPage, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/admin/products?${params}`)
      const result = await response.json()

      if (result.success) {
        setProducts(result.data.products)
        setTotalPages(result.data.pagination.totalPages)
      } else {
        showError("Error", result.error)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      showError("Error", "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const result = await response.json()
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/admin/subcategories')
      const result = await response.json()
      if (result.success) {
        setSubcategories(result.data)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      console.log(`🗑️ Delete button clicked for product ${productId}`)
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      
      console.log(`📡 Delete API Response status: ${response.status}`)
      const result = await response.json()
      console.log(`📦 Delete API Response data:`, result)

      if (result.success) {
        showSuccess("Success", "Product deleted successfully")
        fetchProducts()
      } else {
        showError("Error", result.error)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showError("Error", "Failed to delete product")
    }
  }

  const toggleFeature = async (productId, feature, currentValue) => {
    try {
      console.log(`🔄 Toggle ${feature} clicked for product ${productId}`)
      console.log(`📊 Current value: ${currentValue}, New value: ${!currentValue}`)
      
      setTogglingProducts(prev => new Set([...prev, productId]))
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [feature]: !currentValue
        })
      })
      
      console.log(`📡 API Response status: ${response.status}`)
      const result = await response.json()
      console.log(`📦 API Response data:`, result)

      if (result.success) {
        showSuccess("Success", `Product ${feature} updated`)
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, [feature]: !currentValue }
            : product
        ))
      } else {
        showError("Error", result.error)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      showError("Error", "Failed to update product")
    } finally {
      setTogglingProducts(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(product => product.id))
    }
    setSelectAll(!selectAll)
  }

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      showError("Error", "Please select products to perform bulk action")
      return
    }

    try {
      const promises = selectedProducts.map(productId => {
        const product = products.find(p => p.id === productId)
        const newValue = action === 'activate' ? true : false

        if (product.is_active !== newValue) {
          return fetch(`/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              is_active: newValue
            })
          })
        }
        return Promise.resolve()
      })

      await Promise.all(promises)
      showSuccess("Success", `${selectedProducts.length} products ${action}d successfully`)
      setSelectedProducts([])
      setSelectAll(false)
      fetchProducts()
    } catch (error) {
      console.error('Error performing bulk action:', error)
      showError("Error", "Failed to perform bulk action")
    }
  }

  const formatPrice = (price) => `₹${parseFloat(price).toLocaleString('en-IN')}`

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
              <p className="text-gray-600 text-lg mb-4">Manage your product inventory and catalog</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {products.filter(p => p.is_active !== false).length} Active Products
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {products.filter(p => p.is_active === false).length} Inactive Products
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {products.length} Total Products
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'table'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Table View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Table</span>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'cards'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
              <a
                href="/admin/products/new"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Product
              </a>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md">
                <Filter className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Search & Filter</h2>
                <p className="text-xs text-gray-500">Find products by name, brand, or category</p>
              </div>
            </div>
            {(searchTerm || selectedCategory) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold"
              >
                Filters Active
              </motion.div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2.5 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, brand, or description..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white font-medium text-sm placeholder:text-gray-400"
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
                <Tag className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                Filter by Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer bg-white font-semibold text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
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
          {(searchTerm || selectedCategory) && (
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
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <Search className="w-3 h-3" />
                      "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <Tag className="w-3 h-3" />
                      {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('')
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
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-5 shadow-lg"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="bg-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                  {selectedProducts.length} Selected
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
                    setSelectedProducts([])
                    setSelectAll(false)
                  }}
                  className="text-emerald-700 hover:text-emerald-900 text-sm font-semibold underline cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Display */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading products...</p>
            </div>
          ) : (
            <>
              {products.length > 0 && viewMode === 'table' && (
                <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Select All ({products.length} products)
                    </span>
                  </div>
                </div>
              )}
              
              {viewMode === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subcategory
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Features
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className={`hover:bg-gray-50 transition-colors duration-200 ${
                          selectedProducts.includes(product.id) ? 'bg-emerald-50' : ''
                        }`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleSelectProduct(product.id)}
                              className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                  className="h-12 w-12 rounded-lg object-cover shadow-sm"
                                  src={product.images?.[0]?.image_url || product.images?.[0]?.imageUrl || '/images/carousel/pic_1.jpg'}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {product.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {product.category?.name || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">
                              {product.subcategory?.name || 'None'}
                            </span>
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </div>
                          {product.original_price && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(product.original_price)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            (product.stock_quantity || 0) > 10 ? 'bg-green-100 text-green-800' :
                            (product.stock_quantity || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock_quantity || 0} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {product.is_featured && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                Featured
                              </span>
                            )}
                            {product.is_bestseller && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Bestseller
                              </span>
                            )}
                            {product.is_new_arrival && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                New
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => {
                                  console.log('🖱️ Edit button clicked for product:', product.id)
                                  router.push(`/admin/products/${product.id}/edit`)
                                }}
                                className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-md hover:shadow-lg"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              
                              <button
                                onClick={() => toggleFeature(product.id, 'is_featured', product.is_featured)}
                                disabled={togglingProducts.has(product.id)}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                                  product.is_featured 
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                } ${togglingProducts.has(product.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Toggle Featured"
                              >
                                ⭐ {product.is_featured ? 'Featured' : 'Feature'}
                              </button>
                              
                              <button
                                onClick={() => toggleFeature(product.id, 'is_bestseller', product.is_bestseller)}
                                disabled={togglingProducts.has(product.id)}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                                  product.is_bestseller 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                } ${togglingProducts.has(product.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Toggle Bestseller"
                              >
                                🏆 {product.is_bestseller ? 'Bestseller' : 'Bestseller'}
                              </button>
                              
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-md hover:shadow-lg"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
              ) : (
                /* Cards View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {products.map((product) => (
                    <div key={product.id} className={`group border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      selectedProducts.includes(product.id)
                        ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      {/* Header with checkbox */}
                      <div className="flex items-start justify-between mb-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                        />
                        <div className="flex-1 ml-3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            ID: {product.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product.category?.name || 'Uncategorized'}
                          </p>
                          {product.subcategory && (
                            <p className="text-xs text-gray-500">
                              Subcategory: {product.subcategory.name}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Product Image */}
                      <div className="mb-4">
                        <img
                          className="w-full h-48 object-cover rounded-lg shadow-sm"
                          src={product.images?.[0]?.image_url || product.images?.[0]?.imageUrl || '/images/carousel/pic_1.jpg'}
                          alt={product.name}
                        />
                      </div>
                      
                      {/* Price and Stock */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            (product.stock_quantity || 0) > 10 ? 'bg-green-100 text-green-800' :
                            (product.stock_quantity || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock_quantity || 0} units
                          </span>
                        </div>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>
                      
                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {product.isFeatured && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Featured
                            </span>
                          )}
                          {product.isBestseller && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Bestseller
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              console.log('🖱️ Edit button clicked for product:', product.id)
                              router.push(`/admin/products/${product.id}/edit`)
                            }}
                            className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-md hover:shadow-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-md hover:shadow-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {products.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="text-gray-400 mb-6">
                      <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || selectedCategory ? 'Try adjusting your search criteria or clear the filters' : 'Get started by adding your first product to the catalog'}
                    </p>
                    {!searchTerm && !selectedCategory ? (
                      <a
                        href="/admin/products/new"
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create First Product
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedCategory('')
                          setCurrentPage(1)
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
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Page <span className="font-medium">{currentPage}</span> of{' '}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
