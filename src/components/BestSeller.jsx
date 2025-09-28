'use client';
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
  
  const products = [
    {
      id: 1,
      name: 'Sukhmani Gambhir Party Wear Saree With Moti Work Border',
      image: '/images/carousel/pic_1.jpg',
      rating: 4.6,
      reviews: 18,
      originalPrice: 2799.0,
      discountedPrice: 1499.0,
    },
    {
      id: 2,
      name: 'Bollywood Star Suhana Khan Cream Colour Party Wear Saree',
      image: '/images/carousel/pic_2.jpg',
      rating: 4.0,
      reviews: 7,
      originalPrice: 2049.0,
      discountedPrice: 999.0,
    },
    {
      id: 3,
      name: 'Traditional Ready To Wear Red Colour Saree For Karwa Chauth',
      image: '/images/carousel/pic_3.jpg',
      rating: 4.3,
      reviews: 7,
      originalPrice: 2499.0,
      discountedPrice: 1499.0,
    },
    {
      id: 4,
      name: 'Ready To Wear Lehenga Saree For Girls',
      image: '/images/carousel/pic_4.jpg',
      rating: 5.0,
      reviews: 1,
      originalPrice: 1999.0,
      discountedPrice: 999.0,
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'text-yellow-500' : 'text-gray-400'}
          size={12}
        />
      );
    }
    return stars;
  };

  return (
    <section className="py-20 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-12 relative"
      >
        Best Seller, Ever.
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-15px] w-20 h-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"></span>
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
