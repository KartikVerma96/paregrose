'use client';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

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
          size={12} // Further reduced star size
        />
      );
    }
    return stars;
  };

  return (
    <section className="py-20 px-4">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-12 relative">
        Best Seller, Ever.
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-15px] w-20 h-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"></span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 bg-gradient-to-br from-white/95 via-gray-50/90 to-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)] transition-shadow duration-300">
            <div className="relative w-full h-80 aspect-[4/3]">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-102 image-rendering-[-webkit-optimize-contrast]"
                priority={product.id === 1}
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xxs font-bold px-2 py-0.5 rounded-full shadow-md">
                Exclusive
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white/90 text-amber-600 font-semibold py-1 px-2 text-xxs rounded-lg hover:bg-amber-100 transition-colors">
                  View Details
                </button>
              </div>
            </div>
            <div className="p-6 bg-white/95">
              <h3 className="text-xs md:text-sm font-serif font-semibold text-gray-800 line-clamp-2 hover:text-amber-600 transition-colors">
                {product.name}
              </h3>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-base font-bold text-amber-700">
                  ₹{product.discountedPrice.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
                <span className="text-xxs bg-amber-100 text-amber-700 font-medium px-1.5 py-0.5 rounded-full">
                  {((1 - product.discountedPrice / product.originalPrice) * 100).toFixed(0)}% OFF
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
