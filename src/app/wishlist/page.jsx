"use client";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag } from "lucide-react";

const WishlistPage = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Sukhmani Gambhir Party Wear Saree With Moti Work Border",
      image: "/images/carousel/pic_1.jpg",
      originalPrice: 2799.0,
      discountedPrice: 1499.0,
    },
    {
      id: 2,
      name: "Bollywood Star Suhana Khan Cream Colour Party Wear Saree",
      image: "/images/carousel/pic_2.jpg",
      originalPrice: 2049.0,
      discountedPrice: 999.0,
    },
    {
      id: 3,
      name: "Traditional Ready To Wear Red Colour Saree For Karwa Chauth",
      image: "/images/carousel/pic_3.jpg",
      originalPrice: 2499.0,
      discountedPrice: 1499.0,
    },
  ];

  return (
    <section className="py-20 px-4 min-h-screen bg-neutral-50">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-12 relative">
        My Wishlist ❤️
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-15px] w-20 h-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"></span>
      </h2>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="relative border border-gray-200 bg-gradient-to-br from-white/95 via-gray-50/90 to-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)] transition duration-300"
            >
              {/* Remove Button */}
              <button
                className="absolute top-4 right-4 z-10 text-neutral-500 hover:text-red-600 hover:scale-110 transition-all duration-200 ease-out"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={20} strokeWidth={1.8} />
              </button>

              {/* Product Image */}
              <div className="relative w-full h-80 aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105 image-rendering-[-webkit-optimize-contrast]"
                  priority={item.id === 1}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white/90 text-amber-600 font-semibold py-1 px-2 text-xs rounded-lg hover:bg-amber-100 transition">
                    View Details
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 bg-white/95">
                <h3 className="text-xs md:text-sm font-serif font-semibold text-gray-800 line-clamp-2 hover:text-amber-600 transition-colors">
                  {item.name}
                </h3>

                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-base font-bold text-amber-700">
                    ₹{item.discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    ₹{item.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xxs bg-amber-100 text-amber-700 font-medium px-1.5 py-0.5 rounded-full">
                    {(
                      (1 - item.discountedPrice / item.originalPrice) *
                      100
                    ).toFixed(0)}
                    % OFF
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition">
                    <ShoppingBag size={16} /> Move to Cart
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                    <Heart className="text-red-500" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-600 mt-16 text-lg">
          Your wishlist is empty. Start adding products you love ❤️
        </p>
      )}
    </section>
  );
};

export default WishlistPage;
