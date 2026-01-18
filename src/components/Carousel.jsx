'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

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

  // Preload all images to prevent white flash
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = slides.map((slide, i) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve(i);
          img.onerror = () => resolve(i); // Continue even if image fails
          img.src = slide.src;
        });
      });
      await Promise.all(imagePromises);
    };
    loadImages();
  }, []);

  // Go to previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Go to next slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Handle dot click
  const goToSlide = (index) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
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
      className="relative w-full overflow-hidden rounded-none bg-black"
      style={{ marginTop: '-120px', border: 'none' }}
      role="region"
      aria-label="Carousel">
      {/* Images wrapper - Hotstar style fade effect */}
      <div className="relative w-full h-[calc(60vh+120px)] sm:h-[calc(70vh+120px)] md:h-[calc(80vh+120px)] lg:h-[calc(90vh+120px)] overflow-hidden bg-black">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const isNext = index === (currentIndex + 1) % slides.length;
          const isPrev = index === (currentIndex - 1 + slides.length) % slides.length;
          const shouldShow = isActive || isNext || isPrev; // Show current, next, and previous for smooth transition
          
          return (
          <div 
            key={index} 
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 10 : (shouldShow ? 5 : 0),
              transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'opacity'
            }}>
            {/* Image with parallax zoom effect */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                transform: isActive 
                  ? 'scale(1)' 
                  : 'scale(1.08)',
                transition: 'transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isActive ? 1 : 0,
                willChange: 'transform, opacity'
              }}>
              <Image
                src={slide.src}
                width={slide.width}
                height={slide.height}
                alt={slide.alt}
                className="w-full h-full object-cover brightness-[0.35]"
                style={{ objectPosition: 'center top' }}
                priority={index === 0}
                loading={index <= 1 ? 'eager' : 'lazy'}
              />
            </div>
            
            {/* Text content with Hotstar-style smooth slide animation */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
              style={{ 
                top: '120px', 
                bottom: 0,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.6s ease-out 0.2s',
                willChange: 'opacity'
              }}>
              <h1 
                className="text-3xl sm:text-4xl md:text-6xl font-bold drop-shadow-2xl mb-2 sm:mb-4"
                style={{
                  transform: isActive 
                    ? 'translateX(0)' 
                    : 'translateX(-120px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s, opacity 0.8s ease-out 0.3s',
                  willChange: 'transform, opacity'
                }}>
                {slide.text}
              </h1>
              <p 
                className="text-xl sm:text-2xl md:text-3xl mt-2 sm:mt-4 drop-shadow-xl font-medium"
                style={{
                  transform: isActive 
                    ? 'translateX(0)' 
                    : 'translateX(-120px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.45s, opacity 0.8s ease-out 0.45s',
                  willChange: 'transform, opacity'
                }}>
                {slide.subtext}
              </p>
              <p 
                className="text-base sm:text-lg md:text-xl mt-2 sm:mt-3 drop-shadow-lg"
                style={{
                  transform: isActive 
                    ? 'translateX(0)' 
                    : 'translateX(-120px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s, opacity 0.8s ease-out 0.6s',
                  willChange: 'transform, opacity'
                }}>
                {slide.offer}
              </p>
              <a
                href="/shop"
                className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-base sm:text-lg"
                style={{
                  transform: isActive 
                    ? 'translateX(0)' 
                    : 'translateX(-120px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.75s, opacity 0.8s ease-out 0.75s',
                  willChange: 'transform, opacity'
                }}
                aria-label={`Shop now for ${slide.text}`}>
                Shop Now
              </a>
            </div>
          </div>
        );
        })}
        
        {/* Gradual blur fade effect - multiple layers for smooth transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '250px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.05) 65%, rgba(255, 255, 255, 0.15) 75%, rgba(255, 255, 255, 0.3) 83%, rgba(255, 255, 255, 0.5) 90%, rgba(255, 255, 255, 0.7) 95%, rgba(255, 255, 255, 0.85) 98%, rgba(255, 255, 255, 1) 100%)',
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(0px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
            zIndex: 11
          }}
        />
        {/* Gradual blur layer 1 - light blur */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.4) 90%, rgba(255, 255, 255, 0.7) 97%, rgba(255, 255, 255, 1) 100%)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
            zIndex: 11
          }}
        />
        {/* Gradual blur layer 2 - medium blur */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '150px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 0.5) 92%, rgba(255, 255, 255, 0.85) 98%, rgba(255, 255, 255, 1) 100%)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 60%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 60%, black 100%)',
            zIndex: 11
          }}
        />
        {/* Gradual blur layer 3 - strong blur */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '100px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 80%, rgba(255, 255, 255, 0.6) 94%, rgba(255, 255, 255, 0.9) 98%, rgba(255, 255, 255, 1) 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 70%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 70%, black 100%)',
            zIndex: 11
          }}
        />
        {/* Gradual blur layer 4 - maximum blur at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '60px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 85%, rgba(255, 255, 255, 0.7) 95%, rgba(255, 255, 255, 1) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 80%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 80%, black 100%)',
            zIndex: 11
          }}
        />
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 w-full flex justify-center gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-500 ease-out ${
              i === currentIndex 
                ? 'w-10 h-2 bg-white shadow-lg scale-110' 
                : 'w-2 h-2 bg-white/60 hover:bg-white/80 hover:scale-110'
            }`}
            aria-label={`Go to slide ${i + 1}`}></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
