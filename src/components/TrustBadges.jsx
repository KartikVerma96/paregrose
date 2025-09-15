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
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
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
    </section>
  );
};

export default TrustBadges;
