"use client";
import { useEffect, useRef, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const modalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Close when clicking outside modal
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close login modal"
              className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-900 transition">
              <X size={22} />
            </button>

            {/* Title */}
            <h2 className="text-3xl font-bold text-center text-neutral-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-neutral-500 text-center mb-8">
              Please enter your details to continue
            </p>

            {/* Login Form */}
            <form className="flex flex-col gap-5">
              {/* Email Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* Password Field with Toggle */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 top-6 flex items-center text-neutral-500 hover:text-neutral-800 cursor-pointer">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="bg-yellow-600 text-white py-3 rounded-lg font-medium text-base shadow-md hover:bg-yellow-700 hover:shadow-lg transition">
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-neutral-300"></div>
              <span className="text-sm text-neutral-500">or</span>
              <div className="flex-1 h-px bg-neutral-300"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-neutral-300 py-3 w-full rounded-lg hover:bg-neutral-50 transition"
              onClick={() => alert("Google login integration goes here 🚀")}>
              <Image
                src="/images/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
              />
              <span className="text-sm font-medium text-neutral-700">
                Continue with Google
              </span>
            </button>

            {/* Footer Links */}
            <div className="text-sm text-neutral-600 text-center mt-6">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  onClose(); // close login
                  if (onSwitchToRegister) onSwitchToRegister(); // open register
                }}
                className="text-yellow-600 font-semibold cursor-pointer hover:underline">
                Register
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
