'use client';
import { FaLock, FaTruckFast, FaShield, FaRotateLeft } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const TrustBadges = () => {
  const badges = [
    {
      icon: <FaLock size={28} />,
      title: 'Secure Payment',
      desc: 'Your payments are safe with 128-bit encryption.',
    },
    {
      icon: <FaTruckFast size={28} />,
      title: 'Fast Delivery',
      desc: 'Get your orders delivered quickly & reliably.',
    },
    {
      icon: <FaShield size={28} />,
      title: '100% Authentic',
      desc: 'We guarantee genuine and high-quality products.',
    },
    {
      icon: <FaRotateLeft size={28} />,
      title: 'Easy Returns',
      desc: 'Hassle-free 7 days return & exchange policy.',
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
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Our Promise
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
            Shop With Confidence
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Your satisfaction is our priority with secure payments and hassle-free shopping
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
            <div className="h-1 w-2 bg-amber-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
          </div>
        </motion.div>

        {/* Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            <div className="text-yellow-500 mb-4">{badge.icon}</div>
            <h3 className="text-lg font-bold text-gray-900">{badge.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{badge.desc}</p>
          </motion.div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
