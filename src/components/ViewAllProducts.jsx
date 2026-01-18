"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const ViewAllProducts = () => {
  const [dotStyles, setDotStyles] = useState([]);

  useEffect(() => {
    const styles = Array.from({ length: 14 }).map(() => ({
      width: `${Math.random() * 1 + 1.5}px`,
      height: `${Math.random() * 1 + 1.5}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      boxShadow: "0 0 6px rgba(255,255,255,0.7)",
      animation: `twinkle 2.5s infinite ease-in-out ${Math.random() * 3}s, 
                  float${(Math.floor(Math.random() * 4) + 1)} ${5 + Math.random() * 3}s infinite ease-in-out ${Math.random() * 2}s`,
    }));
    setDotStyles(styles);
  }, []);

  return (
    <div className="relative flex justify-center mt-12">
      <div className="relative flex items-center justify-center w-[280px] md:w-[320px] px-6 py-4 rounded-2xl bg-[#1A1A1A] text-white shadow-lg overflow-hidden border border-[#333]">
        {/* Animated floating dots with random twinkling */}
        {dotStyles.map((style, i) => (
          <span
            key={i}
            className="absolute bg-amber-400/80 rounded-full"
            style={style}
          ></span>
        ))}

        {/* Shop Button (text only, white color) */}
        <Link href="/shop">
          <span className="relative z-10 text-lg font-semibold text-white cursor-pointer hover:text-gray-300 transition-colors duration-300">
            View All Products →
          </span>
        </Link>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes float1 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(6px, -8px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-9px, 5px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float3 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(7px, 9px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float4 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-7px, -9px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default ViewAllProducts;