'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Lobster } from 'next/font/google';
import { motion } from 'framer-motion';

// Load Lobster font (only for this component)
const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
});

const ViewAllCollection = () => {
  const categories = [
    { name: 'Sarees', image: '/images/carousel/pic_1.jpg', slug: 'sarees' },
    { name: 'Lehenga Choli', image: '/images/carousel/pic_2.jpg', slug: 'lehenga-choli' },
    { name: 'Gowns', image: '/images/carousel/pic_3.jpg', slug: 'gowns' },
    { name: 'Half Saree', image: '/images/carousel/pic_4.jpg', slug: 'half-saree' },
    { name: 'Shorts', image: '/images/carousel/pic_5.jpg', slug: 'shorts' },
    { name: 'Dress', image: '/images/carousel/pic_6.jpg', slug: 'dress' },
    { name: 'One piece', image: '/images/carousel/pic_7.jpg', slug: 'one-piece' },
    { name: 'Jump Suit', image: '/images/carousel/pic_8.jpg', slug: 'jump-suit' },
  ];

  return (
    <section className="py-6 sm:py-8 md:py-10 lg:py-12 px-6 sm:px-8 md:px-10 lg:px-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-12 relative"
      >
        View All Collections
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-6px] sm:bottom-[-8px] md:bottom-[-10px] lg:bottom-[-12px] w-12 sm:w-14 md:w-16 lg:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"></span>
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 md:gap-12 lg:gap-16 max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className="relative group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link href={`/collections/${category.slug}`} className="block group">
              {/* Card */}
              <div className="relative w-full h-[16rem] sm:h-[20rem] md:h-[24rem] lg:h-[28rem] rounded-2xl overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.1)] sm:shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-shadow duration-300 cursor-pointer">
                <Image
                  src={category.image}
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
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ViewAllCollection;
