'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
<Link
  key={product.id}
  href={`/product/${product.id}`}
  className="group border border-gray-200 bg-gradient-to-br from-white/95 via-gray-50/90 to-white/80 
             backdrop-blur-md rounded-2xl overflow-hidden shadow-md 
             hover:shadow-xl transition-shadow duration-300"
>
  {/* Image */}
  <div className="relative w-full h-80 overflow-hidden">
    <Image
      src={product.image}
      alt={product.name}
      layout="fill"
      objectFit="cover"
      className="transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
    />
<div className="absolute top-4 left-4 
                px-3 py-1 rounded-full 
                text-[10px] font-semibold tracking-wide uppercase 
                bg-white/40 backdrop-blur-sm 
                border border-amber-200/50 
                text-amber-700 shadow-sm">
  Exclusive
</div>

  </div>

  {/* Content */}
  <div className="p-6 bg-white/95">
    <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 
                   group-hover:text-amber-600 transition-colors">
      {product.name}
    </h3>

    <div className="mt-3 flex items-center space-x-2">
      <span className="text-lg font-bold text-amber-700">
        ₹{product.discountedPrice.toFixed(2)}
      </span>
      <span className="text-sm text-gray-400 line-through">
        ₹{product.originalPrice.toFixed(2)}
      </span>
      <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
        {((1 - product.discountedPrice / product.originalPrice) * 100).toFixed(0)}% OFF
      </span>
    </div>
  </div>
</Link>



        ))}
      </div>
    </section>
  );
};

export default BestSeller;
