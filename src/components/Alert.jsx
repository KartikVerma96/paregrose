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

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
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
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700',
          shadowColor: 'shadow-amber-100'
        };
      case 'warning':
        return {
          icon: FaExclamationTriangle,
          bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700',
          shadowColor: 'shadow-amber-100'
        };
      case 'error':
        return {
          icon: FaTimesCircle,
          bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700',
          shadowColor: 'shadow-amber-100'
        };
      case 'info':
        return {
          icon: FaInfoCircle,
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700',
          shadowColor: 'shadow-amber-100'
        };
      default:
        return {
          icon: FaCheckCircle,
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700',
          shadowColor: 'shadow-amber-100'
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
            y: -50, 
            scale: 0.9,
            rotateX: -15
          }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotateX: 0
          }}
          exit={{ 
            opacity: 0, 
            y: -20, 
            scale: 0.95,
            rotateX: 15
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.3
          }}
          className={`
            relative max-w-sm w-full mx-4
            ${config.bgColor} ${config.borderColor} ${config.shadowColor}
            border rounded-xl shadow-lg backdrop-blur-sm
            transform transition-all duration-300 ease-out
          `}
        >
          
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.1, 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 20 
                }}
                className={`flex-shrink-0 ${config.iconColor}`}
              >
                <IconComponent size={20} />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {title && (
                  <motion.h4
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`font-semibold text-sm ${config.titleColor} mb-1`}
                  >
                    {title}
                  </motion.h4>
                )}
                
                {message && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-sm ${config.messageColor} leading-relaxed`}
                  >
                    {message}
                  </motion.p>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleClose}
                className={`
                  flex-shrink-0 p-1 rounded-full 
                  hover:bg-white/50 transition-colors duration-200
                  ${config.iconColor} hover:${config.iconColor.replace('text-', 'text-')}
                `}
              >
                <FaTimes size={12} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
