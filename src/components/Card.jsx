'use client';
import { motion } from 'framer-motion';

const Card = ({ name, email, city, image, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden 
                 shadow-[0_8px_32px_rgba(0,0,0,0.08)] 
                 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                 transition-all duration-500 ease-out
                 border border-white/20
                 hover:-translate-y-2"
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent 
                      backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Card Content */}
      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-amber-600 
                           transition-colors duration-300 mb-1">
              {name || title || 'Card Title'}
            </h3>
            {email && (
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                {email}
              </p>
            )}
          </div>
          
          {/* Status Badge */}
          <div className="px-3 py-1 rounded-full text-xs font-semibold
                          bg-gradient-to-r from-green-100 to-emerald-100 
                          text-green-600 border border-green-200/50">
            Active
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 group-hover:text-gray-700 transition-colors">
            {description}
          </p>
        )}

        {/* Location */}
        {city && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full"></div>
            <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
              {city}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 px-4 rounded-2xl text-sm font-bold 
                            bg-gradient-to-r from-amber-500 to-yellow-600 text-white 
                            hover:from-amber-600 hover:to-yellow-700 
                            transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98]
                            shadow-lg hover:shadow-xl cursor-pointer">
            View Details
          </button>
          <button className="p-2.5 rounded-2xl backdrop-blur-md border border-white/30
                            bg-white/70 text-gray-700 hover:bg-amber-500 hover:text-white 
                            transition-all duration-300 ease-out hover:scale-110 shadow-lg cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 
                      rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 
                      rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
    </motion.div>
  );
};

export default Card;
