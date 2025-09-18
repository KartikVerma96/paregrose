"use client";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";

const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "Sukhmani Gambhir Party Wear Saree With Moti Work Border",
      image: "/images/carousel/pic_1.jpg",
      originalPrice: 2799.0,
      discountedPrice: 1499.0,
      quantity: 1,
    },
    {
      id: 2,
      name: "Bollywood Star Suhana Khan Cream Colour Party Wear Saree",
      image: "/images/carousel/pic_2.jpg",
      originalPrice: 2049.0,
      discountedPrice: 999.0,
      quantity: 2,
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );

  return (
    <section className="py-20 px-4 min-h-screen bg-neutral-50">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-12 relative">
        My Cart 🛒
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-15px] w-20 h-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"></span>
      </h2>

      {cartItems.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="relative flex gap-6 border border-gray-200 bg-gradient-to-br from-white/95 via-gray-50/90 to-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition duration-300 p-4"
              >
                {/* Remove */}
                <button
                  className="absolute top-4 right-4 text-neutral-500 hover:text-red-600 hover:scale-110 transition"
                  aria-label="Remove item"
                >
                  <Trash2 size={20} strokeWidth={1.8} />
                </button>

                {/* Product Image */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-xl image-rendering-[-webkit-optimize-contrast]"
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-sm md:text-base font-serif font-semibold text-gray-800 hover:text-amber-600 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-lg font-bold text-amber-700">
                        ₹{item.discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
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
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-4">
                    <button className="p-1 border rounded-md hover:bg-gray-100 transition">
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button className="p-1 border rounded-md hover:bg-gray-100 transition">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border border-gray-200 bg-gradient-to-br from-white/95 via-gray-50/90 to-white/80 rounded-2xl shadow-md p-6 h-fit sticky top-24">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h3>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-3 mt-3">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <button className="mt-6 w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-neutral-600 mt-16 text-lg">
          Your cart is empty. Start shopping 🛍️
        </p>
      )}
    </section>
  );
};

export default CartPage;
