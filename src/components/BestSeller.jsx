'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import ProductCard to avoid SSR issues
const ProductCard = dynamic(() => import('./ProductCard'), {
  ssr: false,
  loading: () => (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden 
                    shadow-[0_8px_32px_rgba(0,0,0,0.08)] 
                    border border-white/20 animate-pulse">
      <div className="w-full h-80 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestsellers();
  }, []);

  const fetchBestsellers = async () => {
    try {
      console.log('🔍 Fetching bestsellers');
      const response = await fetch('/api/products/bestsellers');
      console.log('📡 Bestsellers response status:', response.status);
      const result = await response.json();
      console.log('📦 Bestsellers result:', result);
      
      if (result.success && result.data) {
        // Handle both array and paginated responses
        const productsData = result.data.products || result.data;
        console.log('✅ Bestsellers loaded:', productsData.length);
        
        // Transform data to match ProductCard expectations
        const transformedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
              image: product.images?.[0]?.image_url || product.images?.[0]?.imageUrl,
          rating: 4.5, // Default rating since we don't have reviews yet
          reviews: 0,
          originalPrice: product.original_price || product.originalPrice || product.price,
          discountedPrice: product.price,
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('❌ Error fetching bestsellers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if no bestseller products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-amber-50/50 via-white to-white">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 
                           rounded-full text-amber-700 text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-amber-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Trending Now
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
            Best Sellers Ever
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most loved products, handpicked by thousands of happy customers
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
            <div className="h-1 w-2 bg-amber-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
                <div className="w-full h-72 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100"></div>
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="h-3 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-5 bg-gray-300 rounded w-24"></div>
                    <div className="h-4 bg-green-100 rounded-full w-16"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;
