"use client";
import { useEffect, useRef, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/contexts/AlertContext";

// Define Zod schema for form validation
const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(1, "Password is required"),
});

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const modalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Redux auth state and actions
  const { 
    loginWithCredentials, 
    loginWithGoogle, 
    error, 
    loading, 
    clearError,
    user,
    isAuthenticated
  } = useAuth();

  // Alert system
  const { showSuccess, showError } = useAlert();

  // Monitor auth state changes for alerts
  useEffect(() => {
    if (isAuthenticated && user && isOpen) {
      console.log('User authenticated, showing success alert');
      showSuccess("Login Successful!", "Welcome to Paregrose!");
      onClose();
    }
  }, [isAuthenticated, user, isOpen, showSuccess, onClose]);

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

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

  // Clear error when modal opens
  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      const result = await loginWithCredentials(data);
      
      // The useEffect will handle showing the success alert when auth state changes
      // Just handle errors here
      if (result.type && result.type.includes('rejected')) {
        const errorMessage = result.payload === 'CredentialsSignin' 
          ? 'Invalid email or password. Please check your credentials and try again.'
          : result.payload || 'Please check your credentials and try again.';
        showError("Login Failed", errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      showError("Login Failed", "Please check your credentials and try again.");
    }
  };

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google login...');
      const result = await loginWithGoogle();
      console.log('Google login result:', result);
      
      // Handle errors
      if (result.type && result.type.includes('rejected')) {
        console.error('Google login rejected:', result.payload);
        showError("Google Login Failed", result.payload || "Unable to sign in with Google. Please try again.");
      }
      // Success will be handled by the useEffect if auth state updates
    } catch (error) {
      console.error('Google login error:', error);
      showError("Google Login Failed", "Unable to sign in with Google. Please try again.");
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
              className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-900 transition cursor-pointer">
              <X size={22} />
            </button>

            {/* Title */}
            <h2 className="text-3xl font-bold text-center text-neutral-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-neutral-500 text-center mb-8">
              Please enter your details to continue
            </p>

             {/* Error Message */}
             {error && (
               <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                 <p className="text-sm text-red-600 text-center">
                   {typeof error === 'string' 
                     ? (error === 'CredentialsSignin' 
                        ? 'Invalid email or password. Please check your credentials and try again.'
                        : error)
                     : 'An error occurred during authentication'}
                 </p>
               </div>
             )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                  className={`w-full border ${
                    errors.email ? "border-red-500" : "border-neutral-300"
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-600`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
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
                  className={`w-full border ${
                    errors.password ? "border-red-500" : "border-neutral-300"
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 top-6 flex items-center text-neutral-500 hover:text-neutral-800 cursor-pointer">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`bg-yellow-600 text-white py-3 rounded-lg font-medium text-base shadow-md hover:bg-yellow-700 hover:shadow-lg transition ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}>
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Test Alert Button */}
              <button
                type="button"
                onClick={() => showSuccess("Test Alert", "This is a test alert to verify the system is working!")}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition cursor-pointer">
                Test Alert
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
              disabled={loading}
              className={`flex items-center justify-center gap-3 border border-neutral-300 py-3 w-full rounded-lg hover:bg-neutral-50 transition ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={handleGoogleSignIn}>
              <Image
                src="/images/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
              />
              <span className="text-sm font-medium text-neutral-700">
                {loading ? "Signing in..." : "Continue with Google"}
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
