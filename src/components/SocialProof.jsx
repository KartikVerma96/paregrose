'use client';
import { FaUsers, FaCartShopping, FaStar } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const SocialProof = () => {
  const stats = [
    {
      icon: <FaUsers size={32} />,
      label: 'Happy Customers',
      value: 10000,
      suffix: '+',
    },
    {
      icon: <FaCartShopping size={32} />,
      label: 'Orders Delivered',
      value: 25000,
      suffix: '+',
    },
    {
      icon: <FaStar size={32} />,
      label: 'Average Rating',
      value: 4.8,
      suffix: '/5',
      decimals: 1,
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 px-4 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-6xl mx-auto">
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
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Our Community
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
            Loved By Thousands
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Join our growing family of satisfied customers who trust us for quality and service
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
            <div className="h-1 w-2 bg-amber-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-gradient-to-br hover:from-yellow-50 hover:to-pink-50 transition"
          >
            <div className="text-yellow-500 mb-4">{stat.icon}</div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              <CountUp
                end={stat.value}
                duration={3}
                decimals={stat.decimals || 0}
                suffix={stat.suffix}
                enableScrollSpy
                scrollSpyOnce
              />
            </h3>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </motion.div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
