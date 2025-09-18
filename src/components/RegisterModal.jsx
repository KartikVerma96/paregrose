"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={handleOverlayClick}
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-neutral-600 hover:text-neutral-900 transition">
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-neutral-900 mb-1">
              Create Account
            </h2>
            <p className="text-xs text-neutral-500 text-center mb-6">
              Please fill in the details to register
            </p>

            {/* Register Form */}
            <form className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col">
                <label htmlFor="fullName" className="text-xs font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-xs font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-xs font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label htmlFor="confirmPassword" className="text-xs font-medium text-neutral-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              <button
                type="submit"
                className="bg-yellow-600 text-white py-2.5 rounded-md font-medium text-sm shadow hover:bg-yellow-700 hover:shadow-md transition">
                Register
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-neutral-300"></div>
              <span className="text-xs text-neutral-500">or</span>
              <div className="flex-1 h-px bg-neutral-300"></div>
            </div>

            {/* Google Register */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-neutral-300 py-2.5 w-full rounded-md hover:bg-neutral-50 transition"
              onClick={() => alert("Google register integration goes here 🚀")}>
              <Image
                src="/images/google-icon.svg"
                alt="Google"
                width={18}
                height={18}
              />
              <span className="text-xs font-medium text-neutral-700">
                Sign up with Google
              </span>
            </button>

            {/* Footer */}
            <div className="text-xs text-neutral-600 text-center mt-5">
              Already have an account?{" "}
              <span
                onClick={() => {
                  onClose();
                  if (onSwitchToLogin) onSwitchToLogin();
                }}
                className="text-yellow-600 font-semibold cursor-pointer hover:underline">
                Login
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
