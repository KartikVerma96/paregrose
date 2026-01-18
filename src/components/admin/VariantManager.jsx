'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Package, AlertCircle } from 'lucide-react'

const VariantManager = ({ sizes, colors, variants, onVariantsChange }) => {
  const [localVariants, setLocalVariants] = useState([])
  const [expandedVariant, setExpandedVariant] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load existing variants when component mounts (for edit mode)
  useEffect(() => {
    if (variants && variants.length > 0 && !isInitialized) {
      console.log('📦 [VariantManager] Loading existing variants:', variants);
      setLocalVariants(variants);
      setIsInitialized(true);
    }
  }, [variants, isInitialized]);

  // Generate variants when sizes or colors change
  useEffect(() => {
    if (sizes.length === 0 && colors.length === 0) {
      console.log('⚠️ [VariantManager] No sizes or colors, clearing variants');
      setLocalVariants([])
      onVariantsChange([])
      return
    }

    // Build map of existing variants
    const existingVariantsMap = new Map(
      localVariants.map(v => [`${v.size || ''}-${v.color || ''}`, v])
    )

    console.log('🗺️ [VariantManager] Existing variants map:', Array.from(existingVariantsMap.keys()));

    const newVariants = []

    if (sizes.length > 0 && colors.length > 0) {
      // Both sizes and colors - create all combinations
      sizes.forEach(size => {
        colors.forEach(color => {
          const key = `${size}-${color}`
          const existing = existingVariantsMap.get(key)
          newVariants.push(existing || {
            size,
            color,
            stock_quantity: 0,
            price_adjustment: 0,
            is_active: true
          })
        })
      })
    } else if (sizes.length > 0) {
      // Only sizes
      sizes.forEach(size => {
        const key = `${size}-`
        const existing = existingVariantsMap.get(key)
        newVariants.push(existing || {
          size,
          color: null,
          stock_quantity: 0,
          price_adjustment: 0,
          is_active: true
        })
      })
    } else if (colors.length > 0) {
      // Only colors
      colors.forEach(color => {
        const key = `-${color}`
        const existing = existingVariantsMap.get(key)
        newVariants.push(existing || {
          size: null,
          color,
          stock_quantity: 0,
          price_adjustment: 0,
          is_active: true
        })
      })
    }

    console.log('✨ [VariantManager] Generated variants:', newVariants);
    setLocalVariants(newVariants)
    onVariantsChange(newVariants)
  }, [sizes, colors])

  const updateVariant = (index, field, value) => {
    console.log(`✏️ [VariantManager] Updating variant ${index}:`, { field, value });
    const updated = [...localVariants]
    updated[index] = { ...updated[index], [field]: value }
    console.log(`✅ [VariantManager] Updated variant:`, updated[index]);
    setLocalVariants(updated)
    onVariantsChange(updated)
  }

  const getTotalStock = () => {
    return localVariants.reduce((sum, v) => sum + (parseInt(v.stock_quantity) || 0), 0)
  }

  const getInStockCount = () => {
    return localVariants.filter(v => (parseInt(v.stock_quantity) || 0) > 0).length
  }

  if (localVariants.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-amber-900 mb-1">No Variants to Manage</h4>
          <p className="text-sm text-amber-700">
            Add sizes or colors above to automatically generate inventory variants. Each size/color combination will have its own stock quantity.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-lg shadow-sm">
              <Package className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Inventory Variants</h4>
              <p className="text-xs text-gray-600">Manage stock for each size/color combination</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{getTotalStock()}</div>
            <div className="text-xs text-gray-600 font-medium">{getInStockCount()} / {localVariants.length} in stock</div>
          </div>
        </div>
      </div>

      {/* Matrix View - Size x Color */}
      {sizes.length > 0 && colors.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6'
          }}>
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-gray-100">
                    Size / Color
                  </th>
                  {colors.map((color) => (
                    <th key={color} className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      <div className="flex flex-col items-center gap-1">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                          {color}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sizes.map((size) => (
                  <tr key={size} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-200 bg-amber-50">
                      <span className="inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-800 text-sm font-bold rounded-lg">
                        {size}
                      </span>
                    </td>
                    {colors.map((color) => {
                      const variantIndex = localVariants.findIndex(
                        v => v.size === size && v.color === color
                      )
                      const variant = localVariants[variantIndex]
                      const stock = parseInt(variant?.stock_quantity) || 0
                      
                      return (
                        <td key={`${size}-${color}`} className="px-3 py-3 border-r border-gray-200">
                          <div className="space-y-2">
                            {/* Stock Input */}
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) => updateVariant(variantIndex, 'stock_quantity', parseInt(e.target.value) || 0)}
                                className={`w-full px-2 py-1.5 text-sm font-bold text-center border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text ${
                                  stock === 0 
                                    ? 'border-red-300 bg-red-50 text-red-700' 
                                    : stock < 10
                                    ? 'border-orange-300 bg-orange-50 text-orange-700'
                                    : 'border-green-300 bg-green-50 text-green-700'
                                }`}
                                placeholder="0"
                              />
                              <div className="text-[10px] text-center text-gray-500 mt-0.5">
                                {stock === 0 ? 'Out' : stock < 10 ? 'Low' : 'Stock'}
                              </div>
                            </div>
                            
                            {/* Price Adjustment & Active Toggle */}
                            <div className="flex items-center gap-1">
                              <div className="flex-1 flex items-center gap-1">
                                <span className="text-[10px] text-gray-500">₹</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={variant?.price_adjustment || 0}
                                  onChange={(e) => updateVariant(variantIndex, 'price_adjustment', parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                  className="w-full px-1.5 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-text"
                                />
                              </div>
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={variant?.is_active !== false}
                                  onChange={(e) => updateVariant(variantIndex, 'is_active', e.target.checked)}
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                                  title="Active"
                                />
                              </label>
                            </div>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // List View - For size-only or color-only variants
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="col-span-2">{sizes.length > 0 ? 'Size' : 'Color'}</div>
              <div className="col-span-2">Stock Quantity</div>
              <div className="col-span-1">Price +/-</div>
              <div className="col-span-1 text-center">Active</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200 bg-white max-h-96 overflow-y-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6'
          }}>
            {localVariants.map((variant, index) => {
              const stock = parseInt(variant.stock_quantity) || 0
              return (
                <div
                  key={`${variant.size || 'no-size'}-${variant.color || 'no-color'}`}
                  className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                    stock === 0 ? 'bg-red-50/50' : ''
                  }`}
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Size or Color */}
                    <div className="col-span-2">
                      {variant.size ? (
                        <span className="inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-800 text-sm font-semibold rounded-lg">
                          {variant.size}
                        </span>
                      ) : variant.color ? (
                        <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
                          {variant.color}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>

                    {/* Stock Quantity */}
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => updateVariant(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 text-sm font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text ${
                          stock === 0 
                            ? 'border-red-300 bg-red-50 text-red-700' 
                            : stock < 10
                            ? 'border-orange-300 bg-orange-50 text-orange-700'
                            : 'border-green-300 bg-green-50 text-green-700'
                        }`}
                      />
                    </div>

                    {/* Price Adjustment */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 font-medium">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.price_adjustment || 0}
                          onChange={(e) => updateVariant(index, 'price_adjustment', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full px-2 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                        />
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="col-span-1 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={variant.is_active !== false}
                          onChange={(e) => updateVariant(index, 'is_active', e.target.checked)}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800">
            <strong>Tips:</strong> Set stock to 0 for out-of-stock variants. Price adjustment adds or subtracts from the base product price (e.g., +₹100 for XL sizes). Uncheck "Active" to temporarily disable a variant without deleting it.
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariantManager

