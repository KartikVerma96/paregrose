"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

const WishlistPageClient = () => {
  const { items: wishlistItems, removeItem, count } = useWishlist();
  const { addItem: addToCart, isInCart } = useCart();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issue - only show count after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-20 px-4 min-h-screen bg-neutral-50">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-12 relative">
        My Wishlist ❤️ ({mounted ? count : '...'})
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-15px] w-20 h-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"></span>
      </h2>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {wishlistItems.map((item) => {
            // Convert prices to numbers to handle Decimal objects or strings
            const discountedPrice = parseFloat(item.discountedPrice) || parseFloat(item.price) || 0;
            const originalPrice = parseFloat(item.originalPrice) || parseFloat(item.price) || 0;
            const discountPercentage = originalPrice > 0 
              ? ((1 - discountedPrice / originalPrice) * 100).toFixed(0) 
              : 0;
            
            // Get image URL with fallback
            const imageUrl = item.image || item.images?.[0]?.image_url || '/images/placeholder.jpg';
            
            return (
              <div
                key={item.id}
                className="group relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden 
                           shadow-[0_8px_32px_rgba(0,0,0,0.08)] 
                           hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                           transition-all duration-500 ease-out
                           border border-white/20
                           hover:-translate-y-2"
              >
              {/* Glassmorphism Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent 
                              backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Remove Button */}
              <button
                className="absolute top-4 right-4 z-10 p-3 rounded-2xl backdrop-blur-md border border-white/30
                           bg-white/70 text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 
                           transition-all duration-300 ease-out shadow-lg cursor-pointer"
                aria-label="Remove from wishlist"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 size={18} strokeWidth={2} />
              </button>

              {/* Product Image */}
              <div className="relative w-full h-80 overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.name || 'Product'}
                    fill
                    className="object-cover transition-all duration-700 ease-out 
                               group-hover:scale-110 group-hover:rotate-1"
                    priority={item.id === 1}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Quick View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center 
                                bg-black/40 backdrop-blur-sm
                                opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl 
                                  text-gray-800 font-semibold text-sm
                                  shadow-xl border border-white/30
                                  transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    View Details
                  </div>
                </div>
                
                {/* Heart Icon */}
                <div className="absolute top-4 left-4 p-3 rounded-2xl backdrop-blur-md border border-white/30
                                bg-red-500/90 text-white shadow-lg">
                  <Heart size={18} fill="currentColor" />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 relative">
                <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 
                               group-hover:text-amber-600 transition-colors duration-300 mb-3">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 
                                     bg-clip-text text-transparent">
                      ₹{discountedPrice.toFixed(2)}
                    </span>
                    {originalPrice > discountedPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {originalPrice > discountedPrice && (
                    <span className="text-xs bg-gradient-to-r from-red-100 to-pink-100 
                                     text-red-600 font-bold px-3 py-1 rounded-full
                                     border border-red-200/50">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold 
                                transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      isInCart(item.id)
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg hover:shadow-xl"
                    }`}
                    onClick={() => addToCart(item)}
                  >
                    <ShoppingBag size={16} /> 
                    {isInCart(item.id) ? "✓ In Cart" : "Move to Cart"}
                  </button>
                  <button 
                    className="p-3 rounded-2xl backdrop-blur-md border border-white/30
                               bg-white/70 text-red-500 hover:bg-red-500 hover:text-white 
                               transition-all duration-300 ease-out hover:scale-110 shadow-lg cursor-pointer"
                    onClick={() => removeItem(item.id)}
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-neutral-600 mt-16 text-lg">
          Your wishlist is empty. Start adding products you love ❤️
        </p>
      )}
    </section>
  );
};

export default WishlistPageClient;
