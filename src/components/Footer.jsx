'use client';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Playfair_Display } from 'next/font/google';

// Load Playfair Display font
const playfair = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Brand / Logo */}
          <div>
            <h2
              className={`${playfair.className} text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-yellow-300`}>
              Paregrose
              <span className="block w-12 h-0.5 bg-yellow-300 mt-2"></span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-100 leading-relaxed">
              Elevate your style with Paregrose's exquisite collection of ethnic wear, blending
              timeless tradition with modern sophistication.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`${playfair.className} text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-yellow-200`}>
              Explore
            </h3>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 ease-in-out">
                  Discover Our Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 ease-in-out">
                  Browse Collections
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 ease-in-out">
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 ease-in-out">
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3
              className={`${playfair.className} text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-yellow-200`}>
              Support
            </h3>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 ease-in-out">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 ease-in-out">
                  Shipping & Returns Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 ease-in-out">
                  Privacy Assurance
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-yellow-300 transition-all duration-300 ease-in-out">
                  Terms of Elegance
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3
              className={`${playfair.className} text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-yellow-200`}>
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-3 bg-white/10 rounded-full hover:bg-yellow-300 hover:text-teal-900 transition-all duration-300 ease-in-out">
                <FaFacebookF className="text-lg sm:text-xl" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 rounded-full hover:bg-yellow-300 hover:text-teal-900 transition-all duration-300 ease-in-out">
                <FaInstagram className="text-lg sm:text-xl" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 rounded-full hover:bg-yellow-300 hover:text-teal-900 transition-all duration-300 ease-in-out">
                <FaTwitter className="text-lg sm:text-xl" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 rounded-full hover:bg-yellow-300 hover:text-teal-900 transition-all duration-300 ease-in-out">
                <FaLinkedinIn className="text-lg sm:text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-yellow-300/20 mt-10 pt-6 text-center text-sm sm:text-base text-gray-100">
          © {new Date().getFullYear()} Paregrose. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
