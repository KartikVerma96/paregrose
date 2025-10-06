"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { FaRegHeart, FaRegUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useCategories } from "@/hooks/useCategories";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Redux auth state and actions
  const { 
    user, 
    isAuthenticated, 
    logoutUser 
  } = useAuth();
  
  // Wishlist state
  const { count: wishlistCount } = useWishlist();
  
  // Cart state
  const { count: cartCount } = useCart();

  // Categories state
  const { categories, loading: categoriesLoading } = useCategories();

  // Fix hydration issue by ensuring client-side rendering for dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Static navigation items (non-category items)
  const static_nav_items = [
    { name: "About", href: "/about" },
  ];

  // Dynamic category navigation items with subcategories
  const category_nav_items = categories.map(category => ({
    name: category.name,
    href: `/shop/${category.slug}`,
    subcategories: category.subcategories ? category.subcategories.map(child => ({
      name: child.name,
      href: `/shop/${child.slug}`
    })) : []
  }));

  // Combine static and dynamic navigation items
  const nav_items = [...static_nav_items, ...category_nav_items];

  return (
    <>
      <nav className="w-full px-2 sm:px-4 py-2 border-b border-neutral-200 bg-white">
        <div className="text-neutral-600 text-xs md:text-sm lg:text-base font-semibold mx-auto max-w-7xl">
          {/* Top Row - Logo and Icons (Desktop) */}
          <div className="lg:flex lg:justify-center lg:items-center hidden mb-4 relative">
            {/* Logo - Centered */}
            <div className="cursor-pointer">
              <Link href="/">
                <Image
                  src="/images/paregrose_logo.png"
                  width={120}
                  height={72}
                  alt="logo"
                />
              </Link>
            </div>

            {/* Right Side Icons with tooltips - Positioned absolutely */}
            <div className="absolute right-0 flex items-center gap-4 text-neutral-600">
              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {/* User Profile */}
                  <div className="relative group">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-white border border-amber-200/60 cursor-pointer hover:border-amber-300 hover:shadow-lg transition-all duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center text-white font-semibold text-sm">
                        {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[150px]">
                          {user?.name || 'User'}
                        </span>
                        <span className="text-xs text-gray-500 leading-tight truncate max-w-[150px]">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    <span className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-50">
                      Profile
                    </span>
                  </div>
                  
                  {/* Logout */}
                  <div className="relative group">
                    <button
                      onClick={() => logoutUser()}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-amber-200/60 cursor-pointer hover:border-red-300 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                      <FaSignOutAlt size={16} className="text-gray-600 hover:text-red-600 transition-colors duration-300" />
                    </button>
                    <span className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-50">
                      Logout
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold text-sm hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer">
                    <FaRegUser size={16} />
                    <span>Login</span>
                  </button>
                  <span className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-50">
                    Sign in to your account
                  </span>
                </div>
              )}

              {/* Wishlist */}
              <div className="relative group">
                <Link
                  href="/wishlist"
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white border border-amber-200/60 hover:border-amber-300 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                  <FaRegHeart size={18} className="text-gray-600 hover:text-amber-600 transition-colors duration-300" />
                  {isClient && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <span className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-50">
                  Wishlist ({isClient ? wishlistCount : 0})
                </span>
              </div>

              {/* Cart */}
              <div className="relative group">
                <Link
                  href="/cart"
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white border border-amber-200/60 hover:border-amber-300 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                  <FaShoppingCart size={18} className="text-gray-600 hover:text-amber-600 transition-colors duration-300" />
                  {isClient && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <span className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-50">
                  Cart ({isClient ? cartCount : 0})
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row - Navigation Menu (Desktop) */}
          <div className="hidden lg:block">
            <ul className="flex justify-center items-center gap-8 xl:gap-10 py-2">
              {categoriesLoading ? (
                <li className="text-neutral-500 text-sm">Loading categories...</li>
              ) : (
                nav_items.map((item, index) => (
                  <li key={index} className="relative group">
                    <Link
                      href={item.href}
                      className="cursor-pointer text-neutral-700 transition-colors duration-300 group-hover:text-yellow-600 whitespace-nowrap flex items-center gap-1">
                      {item.name}
                      {/* Dropdown arrow for categories with subcategories */}
                      {item.subcategories && item.subcategories.length > 0 && (
                        <svg 
                          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                    {/* Golden underline effect */}
                    <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-yellow-600 transition-all duration-300 group-hover:w-full"></span>
                    
                    {/* Subcategories Dropdown */}
                    {item.subcategories && item.subcategories.length > 0 && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div className="py-2">
                          {/* Main category link */}
                          <Link
                            href={item.href}
                            className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200 border-b border-gray-100">
                            View All {item.name}
                          </Link>
                          
                          {/* Subcategories */}
                          {item.subcategories.map((subcategory, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subcategory.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200">
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden flex justify-between items-center">
            {/* Logo */}
            <div className="cursor-pointer">
              <Link href="/">
                <Image
                  src="/images/paregrose_logo.png"
                  width={80}
                  height={48}
                  alt="logo"
                  className="w-[90px] h-[54px] sm:w-[100px] sm:h-[60px] md:w-[110px] md:h-[66px]"
                />
              </Link>
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center gap-2 sm:gap-4 text-neutral-600">
              {/* User Authentication Mobile */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {/* User Profile Mobile */}
                  <div className="relative group">
                    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white border border-amber-200/60">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center text-white font-semibold text-xs">
                        {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden sm:flex flex-col">
                        <span className="text-xs font-semibold text-gray-800 leading-tight truncate max-w-[100px]">
                          {user?.name || 'User'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Logout Mobile */}
                  <div className="relative group">
                    <button
                      onClick={() => logoutUser()}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-amber-200/60 cursor-pointer hover:border-red-300 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                      <FaSignOutAlt size={14} className="text-gray-600 hover:text-red-600 transition-colors duration-300" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold text-xs hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95">
                    <FaRegUser size={14} />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                </div>
              )}

              {/* Wishlist Mobile */}
              <div className="relative group">
                <Link
                  href="/wishlist"
                  className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white border border-amber-200/60 hover:border-amber-300 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                  <FaRegHeart size={16} className="text-gray-600 hover:text-amber-600 transition-colors duration-300" />
                  {isClient && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Cart Mobile */}
              <div className="relative group">
                <Link
                  href="/cart"
                  className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white border border-amber-200/60 hover:border-amber-300 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                  <FaShoppingCart size={16} className="text-gray-600 hover:text-amber-600 transition-colors duration-300" />
                  {isClient && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Menu Icon for mobile and tablet screens */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-amber-50 transition-colors duration-200"
                  aria-label="Toggle menu">
                  <CgMenuLeft
                    size={20}
                    className="cursor-pointer hover:text-yellow-600 transition-colors"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}>
          <div className="border-t border-neutral-200 bg-white">
            {/* Mobile Navigation Links */}
            <ul className="flex flex-col items-center gap-2 py-4 px-4">
              {categoriesLoading ? (
                <li className="w-full text-center py-3 px-4 text-neutral-500 text-sm">
                  Loading categories...
                </li>
              ) : (
                nav_items.map((item, index) => (
                  <li key={index} className="w-full">
                    {/* Main category link */}
                    <Link
                      href={item.href}
                      className="block w-full text-center py-3 px-4 rounded-lg text-neutral-600 hover:text-yellow-600 hover:bg-amber-50 transition-all duration-200 text-sm font-semibold"
                      onClick={() => setIsOpen(false)}>
                      {item.name}
                    </Link>
                    
                    {/* Subcategories for mobile */}
                    {item.subcategories && item.subcategories.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subcategories.map((subcategory, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subcategory.href}
                            className="block w-full text-center py-2 px-4 rounded-lg text-neutral-500 hover:text-yellow-600 hover:bg-amber-50 transition-all duration-200 text-xs"
                            onClick={() => setIsOpen(false)}>
                            • {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
            
            {/* Mobile Auth Section */}
            <div className="border-t border-neutral-200 px-4 py-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  {/* User Profile Mobile */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center text-white font-semibold">
                      {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {user?.name || 'User'}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  
                  {/* Mobile Actions */}
                  <div className="flex gap-3">
                    <Link
                      href="/wishlist"
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white border border-amber-200 text-neutral-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 text-sm font-semibold"
                      onClick={() => setIsOpen(false)}>
                      <FaRegHeart size={16} />
                      <span>Wishlist</span>
                      {isClient && wishlistCount > 0 && (
                        <span className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    
                    <Link
                      href="/cart"
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white border border-amber-200 text-neutral-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 text-sm font-semibold"
                      onClick={() => setIsOpen(false)}>
                      <FaShoppingCart size={16} />
                      <span>Cart</span>
                      {isClient && cartCount > 0 && (
                        <span className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </div>
                  
                  {/* Logout Button Mobile */}
                  <button
                    onClick={() => {
                      logoutUser();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all duration-200 text-sm font-semibold">
                    <FaSignOutAlt size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold text-sm hover:from-amber-600 hover:to-yellow-700 transition-all duration-200">
                  <FaRegUser size={16} />
                  <span>Login / Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 👇 Mount Login Modal here */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => setIsRegisterOpen(true)} // 👈 add this
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => setIsLoginOpen(true)}
      />
    </>
  );
};

export default Navbar;
