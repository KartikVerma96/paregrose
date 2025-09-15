'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const Carousel = () => {
  const slides = [
    {
      src: '/images/carousel/carousel_1.jpg',
      width: 1200,
      height: 600,
      alt: 'Worldwide Shipping Banner',
      text: 'Worldwide Shipping',
      subtext: 'Get Free Gift On Prepaid Order',
      offer: 'Get Up to 20% on Prepaid Orders',
    },
    {
      src: '/images/carousel/pic_2.jpg',
      width: 1200,
      height: 600,
      alt: 'Festive Navratri Collection',
      text: 'Festive Collection',
      subtext: 'Explore Our Navratri Chaniya Choli',
      offer: 'Exclusive Designs for Garba Nights',
    },
    {
      src: '/images/carousel/pic_3.jpg',
      width: 1200,
      height: 600,
      alt: 'Saree Collection',
      text: 'Elegant Sarees',
      subtext: 'Discover Our Banarasi & Kanjivaram Sarees',
      offer: 'Perfect for Weddings & Festivities',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Go to previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Go to next slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Auto-play every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="relative w-full max-w-[85vw] mx-auto mt-10 overflow-hidden rounded-2xl shadow-lg"
      role="region"
      aria-label="Carousel">
      {/* Images wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <Image
              src={slide.src}
              width={slide.width}
              height={slide.height}
              alt={slide.alt}
              className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] object-cover brightness-50"
              priority={index === 0} // Optimize LCP for first image
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">{slide.text}</h1>
              <p className="text-lg sm:text-xl md:text-2xl mt-2 sm:mt-4">{slide.subtext}</p>
              <p className="text-base sm:text-lg md:text-xl mt-1 sm:mt-2">{slide.offer}</p>
              <a
                href="/shop"
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition"
                aria-label={`Shop now for ${slide.text}`}>
                Shop Now
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black transition focus:outline-none focus:ring-2 focus:ring-yellow-500"
        aria-label="Previous slide">
        <FaChevronLeft size={20} />
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black transition focus:outline-none focus:ring-2 focus:ring-yellow-500"
        aria-label="Next slide">
        <FaChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              i === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
