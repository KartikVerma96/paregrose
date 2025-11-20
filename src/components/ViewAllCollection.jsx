'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Lobster } from 'next/font/google';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';

// Load Lobster font (only for this component)
const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
});

const ViewAllCollection = () => {
  const { categories, loading } = useCategories();

  // Default fallback images for categories without images
  const defaultImages = [
    '/images/carousel/pic_1.jpg',
    '/images/carousel/pic_2.jpg',
    '/images/carousel/pic_3.jpg',
    '/images/carousel/pic_4.jpg',
    '/images/carousel/pic_5.jpg',
    '/images/carousel/pic_6.jpg',
    '/images/carousel/pic_7.jpg',
    '/images/carousel/pic_8.jpg',
  ];

  return (
    <section className="py-16 sm:py-20 px-6 sm:px-8 md:px-10 lg:px-12 bg-gradient-to-b from-white via-amber-50/30 to-white">
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
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Explore Categories
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
            View All Collections
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our curated collections and find the perfect style for every occasion
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
            <div className="h-1 w-2 bg-amber-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
          </div>
        </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 md:gap-12 lg:gap-16">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full h-[16rem] sm:h-[20rem] md:h-[24rem] lg:h-[28rem] rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-300 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 left-0 w-full">
                <div className="h-8 bg-gray-200 rounded animate-pulse -translate-x-4 sm:-translate-x-6 md:-translate-x-8 lg:-translate-x-10 w-24"></div>
              </div>
            </motion.div>
          ))
        ) : categories.length > 0 ? (
          categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/shop/${category.slug}`} className="block group">
                {/* Card */}
                <div className="relative w-full h-[16rem] sm:h-[20rem] md:h-[24rem] lg:h-[28rem] rounded-2xl overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.1)] sm:shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-shadow duration-300 cursor-pointer">
                  <Image
                    src={category.image_url || defaultImages[index % defaultImages.length]}
                    alt={category.name}
                    fill
                    className="object-cover will-change-transform transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-[-2deg]"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  viewport={{ once: true }}
                  className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 left-0 w-full"
                >
                  <h3
                    className={`${lobster.className} 
                      text-3xl sm:text-4xl md:text-4xl lg:text-5xl 
                      text-[#ffa85c] drop-shadow-xl 
                      -translate-x-4 sm:-translate-x-6 md:-translate-x-8 lg:-translate-x-10
                      relative inline-block`}
                  >
                    {category.name}
                    {/* Underline on hover - only under text */}
                    <span className="absolute left-0 -bottom-2 w-0 h-1 bg-[#ffa85c] 
                                    group-hover:w-full transition-all duration-500 ease-out"></span>
                  </h3>
                  {category.children && category.children.length > 0 && (
                    <div className="mt-2 -translate-x-4 sm:-translate-x-6 md:-translate-x-8 lg:-translate-x-10">
                      <div className="flex flex-wrap gap-1">
                        {category.children.slice(0, 2).map((subcategory) => (
                          <span
                            key={subcategory.id}
                            className="text-xs sm:text-sm text-white/90 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm"
                          >
                            {subcategory.name}
                          </span>
                        ))}
                        {category.children.length > 2 && (
                          <span className="text-xs sm:text-sm text-white/90 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                            +{category.children.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          ))
        ) : (
          // No categories message
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories available</h3>
            <p className="text-gray-500">Categories will appear here once they are added by the admin.</p>
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export default ViewAllCollection;
