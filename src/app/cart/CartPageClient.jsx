"use client";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const CartPageClient = () => {
  const { 
    items: cartItems, 
    removeItem, 
    incrementItemQuantity, 
    decrementItemQuantity, 
    total, 
    subtotal, 
    savings,
    count 
  } = useCart();

  return (
    <section className="py-20 px-4 min-h-screen bg-neutral-50">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-12 relative">
        My Cart 🛒 ({count})
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-15px] w-20 h-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"></span>
      </h2>

      {cartItems.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden 
                           shadow-[0_8px_32px_rgba(0,0,0,0.08)] 
                           hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                           transition-all duration-500 ease-out
                           border border-white/20
                           hover:-translate-y-1"
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent 
                                backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative flex gap-6 p-6">
                  {/* Remove Button */}
                  <button
                    className="absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md border border-white/30
                               bg-white/70 text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 
                               transition-all duration-300 ease-out shadow-lg z-10"
                    aria-label="Remove item"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </button>

                  {/* Product Image */}
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-all duration-500 ease-out 
                                 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-gray-800 hover:text-amber-600 
                                     transition-colors duration-300 line-clamp-2 mb-3">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 
                                         bg-clip-text text-transparent">
                          ₹{item.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{item.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs bg-gradient-to-r from-red-100 to-pink-100 
                                         text-red-600 font-bold px-2 py-1 rounded-full
                                         border border-red-200/50">
                          {(
                            (1 - item.discountedPrice / item.originalPrice) *
                            100
                          ).toFixed(0)}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-3">
                        <button 
                          className="p-2 rounded-xl backdrop-blur-md border border-white/30
                                     bg-white/70 text-gray-700 hover:bg-amber-500 hover:text-white 
                                     transition-all duration-300 ease-out hover:scale-110 shadow-lg"
                          onClick={() => decrementItemQuantity(item.id)}
                        >
                          <Minus size={16} strokeWidth={2} />
                        </button>
                        <span className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl text-sm font-bold 
                                         text-gray-800 border border-white/30 shadow-lg min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          className="p-2 rounded-xl backdrop-blur-md border border-white/30
                                     bg-white/70 text-gray-700 hover:bg-amber-500 hover:text-white 
                                     transition-all duration-300 ease-out hover:scale-110 shadow-lg"
                          onClick={() => incrementItemQuantity(item.id)}
                        >
                          <Plus size={16} strokeWidth={2} />
                        </button>
                      </div>
                      
                      {/* Total Price */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Total</p>
                        <p className="text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 
                                       bg-clip-text text-transparent">
                          ₹{(item.discountedPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden 
                          shadow-[0_8px_32px_rgba(0,0,0,0.08)] 
                          border border-white/20 p-6 h-fit sticky top-24">
            
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent 
                            backdrop-blur-md"></div>
            
            <div className="relative">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full"></span>
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You Save</span>
                    <span className="font-semibold">₹{savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200/50 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="bg-gradient-to-r from-amber-600 to-yellow-600 
                                   bg-clip-text text-transparent">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-4 
                                 rounded-2xl text-sm font-bold transition-all duration-300 ease-out
                                 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
                Proceed to Checkout
              </button>
            </div>
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

export default CartPageClient;
