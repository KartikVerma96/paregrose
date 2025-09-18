"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { FaRegHeart, FaRegUser, FaShoppingCart } from "react-icons/fa";
import LoginModal from "./LoginModal"; // 👈 import modal
import RegisterModal from "./RegisterModal";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // 👈 modal state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const nav_items = [
    { name: "About", href: "/about" },
    { name: "Lehanga", href: "/lehanga" },
    { name: "Gown", href: "/gown" },
    { name: "Dress", href: "/dress" },
    { name: "Kurti", href: "/kurti" },
    { name: "Saree", href: "/saree" },
    { name: "Navratri Outfits", href: "/navratri-outfits" },
    { name: "Oxidized Jewellery", href: "/oxidixed-jewellery" },
    { name: "Home Decor", href: "/home-decor" },
  ];

  return (
    <>
      <nav className="w-full px-4 py-2 border-b border-neutral-200 bg-white">
        <div className="flex justify-between lg:justify-center items-center text-neutral-600 text-xs md:text-sm lg:text-base font-semibold mx-auto">
          {/* Logo */}
          <div className="flex flex-col justify-center items-center">
            <div className="my-2 cursor-pointer">
              <Link href="/">
                <Image
                  src="/images/paregrose_logo.png"
                  width={100}
                  height={60}
                  alt="logo"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex justify-between items-center gap-10">
              {nav_items.map((item, index) => (
                <li key={index} className="relative group">
                  <Link
                    href={item.href}
                    className="cursor-pointer text-neutral-700 transition-colors duration-300 group-hover:text-yellow-600">
                    {item.name}
                  </Link>
                  {/* Golden underline effect */}
                  <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-yellow-600 transition-all duration-300 group-hover:w-full"></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Icons with tooltips */}
          <div className="flex items-center gap-6 text-neutral-600">
            {/* Login */}
            <div className="relative group">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center justify-center cursor-pointer hover:text-yellow-600 transition-transform duration-300 hover:scale-110">
                <FaRegUser size={20} />
              </button>
              <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                Login
              </span>
            </div>

            {/* Wishlist */}
            <div className="relative group">
              <Link
                href="/wishlist"
                className="hover:text-yellow-600 transition-transform duration-300 hover:scale-110">
                <FaRegHeart size={20} />
              </Link>
              <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                Wishlist
              </span>
            </div>

            {/* Cart */}
            <div className="relative group">
              <Link
                href="/cart"
                className="relative hover:text-yellow-600 transition-transform duration-300 hover:scale-110">
                <FaShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
              <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                Cart
              </span>
            </div>
          </div>

          {/* Menu Icon for sm and md screens */}
          <div className="lg:hidden">
            <CgMenuLeft
              size={30}
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer hover:text-yellow-600 transition-colors"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}>
          <ul className="flex flex-col items-center gap-4 py-4 border-b border-neutral-200">
            {nav_items.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="cursor-pointer text-neutral-600 hover:text-yellow-600 transition-colors text-sm font-semibold"
                  onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
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
