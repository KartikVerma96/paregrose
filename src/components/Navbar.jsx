'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CgMenuLeft } from 'react-icons/cg';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const nav_items = [
    { name: 'About', href: '/about' },
    { name: 'Lehanga', href: '/lehanga' },
    { name: 'Gown', href: '/gown' },
    { name: 'Dress', href: '/dress' },
    { name: 'Kurti', href: '/kurti' },
    { name: 'Saree', href: '/saree' },
    { name: 'Navratri Outfits', href: '/navratri-outfits' },
    { name: 'Oxidized Jewellery', href: '/oxidixed-jewellery' },
    { name: 'Home Decor', href: '/home-decor' },
  ];

  return (
    <nav className="w-full px-4 py-2 border-b border-neutral-200">
      <div className="flex justify-between lg:justify-center items-center text-neutral-500 text-xs md:text-sm lg:text-base font-semibold mx-auto">
        <div className="flex flex-col justify-center items-center">
          {/* Logo */}
          <div className="my-2 cursor-pointer">
            <Image src="/images/paregrose_logo.png" width={100} height={60} alt="logo" />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex justify-between items-center gap-6">
            {nav_items.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="cursor-pointer hover:text-neutral-800 transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu Icon for sm and md screens */}
        <div className="lg:hidden">
          <CgMenuLeft
            size={30}
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer hover:text-neutral-800 transition-colors"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <ul className="flex flex-col items-center gap-4 py-4  border-b border-neutral-200">
          {nav_items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="cursor-pointer hover:text-neutral-800 transition-colors text-neutral-500 text-sm font-semibold"
                onClick={() => setIsOpen(false)}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
