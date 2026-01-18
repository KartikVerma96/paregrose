'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCartDBRedux } from '@/hooks/useCartDBRedux';
import { useAlert } from '@/contexts/AlertContext';

const ProductCard = ({ product }) => {
  // Always call hooks to maintain consistent order
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCart, isInCart } = useCartDBRedux();
  const { showSuccess, showWarning } = useAlert();

  // Convert prices to numbers to handle Decimal objects or strings
  const discountedPrice = parseFloat(product.discountedPrice) || parseFloat(product.price) || 0;
  const originalPrice = parseFloat(product.originalPrice) || parseFloat(product.price) || 0;
  const discountPercentage = originalPrice > 0 
    ? ((1 - discountedPrice / originalPrice) * 100).toFixed(0) 
    : 0;

  return (
    <Link
      key={product.id}
      href={`/product/${product.id}`}
      className="group relative block"
    >
       {/* Simple Card Container */}
       <div className="relative bg-white rounded-2xl overflow-hidden 
                       shadow-md hover:shadow-lg
                       transition-all duration-300 ease-out">
        
         {/* Image Container */}
         <div className="relative w-full h-80 overflow-hidden">
           <Image
             src={product.image}
             alt={product.name}
             fill
             className="object-cover transition-all duration-300 ease-out 
                        group-hover:scale-105"
           />
          
           {/* Wishlist Button */}
           <button
             className={`absolute top-4 right-4 p-2 rounded-full
                         transition-all duration-300 ease-out hover:scale-110 cursor-pointer ${
               isInWishlist(product.id) 
                 ? "bg-red-500 text-white shadow-lg" 
                 : "bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white shadow-md"
             }`}
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               const wasInWishlist = isInWishlist(product.id);
               toggleWishlist(product);
               if (wasInWishlist) {
                 showWarning("Removed from Wishlist", `${product.name} has been removed from your wishlist.`);
               } else {
                 showSuccess("Added to Wishlist", `${product.name} has been added to your wishlist!`);
               }
             }}>
             <Heart 
               size={16} 
               fill={isInWishlist(product.id) ? "currentColor" : "none"}
             />
           </button>
          
           {/* Premium Badge */}
           <div className="absolute top-4 left-4 
                           px-3 py-1 rounded-lg 
                           text-xs font-bold tracking-wide uppercase 
                           bg-amber-500 text-white shadow-md">
             Exclusive
           </div>
        </div>

        {/* Content Container */}
        <div className="p-6 relative">
           {/* Product Title */}
           <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 
                          group-hover:text-amber-600 transition-colors duration-300 mb-3">
             {product.name}
           </h3>

           {/* Price Section */}
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center space-x-2">
               <span className="text-lg font-bold text-amber-600">
                 ₹{discountedPrice.toFixed(2)}
               </span>
               {originalPrice > discountedPrice && (
                 <span className="text-sm text-gray-400 line-through">
                   ₹{originalPrice.toFixed(2)}
                 </span>
               )}
             </div>
             {originalPrice > discountedPrice && (
               <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-1 rounded-full">
                 {discountPercentage}% OFF
               </span>
             )}
           </div>
          
           {/* Add to Cart Button */}
           <button
             className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ease-out cursor-pointer
                         ${
               isInCart(product.id)
                 ? "bg-green-500 text-white shadow-md"
                 : "bg-amber-500 text-white hover:bg-amber-600 shadow-md hover:shadow-lg"
             }`}
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               const wasInCart = isInCart(product.id);
               addToCart(product);
               if (!wasInCart) {
                 showSuccess("Added to Cart", `${product.name} has been added to your cart!`);
               }
             }}>
             {isInCart(product.id) ? "✓ Added to Cart" : "Add to Cart"}
           </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
