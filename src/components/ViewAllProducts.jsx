import Link from "next/link";
import React from "react";

const ViewAllProducts = () => {
  return (
    <div className="relative flex justify-center mt-12">
      {/* Smooth twinkling dots */}
      <span className="absolute -top-3 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-twinkle"></span>
      <span className="absolute -bottom-3 right-1/3 w-3 h-3 bg-yellow-500 rounded-full animate-twinkle-delayed"></span>
      <span className="absolute -top-8 right-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-twinkle"></span>
      <span className="absolute -bottom-8 left-1/4 w-3 h-3 bg-yellow-600 rounded-full animate-twinkle-delayed"></span>

      <Link href="/shop">
        <button
          className="relative inline-flex items-center px-8 py-3 text-lg font-semibold text-white
          rounded-full bg-gradient-to-r from-yellow-500 to-yellow-700
          shadow-lg shadow-yellow-500/30
          overflow-hidden group transition-all duration-300"
        >
          {/* Glowing hover aura */}
          <span
            className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 
            opacity-0 group-hover:opacity-100 blur-xl transition duration-500"
          ></span>

          {/* Button text */}
          <span className="relative flex items-center gap-2">
            View All Products
            <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </span>
        </button>
      </Link>
    </div>
  );
};

export default ViewAllProducts;
