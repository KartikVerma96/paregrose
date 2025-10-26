"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, Tag, Truck, Shield, ArrowRight, Percent, Gift, Clock } from "lucide-react";
import { useCartDBRedux } from "@/hooks/useCartDBRedux";
import Link from "next/link";

const CartPageClient = () => {
  const { 
    items: cartItems, 
    removeItem, 
    updateItemQuantity,
    clearAll,
    total, 
    loading,
    count 
  } = useCartDBRedux();
  
  // Calculate subtotal (total without discount)
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.totalPrice || 0);
  }, 0);
  
  const savings = 0; // For now, we don't have original price in DB cart
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Helper functions for quantity management
  const incrementQuantity = async (item) => {
    await updateItemQuantity(item.id, item.quantity + 1);
  };
  
  const decrementQuantity = async (item) => {
    if (item.quantity > 1) {
      await updateItemQuantity(item.id, item.quantity - 1);
    } else {
      await removeItem(item.id);
    }
  };

  return (
        <section className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20 py-8 md:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2" suppressHydrationWarning>
                    Shopping Cart
                  </h1>
                  <p className="text-gray-600 text-lg" suppressHydrationWarning>
                    {mounted ? `${count} ${count === 1 ? 'item' : 'items'}` : '0 items'} in your cart
                  </p>
                </div>
                <Link 
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border-2 border-amber-200 hover:border-amber-300 text-amber-700 font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <ShoppingBag size={20} strokeWidth={2.5} />
                  <span>Continue Shopping</span>
                </Link>
              </div>
              
              {/* Progress Bar */}
              {mounted && cartItems.length > 0 && (
                <div className="mt-6 bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {subtotal >= 999 ? '🎉 You got FREE delivery!' : `Add ₹${(999 - subtotal).toFixed(0)} more for FREE delivery`}
                    </span>
                    <span className="text-xs font-bold text-amber-600">₹999</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

      {!mounted || loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : mounted && cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Your Items</h2>
              {cartItems.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  disabled={loading}
                >
                  <Trash2 size={14} strokeWidth={2} />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-100 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex gap-4 md:gap-6 p-4 md:p-6">
                    {/* Product Image */}
                    <Link href={`/product/${item.productId}`} className="flex-shrink-0 cursor-pointer">
                      <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 group-hover:border-amber-200 transition-colors">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag size={40} strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between gap-4 mb-2">
                        <Link href={`/product/${item.productId}`} className="flex-1 cursor-pointer">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                            {item.name}
                          </h3>
                          
                          {/* Category, Size & Color Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            {item.category && (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-semibold border border-amber-100">
                                <Tag size={12} strokeWidth={2.5} />
                                {item.category}
                              </span>
                            )}
                            
                            {/* Size Badge */}
                            {item.selectedSize && (
                              <span className="inline-flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full font-semibold border border-purple-100">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Size: {item.selectedSize}
                              </span>
                            )}
                            
                            {/* Color Badge */}
                            {item.selectedColor && (
                              <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full font-semibold border border-blue-100">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                                Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 h-fit p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          aria-label="Remove item"
                          disabled={loading}
                        >
                          <Trash2 size={20} strokeWidth={2} />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-2xl font-bold text-gray-900">
                            {item.formattedPrice}
                          </span>
                          <span className="text-sm text-gray-500">per item</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white shadow-sm">
                            <button
                              onClick={() => decrementQuantity(item)}
                              className="p-2.5 hover:bg-amber-50 hover:text-amber-600 transition-all disabled:opacity-50 rounded-l-xl cursor-pointer"
                              disabled={loading}
                            >
                              <Minus size={18} strokeWidth={2.5} />
                            </button>
                            <span className="px-5 py-2 font-bold text-base min-w-[3.5rem] text-center border-x-2 border-gray-200 bg-gray-50">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item)}
                              className="p-2.5 hover:bg-amber-50 hover:text-amber-600 transition-all disabled:opacity-50 rounded-r-xl cursor-pointer"
                              disabled={loading}
                            >
                              <Plus size={18} strokeWidth={2.5} />
                            </button>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-500 font-medium mb-0.5">Item Total</p>
                            <p className="font-bold text-xl text-amber-600">
                              {item.formattedTotalPrice}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Subtotal */}
                      <div className="sm:hidden mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">Item Total:</span>
                        <span className="font-bold text-xl text-amber-600">
                          {item.formattedTotalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-100 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Truck size={24} className="text-green-600" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                  <p className="text-xs text-green-700 font-medium">Orders above ₹999</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-100 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Shield size={24} className="text-blue-600" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Secure Payment</p>
                  <p className="text-xs text-blue-700 font-medium">100% Protected</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-100 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Percent size={24} className="text-amber-600" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Best Prices</p>
                  <p className="text-xs text-amber-700 font-medium">Guaranteed Value</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            {/* Promo Code Section - Moved to Top */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 rounded-2xl p-5 border-2 border-purple-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Gift size={20} className="text-purple-600" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-900">Have a Promo Code?</h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-sm transition-all cursor-text"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer">
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                <Clock size={12} />
                Limited time offers available!
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag size={24} strokeWidth={2.5} />
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Subtotal ({count} {count === 1 ? 'item' : 'items'})</span>
                    <span className="font-bold text-lg">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <Truck size={18} strokeWidth={2.5} />
                      Shipping
                    </span>
                    <span className="font-bold text-green-600 text-lg">FREE</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span className="flex items-center gap-2 font-medium">
                      <Tag size={18} strokeWidth={2.5} />
                      Discount
                    </span>
                    <span className="font-bold text-green-600 text-lg">-₹0.00</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border-2 border-amber-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">Inclusive of all taxes</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700
                                   text-white py-4 rounded-xl font-bold text-lg
                                   transition-all duration-300 
                                   shadow-xl shadow-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/50
                                   flex items-center justify-center gap-2 group
                                   hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={22} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-1.5 bg-green-50 rounded-lg">
                      <Shield size={16} className="text-green-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-gray-700 font-medium">Safe and secure payments</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Truck size={16} className="text-blue-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-gray-700 font-medium">Free delivery on all orders</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-1.5 bg-amber-50 rounded-lg">
                      <Percent size={16} className="text-amber-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-gray-700 font-medium">Best price guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg shadow-lg border-2 border-gray-100">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center border-4 border-amber-100">
              <ShoppingBag size={64} className="text-amber-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Looks like you haven't added any items yet.<br />
              Start shopping to discover amazing products!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 
                         hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white px-10 py-4 rounded-xl 
                         font-bold text-lg transition-all duration-300 shadow-xl shadow-amber-500/40 
                         hover:shadow-2xl hover:shadow-amber-500/50 group
                         hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShoppingBag size={22} strokeWidth={2.5} />
              <span>Start Shopping</span>
              <ArrowRight size={22} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Benefits Preview */}
            <div className="mt-10 pt-8 border-t-2 border-gray-100 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-50 rounded-xl flex items-center justify-center">
                  <Truck size={24} className="text-green-600" strokeWidth={2.5} />
                </div>
                <p className="text-xs text-gray-600 font-semibold">Free Delivery</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Shield size={24} className="text-blue-600" strokeWidth={2.5} />
                </div>
                <p className="text-xs text-gray-600 font-semibold">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Percent size={24} className="text-amber-600" strokeWidth={2.5} />
                </div>
                <p className="text-xs text-gray-600 font-semibold">Best Prices</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};

export default CartPageClient;
