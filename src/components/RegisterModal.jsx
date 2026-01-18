"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/contexts/AlertContext";

// Define Zod schema for form validation
const registerSchema = z
  .object({
    fullName: z
      .string()
      .nonempty("Full Name is required")
      .min(2, "Full Name must be at least 2 characters")
      .max(50, "Full Name cannot exceed 50 characters"),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must include one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const modalRef = useRef(null);
  
  // Redux auth state and actions
  const { 
    registerUser, 
    loginWithGoogle, 
    error, 
    loading, 
    clearError 
  } = useAuth();

  // Alert system
  const { showSuccess, showError } = useAlert();

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

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

  // Clear error when modal opens
  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      const result = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      
      if (result.type.endsWith('/fulfilled')) {
        showSuccess("Registration Successful!", "Welcome to Paregrose! You can now start shopping.");
        reset();
        onClose();
      } else if (result.type.endsWith('/rejected')) {
        showError("Registration Failed", result.payload || "Unable to create account. Please try again.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      showError("Registration Failed", "Unable to create account. Please try again.");
    }
  };

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.type.endsWith('/fulfilled')) {
        showSuccess("Registration Successful!", "Welcome to Paregrose! You can now start shopping.");
        onClose();
      } else if (result.type.endsWith('/rejected')) {
        showError("Google Registration Failed", result.payload || "Unable to register with Google. Please try again.");
      }
    } catch (error) {
      console.error('Google registration error:', error);
      showError("Google Registration Failed", "Unable to register with Google. Please try again.");
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
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-neutral-600 hover:text-neutral-900 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-neutral-900 mb-1">
              Create Account
            </h2>
            <p className="text-xs text-neutral-500 text-center mb-4">
              Please fill in the details to register
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col">
                <label
                  htmlFor="fullName"
                  className="text-xs font-medium text-neutral-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full border ${
                    errors.fullName ? "border-red-500" : "border-neutral-300"
                  } rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600`}
                  {...register("fullName", {
                    onChange: () => trigger("fullName"),
                  })}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-neutral-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full border ${
                    errors.email ? "border-red-500" : "border-neutral-300"
                  } rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600`}
                  {...register("email", {
                    onChange: () => trigger("email"),
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-neutral-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full border ${
                    errors.password ? "border-red-500" : "border-neutral-300"
                  } rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600`}
                  {...register("password", {
                    onChange: () => trigger("password"),
                  })}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-medium text-neutral-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className={`w-full border ${
                    errors.confirmPassword ? "border-red-500" : "border-neutral-300"
                  } rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600`}
                  {...register("confirmPassword", {
                    onChange: () => trigger("confirmPassword"),
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`bg-yellow-600 text-white py-2.5 rounded-md font-medium text-sm shadow hover:bg-yellow-700 hover:shadow-md transition ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {loading ? "Registering..." : "Register"}
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
              disabled={loading}
              className={`flex items-center justify-center gap-2 border border-neutral-300 py-2.5 w-full rounded-md hover:bg-neutral-50 transition ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={handleGoogleSignIn}
            >
              <Image
                src="/images/google-icon.svg"
                alt="Google"
                width={18}
                height={18}
              />
              <span className="text-xs font-medium text-neutral-700">
                {loading ? "Registering..." : "Sign up with Google"}
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
                className="text-yellow-600 font-semibold cursor-pointer hover:underline"
              >
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