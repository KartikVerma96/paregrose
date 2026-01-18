'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductForm from '@/components/admin/ProductForm'
import { useAlert } from '@/contexts/AlertContext'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { showError } = useAlert()

  const fetchProduct = useCallback(async () => {
    try {
      console.log('🔍 Fetching product with ID:', params.id)
      const response = await fetch(`/api/admin/products/${params.id}`)
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
      
      const responseText = await response.text()
      console.log('📦 Raw response:', responseText)
      
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError)
        showError("Error", 'Invalid response from server')
        setLoading(false)
        return
      }
      
      console.log('✅ Parsed response data:', result)
      
      if (result.success) {
        console.log('✅ Product loaded successfully:', result.data)
        setProduct(result.data)
      } else {
        console.error('❌ Failed to fetch product:', result.error)
        showError("Error", result.error || 'Failed to fetch product')
        // Don't redirect immediately, let user see the error
      }
    } catch (error) {
      console.error('❌ Error fetching product:', error)
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      })
      showError("Error", 'Failed to fetch product. Please ensure you are logged in as admin.')
    } finally {
      setLoading(false)
    }
  }, [params.id, showError])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      const result = await response.json()
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])
  
  useEffect(() => {
    if (params.id) {
      fetchProduct()
      fetchCategories()
    }
  }, [params.id, fetchProduct, fetchCategories])

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/6 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!loading && !product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
            <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're trying to edit doesn't exist or you don't have permission to access it.</p>
            <button
              onClick={() => router.push('/admin/products')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              Go Back to Products
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
        </div>
        <ProductForm 
          categories={categories} 
          initialData={product}
          isEditing={true}
        />
      </div>
    </AdminLayout>
  )
}

