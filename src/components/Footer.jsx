'use client';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const Footer = () => {
  return (
    <footer className="text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/pxfuel.jpg)'
        }}
      ></div>
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Subtle gradient overlay for aesthetic appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/50"></div>
      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Brand / Logo */}
          <div className="group">
            <h2
              className={`${playfair.className} text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-white relative overflow-hidden`}>
              Paregrose
              <span className="block w-0 group-hover:w-20 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mt-2 rounded-full transition-all duration-500 ease-out"></span>
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-base leading-relaxed text-gray-300">
              Elevate your style with Paregrose's exquisite collection of ethnic wear, 
              blending timeless tradition with modern sophistication.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3
              className={`${playfair.className} text-lg sm:text-xl lg:text-xl font-semibold mb-4 sm:mb-6 text-yellow-400 relative`}>
              Explore
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 hover:w-full"></span>
            </h3>
            <ul className="space-y-3 text-sm sm:text-base lg:text-base">
              {['Discover Our Home', 'Browse Collections', 'Our Story', 'Get in Touch'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-yellow-300 transition-all duration-300 text-gray-400">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3
              className={`${playfair.className} text-lg sm:text-xl lg:text-xl font-semibold mb-4 sm:mb-6 text-yellow-400 relative`}>
              Support
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 hover:w-full"></span>
            </h3>
            <ul className="space-y-3 text-sm sm:text-base lg:text-base">
              {['FAQs', 'Shipping & Returns', 'Privacy Policy', 'Terms of Service'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-yellow-300 transition-all duration-300 text-gray-400">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3
              className={`${playfair.className} text-lg sm:text-xl lg:text-xl font-semibold mb-4 sm:mb-6 text-yellow-400 relative`}>
              Connect With Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 hover:w-full"></span>
            </h3>
            <div className="flex space-x-3 sm:space-x-4">
              {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-3 bg-yellow-900/30 rounded-full border border-yellow-400/30 hover:bg-yellow-400 hover:text-black transition-all duration-300 relative">
                  <Icon className="text-lg sm:text-xl lg:text-xl relative z-10" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-yellow-400/20 mt-8 sm:mt-10 lg:mt-12 pt-4 sm:pt-5 lg:pt-6 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm sm:text-base lg:text-base">
          <p>© {new Date().getFullYear()} Paregrose. All rights reserved.</p>
          <div className="flex space-x-4 sm:space-x-6 mt-2 sm:mt-0">
            <a href="#" className="hover:text-yellow-300 transition-all duration-300 text-gray-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-yellow-300 transition-all duration-300 text-gray-400">
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* Inline Styles for Animations */}
      <style jsx>{`
        /* Custom Text Selection */
        ::selection {
          background-color: rgb(251 191 36); /* amber-400 */
          color: rgb(0 0 0); /* black text for better contrast */
        }
        
        ::-moz-selection {
          background-color: rgb(251 191 36); /* amber-400 */
          color: rgb(0 0 0); /* black text for better contrast */
        }

        /* Background Radial Gradients Animation */
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        /* Link Underline Animation */
        h3:hover::after,
        a:hover::after {
          width: 100%;
        }

        /* Logo Line Slide Animation */
        h2 span {
          transition: width 0.5s ease-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;