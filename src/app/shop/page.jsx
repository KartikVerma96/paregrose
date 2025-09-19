"use client";
import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";

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

const ShopPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

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
          <Link href={`/shop/${product.id}`} key={product.id}>
            <div className="bg-white shadow-md rounded-xl overflow-hidden group hover:shadow-lg transition cursor-pointer">
              <div className="relative w-full h-56">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />
                <button
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-yellow-600 hover:text-white transition"
                  onClick={(e) => {
                    e.preventDefault(); // prevent navigation
                    console.log("Add to wishlist", product.id);
                  }}>
                  <Heart size={18} />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  {product.name}
                </h3>
                <p className="text-yellow-700 font-bold mt-1">
                  ₹{product.price}
                </p>
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

export default ShopPage;
