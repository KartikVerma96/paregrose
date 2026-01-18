"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CgMenuLeft } from "react-icons/cg";
import { FaRegHeart, FaRegUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useCartDBRedux } from "@/hooks/useCartDBRedux";
import { useCategories } from "@/hooks/useCategories";

export const Navbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for home page navbar background
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);
  
  // Redux auth state and actions
  const { 
    user, 
    isAuthenticated, 
    logoutUser 
  } = useAuth();
  
  // Wishlist state
  const { count: wishlistCount } = useWishlist();
  
  // Cart state
  const { count: cartCount } = useCartDBRedux();

  // Categories state
  const { categories, loading: categoriesLoading } = useCategories();

  // Fix hydration issue by ensuring client-side rendering for dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset expanded category when menu closes
      setExpandedCategory(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Static navigation items (non-category items)
  const static_nav_items = [];

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
      {/* Backdrop Overlay for Mobile Menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav className={`w-full px-2 sm:px-4 py-8 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isHomePage || isScrolled ? 'shadow-sm' : ''
      }`}
      style={!isHomePage || (isHomePage && isScrolled) ? {
        background: 'linear-gradient(to bottom, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.98) 50%, rgba(10, 10, 10, 1) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      } : {}}>
        <div className="text-neutral-600 text-xs md:text-sm lg:text-base font-semibold mx-auto max-w-7xl">
          {/* Top Row - Logo and Icons (Desktop) */}
          <div className="lg:flex lg:justify-center lg:items-center hidden mb-4 relative">
            {/* Logo - Centered */}
            <div className="cursor-pointer">
              <Link href="/">
                <Image
                  src="/images/paregrose_logo.png"
                  width={240}
                  height={96}
                  alt="logo"
                  priority
                  className="w-auto h-auto"
                  style={{ maxWidth: '240px', height: 'auto' }}
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
                <li className={`text-sm ${(isHomePage && !isScrolled) ? 'text-white drop-shadow-lg' : 'text-white'}`}>Loading categories...</li>
              ) : (
                nav_items.map((item, index) => (
                  <li key={index} className="relative group">
                    <Link
                      href={item.href}
                      className={`cursor-pointer transition-colors duration-300 whitespace-nowrap flex items-center gap-1 ${
                        (isHomePage && !isScrolled)
                          ? 'text-white drop-shadow-lg group-hover:text-yellow-300' 
                          : 'text-white group-hover:text-amber-400'
                      }`}>
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
                    <span className={`absolute left-0 bottom-[-4px] w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                      (isHomePage && !isScrolled) ? 'bg-yellow-300' : 'bg-amber-400'
                    }`}></span>
                    
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
                  width={140}
                  height={84}
                  alt="logo"
                  priority
                  className="w-[110px] h-auto sm:w-[120px] md:w-[140px]"
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
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold text-xs hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer">
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

              {/* Animated Hamburger Menu Icon */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex flex-col items-center justify-center w-9 h-9 rounded-full hover:bg-amber-50 transition-all duration-200 gap-1.5 relative cursor-pointer"
                  aria-label="Toggle menu">
                  <span className={`w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 absolute' : ''}`}></span>
                  <span className={`w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 absolute' : ''}`}></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Only render when open */}
        {isOpen && (
          <div className="lg:hidden animate-slideDown relative z-50">
            <div className="border-t border-neutral-200 bg-white shadow-xl">
              {/* Mobile Navigation Links */}
              <ul className="flex flex-col items-center gap-2 py-4 px-4">
                {categoriesLoading ? (
                  <li className="w-full text-center py-3 px-4 text-neutral-500 text-sm">
                    Loading categories...
                  </li>
                ) : (
                  nav_items.map((item, index) => {
                    const hasSubcategories = item.subcategories && item.subcategories.length > 0;
                    const isExpanded = expandedCategory === index;
                    
                    return (
                      <li key={index} className="w-full">
                        <div className="flex items-center justify-between gap-3 w-full bg-white border border-gray-100 rounded-xl p-2 hover:border-amber-200 transition-all duration-200 shadow-sm">
                          {/* Main category link */}
                          <Link
                            href={item.href}
                            className="flex-1 text-left py-2 px-3 rounded-lg text-neutral-700 hover:text-yellow-600 transition-all duration-200 text-sm font-semibold"
                            onClick={() => setIsOpen(false)}>
                            {item.name}
                          </Link>
                          
                          {/* Toggle button for categories with subcategories */}
                          {hasSubcategories && (
                            <button
                              onClick={() => setExpandedCategory(isExpanded ? null : index)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 transition-all duration-200 flex-shrink-0 cursor-pointer"
                              aria-label={`Toggle ${item.name} subcategories`}>
                              <svg 
                                className={`w-4 h-4 text-amber-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          )}
                          
                          {/* Spacer for items without subcategories to maintain alignment */}
                          {!hasSubcategories && (
                            <div className="w-8 h-8"></div>
                          )}
                        </div>
                        
                        {/* Subcategories dropdown for mobile */}
                        {hasSubcategories && isExpanded && (
                          <div className="mt-2 ml-3 pl-4 border-l-2 border-amber-200 space-y-1 animate-slideDown">
                            {item.subcategories.map((subcategory, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subcategory.href}
                                className="flex items-center gap-2 py-2 px-4 rounded-lg text-neutral-600 hover:text-yellow-600 hover:bg-amber-50 transition-all duration-200 text-sm bg-white border border-gray-100 hover:border-amber-200 shadow-sm"
                                onClick={() => setIsOpen(false)}>
                                <span className="text-amber-500 font-bold">•</span>
                                <span>{subcategory.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })
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
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all duration-200 text-sm font-semibold cursor-pointer">
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
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold text-sm hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 cursor-pointer">
                  <FaRegUser size={16} />
                  <span>Login / Register</span>
                </button>
              )}
              </div>
            </div>
          </div>
        )}
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
