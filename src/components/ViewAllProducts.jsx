"use client";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

const ViewAllProducts = () => {
  return (
    <div className="relative flex justify-center mt-12 mb-8">
      <Link href="/shop" className="group">
        <div className="relative inline-flex items-center justify-center gap-4 px-12 py-6 md:px-16 md:py-7 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white font-bold text-xl md:text-2xl shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/20 hover:border-white/30 overflow-hidden">
          
          {/* Animated background shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <ShoppingBag size={32} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
          
          {/* Button Text */}
          <span className="relative z-10 flex items-center gap-3">
            <span>View All Products</span>
            <ArrowRight size={28} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform duration-300" />
          </span>
          
          {/* Decorative sparkles */}
          <div className="absolute top-3 left-6 w-2.5 h-2.5 bg-white/60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-8 w-2 h-2 bg-white/50 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-700"></div>
        </div>
      </Link>
    </div>
  );
};

export default ViewAllProducts;
