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
    <section className="w-full py-20 px-4">
      {/* Section Heading */}
      <motion.h2 initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }} className="text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-12 relative">
        Loved By Thousands
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-15px] w-20 h-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"></span>
      </motion.h2>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
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
    </section>
  );
};

export default SocialProof;
