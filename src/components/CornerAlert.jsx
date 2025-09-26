"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CornerAlert = ({ message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (message) {
      console.log("CornerAlert rendered with message:", message);
      const timer = setTimeout(() => {
        console.log("CornerAlert auto-dismissing");
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-md text-xs font-medium shadow-sm max-w-xs z-[2000]"
        >
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CornerAlert;