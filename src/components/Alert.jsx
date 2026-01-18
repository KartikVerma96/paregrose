'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaTimes,
  FaInfoCircle 
} from 'react-icons/fa';

const Alert = ({ 
  type = 'success', 
  title, 
  message, 
  duration = 4000, 
  onClose,
  show = true 
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress > 0 ? newProgress : 0;
        });
      }, 50);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  };

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: FaCheckCircle,
          bgGradient: 'from-emerald-500 to-green-500',
          bgLight: 'bg-white',
          iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
          iconColor: 'text-white',
          titleColor: 'text-gray-900',
          messageColor: 'text-gray-600',
          progressBg: 'bg-gradient-to-r from-emerald-400 to-green-500',
          borderColor: 'border-emerald-200',
          shadowColor: 'shadow-emerald-500/20'
        };
      case 'warning':
        return {
          icon: FaExclamationTriangle,
          bgGradient: 'from-amber-500 to-yellow-500',
          bgLight: 'bg-white',
          iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
          iconColor: 'text-white',
          titleColor: 'text-gray-900',
          messageColor: 'text-gray-600',
          progressBg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
          borderColor: 'border-amber-200',
          shadowColor: 'shadow-amber-500/20'
        };
      case 'error':
        return {
          icon: FaTimesCircle,
          bgGradient: 'from-red-500 to-rose-500',
          bgLight: 'bg-white',
          iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
          iconColor: 'text-white',
          titleColor: 'text-gray-900',
          messageColor: 'text-gray-600',
          progressBg: 'bg-gradient-to-r from-red-400 to-rose-500',
          borderColor: 'border-red-200',
          shadowColor: 'shadow-red-500/20'
        };
      case 'info':
        return {
          icon: FaInfoCircle,
          bgGradient: 'from-blue-500 to-indigo-500',
          bgLight: 'bg-white',
          iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          iconColor: 'text-white',
          titleColor: 'text-gray-900',
          messageColor: 'text-gray-600',
          progressBg: 'bg-gradient-to-r from-blue-400 to-indigo-500',
          borderColor: 'border-blue-200',
          shadowColor: 'shadow-blue-500/20'
        };
      default:
        return {
          icon: FaCheckCircle,
          bgGradient: 'from-emerald-500 to-green-500',
          bgLight: 'bg-white',
          iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
          iconColor: 'text-white',
          titleColor: 'text-gray-900',
          messageColor: 'text-gray-600',
          progressBg: 'bg-gradient-to-r from-emerald-400 to-green-500',
          borderColor: 'border-emerald-200',
          shadowColor: 'shadow-emerald-500/20'
        };
    }
  };

  const config = getAlertConfig();
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            x: 400,
            scale: 0.8
          }}
          animate={{ 
            opacity: 1, 
            x: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0, 
            x: 400,
            scale: 0.8
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 25,
            duration: 0.4
          }}
          className={`
            relative max-w-md w-full
            ${config.bgLight} ${config.borderColor}
            border-l-4 rounded-lg shadow-2xl ${config.shadowColor}
            backdrop-blur-md overflow-hidden
          `}
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
            <motion.div
              className={`h-full ${config.progressBg}`}
              initial={{ width: '100%' }}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>

          <div className="p-4 pt-5">
            <div className="flex items-start gap-4">
              {/* Icon with animated background */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.1, 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 15 
                }}
                className={`
                  flex-shrink-0 w-10 h-10 rounded-xl
                  ${config.iconBg} ${config.iconColor}
                  flex items-center justify-center
                  shadow-lg transform transition-transform duration-200
                  hover:scale-110
                `}
              >
                <IconComponent size={20} />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                {title && (
                  <motion.h4
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className={`font-bold text-base ${config.titleColor} mb-1 leading-tight`}
                  >
                    {title}
                  </motion.h4>
                )}
                
                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-sm ${config.messageColor} leading-relaxed`}
                  >
                    {message}
                  </motion.p>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 300 }}
                onClick={handleClose}
                className={`
                  flex-shrink-0 p-1.5 rounded-lg
                  hover:bg-gray-100 active:bg-gray-200
                  transition-all duration-200
                  text-gray-400 hover:text-gray-600
                  transform hover:rotate-90
                `}
                aria-label="Close notification"
              >
                <FaTimes size={14} />
              </motion.button>
            </div>
          </div>

          {/* Decorative gradient overlay */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.bgGradient} opacity-5 rounded-full -mr-16 -mt-16 blur-2xl`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
