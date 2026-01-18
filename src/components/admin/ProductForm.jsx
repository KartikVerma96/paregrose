'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAlert } from '@/contexts/AlertContext'
import { productSchema } from '@/lib/validations/admin'
import MultiImageUpload from '@/components/admin/MultiImageUpload'
import VariantManager from '@/components/admin/VariantManager'

const ProductForm = ({ product = null, initialData = null, isEditing = false, categories = [] }) => {
  const router = useRouter()
  const { showSuccess, showError } = useAlert()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Use either product or initialData (support both prop names)
  // Memoize to prevent unnecessary re-parsing
  const productData = useMemo(() => initialData || product, [initialData, product])
  
  // Map database enum values to display values for availability
  const availabilityDisplayMap = {
    'In_Stock': 'In Stock',
    'Out_of_Stock': 'Out of Stock',
    'Limited_Stock': 'Limited Stock'
  }
  
  // Parse size and color options from JSON strings - memoized to prevent re-parsing on every render
  const initialSizes = useMemo(() => {
    const sizeData = productData?.size_options || productData?.sizeOptions || '';
    console.log('🔍 [INITIAL] Parsing size options, raw data:', sizeData, 'Type:', typeof sizeData);
    if (!sizeData) return [];
    try {
      const parsed = typeof sizeData === 'string' ? JSON.parse(sizeData) : sizeData;
      console.log('✅ [INITIAL] Parsed sizes:', parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('❌ [INITIAL] Error parsing size options:', error);
      return [];
    }
  }, [productData?.size_options, productData?.sizeOptions]);
  
  const initialColors = useMemo(() => {
    const colorData = productData?.color_options || productData?.colorOptions || '';
    console.log('🔍 [INITIAL] Parsing color options, raw data:', colorData, 'Type:', typeof colorData);
    if (!colorData) return [];
    try {
      const parsed = typeof colorData === 'string' ? JSON.parse(colorData) : colorData;
      console.log('✅ [INITIAL] Parsed colors:', parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('❌ [INITIAL] Error parsing color options:', error);
      return [];
    }
  }, [productData?.color_options, productData?.colorOptions]);
  
  const [formData, setFormData] = useState({
    name: productData?.name || '',
    description: productData?.description || '',
    shortDescription: productData?.short_description || productData?.shortDescription || '',
    categoryId: productData?.category_id?.toString() || productData?.categoryId?.toString() || '',
    subcategoryId: productData?.subcategory_id?.toString() || productData?.subcategoryId?.toString() || '',
    price: productData?.price?.toString() || '',
    originalPrice: productData?.original_price?.toString() || productData?.originalPrice?.toString() || '',
    discountPercentage: productData?.discount_percentage?.toString() || productData?.discountPercentage?.toString() || '',
    brand: productData?.brand || '',
    material: productData?.material || '',
    sizeOptions: productData?.size_options || productData?.sizeOptions || '',
    colorOptions: productData?.color_options || productData?.colorOptions || '',
    availability: availabilityDisplayMap[productData?.availability] || productData?.availability || 'In Stock',
    stockQuantity: productData?.stock_quantity?.toString() || productData?.stockQuantity?.toString() || '0',
    weight: productData?.weight?.toString() || '',
    dimensions: productData?.dimensions || '',
    careInstructions: productData?.care_instructions || productData?.careInstructions || '',
    isFeatured: productData?.is_featured !== undefined ? productData.is_featured : (productData?.isFeatured || false),
    isBestseller: productData?.is_bestseller !== undefined ? productData.is_bestseller : (productData?.isBestseller || false),
    isNewArrival: productData?.is_new_arrival !== undefined ? productData.is_new_arrival : (productData?.isNewArrival || false),
    isActive: productData?.is_active !== undefined ? productData.is_active : (productData?.isActive !== false),
    metaTitle: productData?.meta_title || productData?.metaTitle || '',
    metaDescription: productData?.meta_description || productData?.metaDescription || '',
    metaKeywords: productData?.meta_keywords || productData?.metaKeywords || '',
    images: productData?.images?.map(img => ({
      url: img.image_url || img.imageUrl || img.url || '',
      alt: img.alt_text || img.altText || img.alt || '',
      isPrimary: img.is_primary || img.isPrimary || false,
      sortOrder: img.sort_order || img.sortOrder || 0
    })) || []
  })
  
  // State for managing sizes and colors as arrays
  const [sizes, setSizes] = useState(initialSizes);
  const [colors, setColors] = useState(initialColors);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [variants, setVariants] = useState([]);
  
  // Update sizes and colors when productData changes (for edit mode)
  useEffect(() => {
    if (isEditing && initialSizes.length > 0) {
      console.log('🔄 Updating sizes from productData:', initialSizes);
      setSizes(initialSizes);
    }
  }, [isEditing, initialSizes]);
  
  useEffect(() => {
    if (isEditing && initialColors.length > 0) {
      console.log('🔄 Updating colors from productData:', initialColors);
      setColors(initialColors);
    }
  }, [isEditing, initialColors]);
  
  // Update variants when productData changes (for edit mode)
  useEffect(() => {
    if (isEditing && productData?.variants && productData.variants.length > 0) {
      console.log('🔄 Loading existing variants from productData:', productData.variants);
      setVariants(productData.variants);
    }
  }, [isEditing, productData?.variants, productData?.id]);
  
  // Debug: Log initial data (only once per product load)
  useEffect(() => {
    console.log('📋 ProductForm initialized with:', {
      isEditing,
      productId: productData?.id,
      productName: productData?.name,
      initialSizes,
      initialColors,
      initialVariants: variants,
      rawSizeOptions: productData?.size_options,
      rawColorOptions: productData?.color_options
    });
  }, [productData?.id]); // Only log when product ID changes
  
  // Update formData when sizes or colors change
  useEffect(() => {
    if (sizes.length > 0) {
      setFormData(prev => ({ ...prev, sizeOptions: JSON.stringify(sizes) }));
    } else {
      setFormData(prev => ({ ...prev, sizeOptions: '' }));
    }
  }, [sizes]);
  
  useEffect(() => {
    if (colors.length > 0) {
      setFormData(prev => ({ ...prev, colorOptions: JSON.stringify(colors) }));
    } else {
      setFormData(prev => ({ ...prev, colorOptions: '' }));
    }
  }, [colors]);
  
  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };
  
  const removeSize = (sizeToRemove) => {
    setSizes(sizes.filter(s => s !== sizeToRemove));
  };
  
  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };
  
  const removeColor = (colorToRemove) => {
    setColors(colors.filter(c => c !== colorToRemove));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      // Prepare data for validation
      const dataToValidate = {
        name: formData.name || '',
        description: formData.description || '',
        shortDescription: formData.shortDescription || '',
        categoryId: formData.categoryId || '',
        price: formData.price ? (isNaN(parseFloat(formData.price)) ? '' : parseFloat(formData.price)) : '',
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        brand: formData.brand || '',
        material: formData.material || '',
        sizeOptions: formData.sizeOptions || '',
        colorOptions: formData.colorOptions || '',
        availability: formData.availability || 'In Stock',
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        careInstructions: formData.careInstructions || '',
        isFeatured: formData.isFeatured || false,
        isBestseller: formData.isBestseller || false,
        isNewArrival: formData.isNewArrival || false,
        isActive: formData.isActive !== false,
        metaTitle: formData.metaTitle || '',
        metaDescription: formData.metaDescription || '',
        metaKeywords: formData.metaKeywords || '',
        images: formData.images.filter(img => img.url && img.url.trim() !== '')
      }

      // Validate with Zod
      const validation = productSchema.safeParse(dataToValidate)
      
      if (!validation.success) {
        // Validation failed
        const fieldErrors = {}
        console.log('Validation errors:', validation.error.issues)
        validation.error.issues.forEach(issue => {
          const fieldName = issue.path[0]
          fieldErrors[fieldName] = issue.message
          console.log(`Field "${fieldName}" error:`, issue.message)
        })
        setErrors(fieldErrors)
        
        // Show specific error
        const firstError = validation.error.issues[0]
        showError("Validation Error", `${firstError.path[0]}: ${firstError.message}`)
        setLoading(false)
        return
      }

      const validatedData = validation.data

      const submitData = {
        name: validatedData.name,
        description: validatedData.description || '',
        shortDescription: validatedData.shortDescription || '',
        categoryId: validatedData.categoryId,
        price: typeof validatedData.price === 'string' ? parseFloat(validatedData.price) : validatedData.price,
        originalPrice: validatedData.originalPrice ? (typeof validatedData.originalPrice === 'string' ? parseFloat(validatedData.originalPrice) : validatedData.originalPrice) : null,
        brand: validatedData.brand || '',
        material: validatedData.material || '',
        sizeOptions: validatedData.sizeOptions && validatedData.sizeOptions.trim() !== '' ? (
          validatedData.sizeOptions.startsWith('[') || validatedData.sizeOptions.startsWith('{') 
            ? JSON.parse(validatedData.sizeOptions) 
            : validatedData.sizeOptions
        ) : null,
        colorOptions: validatedData.colorOptions && validatedData.colorOptions.trim() !== '' ? (
          validatedData.colorOptions.startsWith('[') || validatedData.colorOptions.startsWith('{')
            ? JSON.parse(validatedData.colorOptions)
            : validatedData.colorOptions
        ) : null,
        availability: validatedData.availability || 'In Stock',
        stockQuantity: typeof validatedData.stockQuantity === 'string' ? parseInt(validatedData.stockQuantity) : validatedData.stockQuantity,
        weight: validatedData.weight,
        careInstructions: validatedData.careInstructions || '',
        isFeatured: validatedData.isFeatured || false,
        isBestseller: validatedData.isBestseller || false,
        isNewArrival: validatedData.isNewArrival || false,
        isActive: validatedData.isActive !== false,
        metaTitle: validatedData.metaTitle || '',
        metaDescription: validatedData.metaDescription || '',
        metaKeywords: validatedData.metaKeywords || '',
        images: validatedData.images || [],
        variants: variants || []
      }

      const editingProduct = productData
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'

      // Debug: Log images being submitted
      console.log('📸 Images being submitted:', submitData.images.map((img, i) => ({
        index: i,
        isPrimary: img.isPrimary,
        url: img.url.substring(0, 50)
      })));
      
      // Verify only one primary image
      const primaryCount = submitData.images.filter(img => img.isPrimary === true).length;
      console.log('✅ Number of primary images:', primaryCount);
      
      if (primaryCount > 1) {
        console.warn('⚠️ WARNING: Multiple primary images detected! Fixing...');
        // Find the first primary image and unset others
        let foundPrimary = false;
        submitData.images = submitData.images.map(img => {
          if (img.isPrimary === true && !foundPrimary) {
            foundPrimary = true;
            return img;
          }
          return { ...img, isPrimary: false };
        });
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (result.success) {
        showSuccess(
          editingProduct ? "Product Updated" : "Product Created",
          editingProduct ? "Product has been updated successfully" : "Product has been created successfully"
        )
        router.push('/admin/products')
      } else {
        showError("Error", result.error)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      showError("Error", error.message || "Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price in rupees"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="Enter original price in rupees"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Limited Stock">Limited Stock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.01"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Product Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Care Instructions
            </label>
            <textarea
              name="careInstructions"
              value={formData.careInstructions}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-text"
            />
          </div>
        </div>
        
        {/* Size Options */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Sizes
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
              placeholder="Enter size (e.g., S, M, L, XL, 38, 40)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-text"
            />
            <button
              type="button"
              onClick={addSize}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium transition-colors cursor-pointer"
            >
              Add Size
            </button>
          </div>
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <div
                  key={size}
                  className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-800">{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {sizes.length === 0 && (
            <p className="text-sm text-gray-500 italic">No sizes added yet. Add sizes for customers to choose from.</p>
          )}
        </div>
        
        {/* Color Options */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Colors
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
              placeholder="Enter color (e.g., Red, Blue, Black, White)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-text"
            />
            <button
              type="button"
              onClick={addColor}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium transition-colors cursor-pointer"
            >
              Add Color
            </button>
          </div>
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-800">{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {colors.length === 0 && (
            <p className="text-sm text-gray-500 italic">No colors added yet. Add colors for customers to choose from.</p>
          )}
        </div>
        
        {/* Variant Inventory Manager */}
        {(sizes.length > 0 || colors.length > 0) && (
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Inventory Management</h4>
            <VariantManager 
              sizes={sizes}
              colors={colors}
              variants={variants}
              onVariantsChange={setVariants}
            />
          </div>
        )}
        
        <div className="mt-6">
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Product</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isBestseller"
                checked={formData.isBestseller}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">Bestseller</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">New Arrival</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
        <MultiImageUpload
          images={formData.images}
          onImagesChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
          type="products"
          maxImages={5}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer"
        >
          {loading ? 'Saving...' : (productData ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
