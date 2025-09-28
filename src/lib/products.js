// Product utility functions for client-side usage

// Fetch all products with optional filters
export async function fetchProducts(filters = {}) {
  try {
    const searchParams = new URLSearchParams()
    
    // Add filters to search params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value)
      }
    })
    
    const response = await fetch(`/api/products?${searchParams.toString()}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch products')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Fetch single product by ID or slug
export async function fetchProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Product not found')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

// Fetch featured products
export async function fetchFeaturedProducts(limit = 8) {
  try {
    const response = await fetch(`/api/products/featured?limit=${limit}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch featured products')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }
}

// Fetch bestseller products
export async function fetchBestsellerProducts(limit = 8) {
  try {
    const response = await fetch(`/api/products/bestsellers?limit=${limit}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch bestseller products')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching bestseller products:', error)
    throw error
  }
}

// Fetch categories
export async function fetchCategories(includeProducts = false, includeCount = false) {
  try {
    const searchParams = new URLSearchParams()
    if (includeProducts) searchParams.append('includeProducts', 'true')
    if (includeCount) searchParams.append('includeCount', 'true')
    
    const response = await fetch(`/api/categories?${searchParams.toString()}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch categories')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// Helper function to format price
export function formatPrice(price, currency = '₹') {
  return `${currency}${parseFloat(price).toLocaleString('en-IN')}`
}

// Helper function to calculate discount percentage
export function calculateDiscountPercentage(originalPrice, currentPrice) {
  if (!originalPrice || originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

// Helper function to get primary image
export function getPrimaryImage(product) {
  if (!product.images || product.images.length === 0) return null
  
  const primaryImage = product.images.find(img => img.isPrimary)
  return primaryImage || product.images[0]
}

// Helper function to format product for display
export function formatProductForDisplay(product) {
  return {
    ...product,
    formattedPrice: formatPrice(product.price),
    formattedOriginalPrice: product.originalPrice ? formatPrice(product.originalPrice) : null,
    discountPercentage: calculateDiscountPercentage(product.originalPrice, product.price),
    primaryImage: getPrimaryImage(product),
    averageRating: product.averageRating || 0,
    totalReviews: product.totalReviews || product._count?.reviews || 0
  }
}
