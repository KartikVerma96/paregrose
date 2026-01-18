"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Search, Tag, X, RotateCcw, Filter } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { useCartDBRedux } from "@/hooks/useCartDBRedux";

// Separate component for each product to avoid hooks in loops
const ProductItem = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCart, isInCart, loading } = useCartDBRedux();
  
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const imageUrl = product.images?.[0]?.image_url || product.images?.[0]?.imageUrl;
  const productPrice = parseFloat(product.price);
  const originalPrice = parseFloat(product.original_price || product.originalPrice || 0);
  const hasDiscount = originalPrice > productPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - productPrice) / originalPrice) * 100) : 0;
  
  // Parse size and color options with error handling
  const parseSizeOptions = () => {
    if (!product.size_options) return [];
    try {
      const parsed = typeof product.size_options === 'string' 
        ? JSON.parse(product.size_options) 
        : product.size_options;
      console.log(`📏 Size options for "${product.name}":`, parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`❌ Failed to parse size_options for "${product.name}":`, product.size_options, error);
      return [];
    }
  };
  
  const parseColorOptions = () => {
    if (!product.color_options) return [];
    try {
      const parsed = typeof product.color_options === 'string' 
        ? JSON.parse(product.color_options) 
        : product.color_options;
      console.log(`🎨 Color options for "${product.name}":`, parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`❌ Failed to parse color_options for "${product.name}":`, product.color_options, error);
      return [];
    }
  };
  
  const sizeOptions = parseSizeOptions();
  const colorOptions = parseColorOptions();
  
  // Debug: Show product data
  console.log(`🔍 Product "${product.name}" data:`, {
    size_options: product.size_options,
    color_options: product.color_options,
    parsedSizes: sizeOptions,
    parsedColors: colorOptions
  });
  
  // Set default selections
  useEffect(() => {
    if (sizeOptions.length > 0 && !selectedSize) {
      console.log(`✅ Auto-selecting first size for "${product.name}":`, sizeOptions[0]);
      setSelectedSize(sizeOptions[0]);
    }
    if (colorOptions.length > 0 && !selectedColor) {
      console.log(`✅ Auto-selecting first color for "${product.name}":`, colorOptions[0]);
      setSelectedColor(colorOptions[0]);
    }
  }, [sizeOptions, colorOptions, selectedSize, selectedColor, product.name]);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🛒 Adding to cart - Product: "${product.name}", Size: ${selectedSize}, Color: ${selectedColor}`);
    
    // Pass product, quantity, selectedSize, selectedColor as separate parameters
    addToCart(
      product, 
      1, 
      sizeOptions.length > 0 ? selectedSize : null,
      colorOptions.length > 0 ? selectedColor : null
    );
  };
  
  // Get availability info
  const getAvailabilityInfo = () => {
    switch(product.availability) {
      case 'In_Stock':
      case 'In Stock':
        return { text: 'In Stock', color: 'green', dotColor: 'bg-green-500' };
      case 'Limited_Stock':
      case 'Limited Stock':
        return { text: 'Limited', color: 'orange', dotColor: 'bg-orange-500' };
      case 'Out_of_Stock':
      case 'Out of Stock':
        return { text: 'Out of Stock', color: 'red', dotColor: 'bg-red-500' };
      default:
        return { text: 'In Stock', color: 'green', dotColor: 'bg-green-500' };
    }
  };
  
  const availability = getAvailabilityInfo();

  return (
    <div className="group relative">
      <Link href={`/product/${product.id}`} className="block">
        {/* Main Card */}
        <div className="relative bg-white rounded-2xl overflow-hidden 
                        shadow-[0_2px_20px_rgba(0,0,0,0.08)] 
                        hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)]
                        transition-shadow duration-300
                        border border-gray-100">
          
          {/* Image Container with Overlay */}
          <div className="relative w-full h-72 overflow-hidden bg-gray-100">
            {/* Product Image */}
            {imageUrl ? (
                <Image
              src={imageUrl}
                  alt={product.name}
                  fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
                />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">No Image</p>
                </div>
              </div>
            )}
                
                {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 
                            opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            {/* Badges - Indian Aesthetic */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
              {hasDiscount && (
                <div className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 
                                text-xs font-bold shadow-2xl transform -rotate-2 
                                border-2 border-yellow-300 animate-pulse">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span className="relative z-10">🔥 {discountPercent}% OFF</span>
                </div>
              )}
              {product.is_new_arrival && (
                <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 
                                text-xs font-bold shadow-2xl transform rotate-1
                                border-2 border-green-300">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-300 rounded-full"></div>
                  <span className="relative z-10">🪷 NEW</span>
                </div>
              )}
              {product.is_featured && (
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 
                                text-xs font-bold shadow-2xl transform -rotate-1
                                border-2 border-purple-300">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-300 rounded-full"></div>
                  <span className="relative z-10">👑 FEATURED</span>
                </div>
              )}
            </div>
            
            {/* Wishlist Heart - Elegant */}
                <button
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-xl 
                          transition-all duration-300 z-20 
                          shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer ${
                    isInWishlist(product.id) 
                  ? "bg-white/95 text-red-500" 
                  : "bg-white/70 text-gray-600 hover:bg-white/95 hover:text-red-500"
                  }`}
                  onClick={(e) => {
                e.preventDefault();
                    toggleWishlist(product);
                  }}>
                  <Heart 
                size={18} 
                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                strokeWidth={2}
                className="transition-transform duration-300"
                  />
                </button>
                
                </div>
                
          {/* Content - Compact */}
          <div className="p-4 space-y-2">
            {/* Category Tag */}
            {product.category && (
              <span className="inline-block text-[9px] font-semibold text-amber-600 
                             bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            
            {/* Product Name */}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[36px]
                           group-hover:text-amber-600 transition-colors duration-300">
                  {product.name}
                </h3>
                
            {/* Price Layout */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-gray-900">
                  ₹{productPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              
              {/* Stock Badge */}
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                availability.color === 'green' ? 'bg-green-50' : 
                availability.color === 'orange' ? 'bg-orange-50' : 'bg-red-50'
              }`}>
                <div className={`w-1 h-1 rounded-full ${availability.dotColor}`}></div>
                <span className={`text-[9px] font-semibold uppercase tracking-wide ${
                  availability.color === 'green' ? 'text-green-700' : 
                  availability.color === 'orange' ? 'text-orange-700' : 'text-red-700'
                }`}>
                  {availability.text}
                  </span>
              </div>
                </div>
                
            {/* Size and Color Options */}
            {(sizeOptions.length > 0 || colorOptions.length > 0) && (
              <div className="pt-2 space-y-2 border-t border-gray-100">
                {/* Size Options */}
                {sizeOptions.length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-600 font-medium mb-1.5">Size:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sizeOptions.slice(0, 4).map((size) => (
                <button
                          key={size}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedSize(size);
                          }}
                          className={`px-2.5 py-1 text-[10px] font-semibold rounded border transition-all cursor-pointer ${
                            selectedSize === size
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                      {sizeOptions.length > 4 && (
                        <span className="px-2.5 py-1 text-[10px] text-gray-500">+{sizeOptions.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Color Options */}
                {colorOptions.length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-600 font-medium mb-1.5">Color:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {colorOptions.slice(0, 5).map((color) => (
                        <button
                          key={color}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                            setSelectedColor(color);
                          }}
                          className={`px-2.5 py-1 text-[10px] font-semibold rounded border transition-all cursor-pointer ${
                            selectedColor === color
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                      {colorOptions.length > 5 && (
                        <span className="px-2.5 py-1 text-[10px] text-gray-500">+{colorOptions.length - 5}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
                
            {/* Add to Cart Button */}
            <button
              className={`w-full mt-3 py-2.5 px-4 rounded-lg font-semibold text-sm
                          transition-all duration-200 cursor-pointer ${
                isInCart(product.id)
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : availability.color === 'red' 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg"
              }`}
              onClick={handleAddToCart}
              disabled={loading || availability.color === 'red'}
            >
              {loading ? "Adding..." : 
               availability.color === 'red' ? "Out of Stock" :
               isInCart(product.id) ? "✓ Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </Link>
    </div>
  );
};

const ShopPageClient = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [colorFilter, setColorFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Extract all unique sizes and colors from products
  const allSizes = [...new Set(products.flatMap(p => {
    try {
      return p.size_options ? JSON.parse(p.size_options) : [];
    } catch {
      return [];
    }
  }))].sort();
  
  const allColors = [...new Set(products.flatMap(p => {
    try {
      return p.color_options ? JSON.parse(p.color_options) : [];
    } catch {
      return [];
    }
  }))].sort();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('🔍 Fetching products from /api/products');
      const response = await fetch('/api/products?limit=100'); // Get more products for shop page
      console.log('📡 Response status:', response.status);
      const result = await response.json();
      console.log('📦 Products result:', result);
      
      if (result.success && result.data) {
        // Handle both paginated and non-paginated responses
        const productsData = result.data.products || result.data;
        console.log('✅ Products loaded:', productsData.length);
        setProducts(productsData);
      } else {
        console.error('❌ Failed to load products:', result.error);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filter === "All" || p.category?.name === filter || p.category?.slug === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    
    const matchesAvailability = availabilityFilter === "All" || p.availability === availabilityFilter || 
                                 p.availability?.replace('_', ' ') === availabilityFilter;
    
    let matchesSize = sizeFilter === "All";
    if (!matchesSize && p.size_options) {
      try {
        const sizes = JSON.parse(p.size_options);
        matchesSize = sizes.includes(sizeFilter);
      } catch {
        matchesSize = false;
      }
    }
    
    let matchesColor = colorFilter === "All";
    if (!matchesColor && p.color_options) {
      try {
        const colors = JSON.parse(p.color_options);
        matchesColor = colors.includes(colorFilter);
      } catch {
        matchesColor = false;
      }
    }
    
    return matchesCategory && matchesSearch && matchesAvailability && matchesSize && matchesColor;
  });

   return (
     <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white">
       <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
         {/* Hero Header */}
         <div className="text-center mb-12">
           <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
             Shop Our Collection
           </h1>
           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
             Discover premium ethnic wear curated just for you
           </p>
           <div className="mt-4 flex items-center justify-center gap-2">
             <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
             <div className="h-1 w-2 bg-amber-500 rounded-full"></div>
             <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
           </div>
         </div>

        {/* Search Bar - Top */}
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl shadow-lg border border-amber-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" strokeWidth={2.5} />
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-11 sm:pl-14 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white text-sm sm:text-base font-medium placeholder:text-gray-400"
                />
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" strokeWidth={2} />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hover:text-gray-700" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Clear Search Button */}
            {search && (
              <button
                onClick={() => setSearch('')}
                className="sm:self-end sm:w-auto w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer">
                <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-between shadow-lg hover:shadow-xl cursor-pointer">
            <span className="flex items-center gap-3">
              <Filter className="w-6 h-6" strokeWidth={2.5} />
              Filters {(filter !== "All" || availabilityFilter !== "All" || sizeFilter !== "All" || colorFilter !== "All") && (
                <span className="bg-white text-amber-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  Active
                </span>
              )}
            </span>
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className={`lg:w-96 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:sticky lg:top-8 animate-slideDown">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
                  Filters
                </span>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-gray-600" strokeWidth={2} />
                </button>
              </h2>
               
               <div className="space-y-6">
                 {/* Category Filter */}
                 <div>
                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                     <Tag className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                     Category
                   </label>
                   <select
                     value={filter}
                     onChange={(e) => setFilter(e.target.value)}
                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer">
                     <option value="All">All Categories</option>
                     {categories.map((category) => (
                       <option key={category.id} value={category.name}>
                         {category.name}
                       </option>
                     ))}
                   </select>
                 </div>
                 
                 {/* Availability Filter */}
                 <div>
                   <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                     <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     Availability
                   </label>
                   <select
                     value={availabilityFilter}
                     onChange={(e) => setAvailabilityFilter(e.target.value)}
                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer">
                     <option value="All">All Stock Status</option>
                     <option value="In_Stock">In Stock</option>
                     <option value="Limited_Stock">Limited Stock</option>
                     <option value="Out_of_Stock">Out of Stock</option>
                   </select>
                 </div>
                 
                 {/* Size Filter */}
                 {allSizes.length > 0 && (
                   <div>
                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                       <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                       </svg>
                       Size
                     </label>
                     <select
                       value={sizeFilter}
                       onChange={(e) => setSizeFilter(e.target.value)}
                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer">
                       <option value="All">All Sizes</option>
                       {allSizes.map((size) => (
                         <option key={size} value={size}>
                           {size}
                         </option>
                       ))}
                     </select>
                   </div>
                 )}
                 
                 {/* Color Filter */}
                 {allColors.length > 0 && (
                   <div>
                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                       <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                       </svg>
                       Color
                     </label>
                     <select
                       value={colorFilter}
                       onChange={(e) => setColorFilter(e.target.value)}
                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer">
                       <option value="All">All Colors</option>
                       {allColors.map((color) => (
                         <option key={color} value={color}>
                           {color}
                         </option>
                       ))}
                     </select>
                   </div>
                 )}
                 
                 {/* Clear All Filters Button */}
                 {(filter !== "All" || availabilityFilter !== "All" || sizeFilter !== "All" || colorFilter !== "All") && (
                   <div>
                     <button
                       onClick={() => {
                         setFilter('All');
                         setAvailabilityFilter('All');
                         setSizeFilter('All');
                         setColorFilter('All');
                       }}
                       className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer">
                       <X className="w-4 h-4" strokeWidth={2} />
                       Clear All Filters
                     </button>
                   </div>
                 )}
                 
                 {/* Apply Filters Button (Mobile Only) */}
                 <div className="lg:hidden pt-2">
                   <button
                     onClick={() => setIsFilterOpen(false)}
                     className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                     </svg>
                     Apply Filters
                   </button>
                 </div>
                 
                 {/* Results Count */}
                 {!loading && (
                   <div className="pt-4 border-t border-gray-100">
                     <p className="text-sm text-gray-600">
                       Showing <span className="font-bold text-amber-600">{filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products
                     </p>
                   </div>
                 )}
               </div>
             </div>
      </div>

           {/* Right Side - Products */}
           <div className="flex-1">

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-gray-100 animate-pulse">
                <div className="w-full h-72 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="h-5 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-green-100 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
         ) : (
           <div className="text-center py-20">
             <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 max-w-md mx-auto border border-gray-200">
               <div className="text-gray-400 mb-6">
                 <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                 </svg>
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
               <p className="text-gray-600 text-lg mb-6">
                 {search || filter !== "All" || availabilityFilter !== "All" || sizeFilter !== "All" || colorFilter !== "All"
                   ? "Try adjusting your search or filter criteria" 
                   : "Products will appear here once they are added by the admin"}
               </p>
               {(search || filter !== "All" || availabilityFilter !== "All" || sizeFilter !== "All" || colorFilter !== "All") && (
                 <button
                   onClick={() => {
                     setSearch('');
                     setFilter('All');
                     setAvailabilityFilter('All');
                     setSizeFilter('All');
                     setColorFilter('All');
                   }}
                   className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 cursor-pointer">
                   <RotateCcw className="w-5 h-5" strokeWidth={2} />
                   Clear Filters
                 </button>
               )}
             </div>
           </div>
         )}
           </div>
         </div>
       </div>
    </div>
  );
};

export default ShopPageClient;
