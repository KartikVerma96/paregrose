"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const CornerAlert = ({ message, onClose, duration = 5000, type = 'success' }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (message) {
      console.log("CornerAlert rendered with message:", message);
      
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress > 0 ? newProgress : 0;
        });
      }, 50);

      const timer = setTimeout(() => {
        console.log("CornerAlert auto-dismissing");
        onClose();
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [message, duration, onClose]);

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
          progressBg: 'bg-gradient-to-r from-emerald-400 to-green-500',
          borderColor: 'border-emerald-200',
          shadowColor: 'shadow-emerald-500/20'
        };
      case 'error':
        return {
          iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
          progressBg: 'bg-gradient-to-r from-red-400 to-rose-500',
          borderColor: 'border-red-200',
          shadowColor: 'shadow-red-500/20'
        };
      case 'warning':
        return {
          iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
          progressBg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
          borderColor: 'border-amber-200',
          shadowColor: 'shadow-amber-500/20'
        };
      default:
        return {
          iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
          progressBg: 'bg-gradient-to-r from-emerald-400 to-green-500',
          borderColor: 'border-emerald-200',
          shadowColor: 'shadow-emerald-500/20'
        };
    }
  };

  const config = getConfig();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className={`fixed top-6 right-6 bg-white ${config.borderColor} border-l-4 rounded-lg shadow-2xl ${config.shadowColor} max-w-md z-[9999] overflow-hidden`}
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
            <motion.div
              className={`h-full ${config.progressBg}`}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>

          <div className="p-4 pt-5">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 15 }}
                className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.iconBg} text-white flex items-center justify-center shadow-lg`}
              >
                <FaCheckCircle size={20} />
              </motion.div>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex-1 text-sm text-gray-900 font-medium leading-relaxed"
              >
                {message}
              </motion.p>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 text-gray-400 hover:text-gray-600 transform hover:rotate-90"
                aria-label="Close notification"
              >
                <FaTimes size={14} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CornerAlert;