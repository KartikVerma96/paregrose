"use client";
import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

const products = [
  {
    id: 1,
    name: "Embroidered Kurta",
    price: 1499,
    category: "Women",
    image: "/images/carousel/pic_1.jpg",
  },
  {
    id: 2,
    name: "Men's Ethnic Jacket",
    price: 1999,
    category: "Men",
    image: "/images/carousel/pic_2.jpg",
  },
  {
    id: 3,
    name: "Kid's Festive Wear",
    price: 999,
    category: "Kids",
    image: "/images/carousel/pic_3.jpg",
  },
  {
    id: 4,
    name: "Classic Saree",
    price: 2499,
    category: "Women",
    image: "/images/carousel/pic_4.jpg",
  },
];

const ShopPageClient = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  
  // Wishlist functionality
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Cart functionality
  const { addItem: addToCart, isInCart } = useCart();

  const filteredProducts = products.filter((p) => {
    return (
      (filter === "All" || p.category === filter) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-center text-yellow-700">
        Shop Our Collection
      </h1>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        {/* Category Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-600">
          <option value="All">All</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 text-sm focus:ring-2 focus:ring-yellow-600"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="group block">
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden 
                            shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
                            hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                            transition-all duration-500 ease-out
                            border border-white/30
                            group-hover:-translate-y-1">
              
              {/* Image Container */}
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-600 ease-out 
                             group-hover:scale-110"
                />
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Wishlist Button */}
                <button
                  className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md border border-white/30
                              transition-all duration-300 ease-out hover:scale-110 ${
                    isInWishlist(product.id) 
                      ? "bg-red-500/90 text-white shadow-lg" 
                      : "bg-white/70 text-gray-700 hover:bg-red-500/90 hover:text-white hover:shadow-lg"
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // prevent navigation
                    toggleWishlist(product);
                  }}>
                  <Heart 
                    size={16} 
                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                  />
                </button>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 
                                px-3 py-1.5 rounded-lg 
                                text-xs font-semibold 
                                bg-white/80 backdrop-blur-md border border-white/30
                                text-gray-700 shadow-sm">
                  {product.category}
                </div>
                
                {/* Quick View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center 
                                bg-black/40 backdrop-blur-sm
                                opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl 
                                  text-gray-800 font-semibold text-xs
                                  shadow-xl border border-white/30
                                  transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    View Details
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 
                               group-hover:text-amber-600 transition-colors duration-300 mb-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 
                                bg-clip-text text-transparent">
                    ₹{product.price}
                  </p>
                  <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 
                                   text-green-600 font-semibold px-2 py-1 rounded-full
                                   border border-green-200/50">
                    In Stock
                  </span>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ease-out
                              transform hover:scale-[1.02] active:scale-[0.98] ${
                    isInCart(product.id)
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg hover:shadow-xl"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product);
                  }}>
                  {isInCart(product.id) ? "✓ Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}
    </div>
  );
};

export default ShopPageClient;
