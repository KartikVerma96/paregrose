"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";

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
  const [errorMessage, setErrorMessage] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  // Form submission handler
  const onSubmit = async (data) => {
    console.log("Form submission started:", data);
    try {
      setErrorMessage(null);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });

      console.log("Register API response:", { status: response.status, ok: response.ok });
      const result = await response.json();
      console.log("Register API result:", result);

      if (!response.ok) {
        setErrorMessage(result.message || "Registration failed");
        console.log("Registration failed with message:", result.message || "Unknown error");
        return;
      }

      console.log("Attempting credentials sign-in");
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      console.log("Credentials sign-in result:", signInResult);
      if (signInResult?.error) {
        setErrorMessage(signInResult.error || "Failed to sign in after registration");
        console.log("Sign-in failed with error:", signInResult.error);
        return;
      }

      console.log("Form registration successful");
      reset();
      setErrorMessage(null);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || "Unexpected error during registration");
      console.log("Unexpected error during form registration:", error.message);
    }
  };

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    console.log("Google sign-in button clicked");
    try {
      setErrorMessage(null);
      setIsGoogleLoading(true);

      const result = await signIn("google", { redirect: false });
      console.log("Google sign-in result:", result);
      setIsGoogleLoading(false);

      if (result?.error === "EmailAlreadyRegistered") {
        setErrorMessage("This email is already registered, try logging in.");
        console.log("Google sign-in failed: Email already registered");
        return;
      }

      if (result?.error) {
        setErrorMessage(result.error || "Google sign-in failed");
        console.log("Google sign-in failed with error:", result.error);
        return;
      }

      // Only check session if no error
      const sessionResponse = await fetch("/api/auth/session", {
        headers: { Accept: "application/json" },
      });
      if (!sessionResponse.ok) {
        setErrorMessage("Failed to verify session. Please try again.");
        console.log("Session fetch failed:", sessionResponse.status);
        return;
      }
      const session = await sessionResponse.json();
      console.log("Session after Google sign-in:", session);

      if (session?.user?.email) {
        console.log("Google registration successful");
        setErrorMessage(null);
        onClose();
      } else {
        setErrorMessage("Google registration failed: No user session found");
        console.log("Google registration error: No user session found");
      }
    } catch (error) {
      setIsGoogleLoading(false);
      setErrorMessage(error.message || "Unexpected error during Google sign-in");
      console.log("Unexpected error during Google sign-in:", error.message);
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
              className="absolute top-3 right-3 text-neutral-600 hover:text-neutral-900 transition"
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
            {errorMessage && (
              <p className="text-xs text-red-500 text-center mb-4">{errorMessage}</p>
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
                disabled={isSubmitting}
                className={`bg-yellow-600 text-white py-2.5 rounded-md font-medium text-sm shadow hover:bg-yellow-700 hover:shadow-md transition cursor-pointer ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Registering..." : "Register"}
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
              disabled={isGoogleLoading}
              className={`flex items-center justify-center gap-2 border border-neutral-300 py-2.5 w-full rounded-md hover:bg-neutral-50 transition cursor-pointer ${
                isGoogleLoading ? "opacity-50 cursor-not-allowed" : ""
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
                {isGoogleLoading ? "Registering..." : "Sign up with Google"}
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