'use client';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartDBRedux } from '@/hooks/useCartDBRedux';
import { useAlert } from '@/contexts/AlertContext';

const ProductDetailClient = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addItem: addToCart, isInCart, loading } = useCartDBRedux();
  const { showSuccess, showError } = useAlert();
  
  // Transform database product to match expected structure
  const price = parseFloat(product.price);
  const originalPrice = parseFloat(product.original_price || product.price);
  const hasDiscount = originalPrice > price;
  const discountPercentage = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0;
  const images = product.images?.map(img => img.image_url) || [];
  const rating = 4.5; // Default rating (you can add reviews later)
  const reviews = 0; // Default reviews count
  
  // Parse size and color options
  const sizeOptions = product.size_options ? (
    typeof product.size_options === 'string' ? JSON.parse(product.size_options) : product.size_options
  ) : [];
  const colorOptions = product.color_options ? (
    typeof product.color_options === 'string' ? JSON.parse(product.color_options) : product.color_options
  ) : [];
  
  // Get variants for stock checking
  const variants = product.variants || [];
  
  // Get current variant based on selected size/color using useMemo to avoid recalculation
  const currentVariant = useMemo(() => {
    if (variants.length === 0) {
      console.log('⚠️ No variants found, using product stock_quantity');
      return null;
    }
    
    console.log('🔍 Searching for variant - Size:', selectedSize, 'Color:', selectedColor);
    console.log('📦 Available variants:', variants.map(v => ({ size: v.size, color: v.color, stock: v.stock_quantity })));
    
    const variant = variants.find(v => {
      const sizeMatch = v.size === selectedSize || (!v.size && !selectedSize);
      const colorMatch = v.color === selectedColor || (!v.color && !selectedColor);
      return sizeMatch && colorMatch;
    });
    
    console.log('✅ Found variant:', variant);
    return variant;
  }, [variants, selectedSize, selectedColor]);
  
  const variantStock = currentVariant ? parseInt(currentVariant.stock_quantity) || 0 : parseInt(product.stock_quantity) || 0;
  const variantPrice = currentVariant && currentVariant.price_adjustment 
    ? price + parseFloat(currentVariant.price_adjustment) 
    : price;
  
  console.log('📊 Current variant stock:', variantStock);
  
  // Check availability for each size/color
  const getVariantAvailability = (size = null, color = null) => {
    if (variants.length === 0) return { available: true, stock: parseInt(product.stock_quantity) || 0 };
    
    const variant = variants.find(v => 
      (v.size === size || (!v.size && !size)) && 
      (v.color === color || (!v.color && !color))
    );
    
    if (!variant) return { available: false, stock: 0 };
    const stock = parseInt(variant.stock_quantity) || 0;
    return { available: stock > 0 && variant.is_active, stock };
  };
  
  // Auto-select first available size and color
  useEffect(() => {
    if (sizeOptions.length > 0 && !selectedSize) {
      // Find first available size
      const availableSize = sizeOptions.find(size => {
        if (colorOptions.length > 0) {
          return colorOptions.some(color => getVariantAvailability(size, color).available);
        }
        return getVariantAvailability(size, null).available;
      });
      if (availableSize) setSelectedSize(availableSize);
    }
    if (colorOptions.length > 0 && !selectedColor) {
      // Find first available color for selected size
      const availableColor = colorOptions.find(color => {
        return getVariantAvailability(selectedSize || sizeOptions[0], color).available;
      });
      if (availableColor) setSelectedColor(availableColor);
    }
  }, [sizeOptions, colorOptions, selectedSize, selectedColor]);
  
  // Reset quantity when variant changes or if it exceeds available stock
  useEffect(() => {
    console.log('🔄 Variant changed - Size:', selectedSize, 'Color:', selectedColor, 'Stock:', variantStock);
    if (quantity > variantStock) {
      console.log('⚠️ Quantity exceeds stock, resetting to', Math.min(1, variantStock));
      setQuantity(Math.min(1, variantStock));
    }
  }, [selectedSize, selectedColor, variantStock]);
  
  const handleAddToCart = async () => {
    try {
      console.log(`🛒 Adding to cart - Size: ${selectedSize}, Color: ${selectedColor}`);
      await addToCart(
        product, 
        quantity,
        sizeOptions.length > 0 ? selectedSize : null,
        colorOptions.length > 0 ? selectedColor : null
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
          size={16}
        />
      );
    }
    return stars;
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-blue-50/30 py-8 px-4 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-4 lg:sticky lg:top-24 h-fit">
            {images.length > 0 ? (
              <>
                <motion.div
                  key={selectedImageIndex}
                  className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white border-4 border-white"
                  initial="hidden"
                  animate="visible"
                  variants={imageVariants}
                >
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm">
                        {discountPercentage}% OFF
                      </div>
                    </div>
                  )}
                  <Image
                    src={images[selectedImageIndex]}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                    priority={selectedImageIndex === 0}
                  />
                </motion.div>
                {images.length > 1 && (
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {images.map((image, index) => (
                      <motion.div
                        whileHover={{ scale: 1.08, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        key={index}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-3 ${
                          selectedImageIndex === index 
                            ? 'border-amber-500 ring-2 ring-amber-200 shadow-lg' 
                            : 'border-gray-200 hover:border-amber-300'
                        } transition-all duration-300 flex-shrink-0 cursor-pointer`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-amber-500/20"></div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ShoppingBag size={64} strokeWidth={1.5} className="mx-auto mb-4" />
                  <p className="font-medium">No images available</p>
                </div>
              </div>
            )}
          </div>

        {/* Product Details */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {renderStars(rating)}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {rating} ({reviews} reviews)
              </span>
              {product.brand && (
                <span className="ml-auto text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold text-amber-700">
                  ₹{variantPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-1.5 rounded-full shadow-md">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              {currentVariant && currentVariant.price_adjustment !== 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  Base price: ₹{price.toLocaleString('en-IN')} {currentVariant.price_adjustment > 0 ? '+' : ''} ₹{Math.abs(currentVariant.price_adjustment)} for this variant
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mt-4">
              <p className="text-gray-700 leading-relaxed text-base">
                {product.description}
              </p>
            </div>
          </div>

          {/* Variant Selection Card */}
          {(sizeOptions.length > 0 || colorOptions.length > 0) && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Variant</h2>
              
              {sizeOptions.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Choose Size
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {sizeOptions.map((size) => {
                      const availability = colorOptions.length > 0
                        ? getVariantAvailability(size, selectedColor)
                        : getVariantAvailability(size, null);
                      const isAvailable = availability.available;
                      const stock = availability.stock;
                      
                      return (
                        <motion.button
                          key={size}
                          whileHover={isAvailable ? { scale: 1.05 } : {}}
                          whileTap={isAvailable ? { scale: 0.95 } : {}}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={`relative min-w-[60px] px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                            !isAvailable
                              ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                              : selectedSize === size
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-2 border-amber-600 shadow-lg shadow-amber-200'
                              : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-amber-400 hover:shadow-md cursor-pointer'
                          }`}
                          title={!isAvailable ? 'Out of Stock' : `${stock} in stock`}
                        >
                          {size}
                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-gray-400 transform rotate-45"></div>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {colorOptions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Choose Color
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {colorOptions.map((color) => {
                      const availability = sizeOptions.length > 0
                        ? getVariantAvailability(selectedSize, color)
                        : getVariantAvailability(null, color);
                      const isAvailable = availability.available;
                      const stock = availability.stock;
                      
                      return (
                        <motion.button
                          key={color}
                          whileHover={isAvailable ? { scale: 1.05 } : {}}
                          whileTap={isAvailable ? { scale: 0.95 } : {}}
                          onClick={() => isAvailable && setSelectedColor(color)}
                          disabled={!isAvailable}
                          className={`relative min-w-[70px] px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                            !isAvailable
                              ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                              : selectedColor === color
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-2 border-blue-600 shadow-lg shadow-blue-200'
                              : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                          }`}
                          title={!isAvailable ? 'Out of Stock' : `${stock} in stock`}
                        >
                          {color}
                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-gray-400 transform rotate-45"></div>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stock & Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Availability</h2>
              {(selectedSize || selectedColor) && (
                <span className="text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1.5 rounded-full border border-purple-200">
                  {selectedSize && selectedColor ? `${selectedSize} / ${selectedColor}` :
                   selectedSize ? `Size: ${selectedSize}` : `Color: ${selectedColor}`}
                </span>
              )}
            </div>
            
            <div className={`flex items-center gap-3 p-4 rounded-xl ${
              variantStock === 0 ? 'bg-red-50 border border-red-200' : 
              variantStock < 10 ? 'bg-orange-50 border border-orange-200' : 
              'bg-green-50 border border-green-200'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                variantStock === 0 ? 'bg-red-500' : 
                variantStock < 10 ? 'bg-orange-500 animate-pulse' : 
                'bg-green-500'
              }`}></div>
              <p className={`font-bold text-sm ${
                variantStock === 0 ? 'text-red-700' : 
                variantStock < 10 ? 'text-orange-700' : 
                'text-green-700'
              }`}>
                {variantStock === 0 ? '❌ Out of Stock' : 
                 variantStock < 10 ? `⚠️ Only ${variantStock} left - Hurry!` : 
                 `✅ In Stock (${variantStock} available)`}
              </p>
            </div>

            {/* Product Info */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {product.material && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-1">Material</p>
                  <p className="text-sm font-semibold text-gray-900">{product.material}</p>
                </div>
              )}
              {product.category && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-1">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{product.category.name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="text-lg font-semibold text-gray-800">Quantity</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={variantStock === 0}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(variantStock, quantity + 1))}
                disabled={variantStock === 0 || quantity >= variantStock}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                +
              </button>
            </div>
            {variantStock > 0 && variantStock < 10 && (
              <span className="text-xs text-orange-600 font-medium">
                Only {variantStock} left!
              </span>
            )}
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={loading || variantStock === 0}
            className="w-full md:w-auto bg-amber-600 text-white py-4 px-8 rounded-lg font-semibold shadow-md hover:bg-amber-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {variantStock === 0 ? 'Out of Stock' :
             loading ? 'Adding...' : 
             isInCart(product.id) ? '✓ Added to Cart' : 
             'Add to Cart'}
          </button>
        </motion.div>
      </div>
      </div>
    </section>
  );
};

export default ProductDetailClient;
