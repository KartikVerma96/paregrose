'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Hide any carousel dots/indicators and add animated gradient styles
if (typeof document !== 'undefined') {
  const styleId = 'carousel-hide-dots';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Hide any carousel dots/indicators */
      [role="region"][aria-label="Carousel"] button[aria-label*="slide"],
      [role="region"][aria-label="Carousel"] button[aria-label*="Go to"],
      [role="region"][aria-label="Carousel"] .carousel-dots,
      [role="region"][aria-label="Carousel"] .carousel-indicators,
      [role="region"][aria-label="Carousel"] button.rounded-full[class*="bg-black"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      
      /* Animated gradient for carousel title */
      @keyframes gradient-shift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      .carousel-title-gradient {
        background: linear-gradient(
          135deg,
          #ffffff 0%,
          #fef3c7 8%,
          #fde68a 16%,
          #fbbf24 24%,
          #f59e0b 32%,
          #ea580c 40%,
          #f97316 48%,
          #fb923c 56%,
          #fbbf24 64%,
          #fcd34d 72%,
          #fde68a 80%,
          #fef3c7 88%,
          #ffffff 96%,
          #fef3c7 100%
        );
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 5s ease infinite;
      }
    `;
    document.head.appendChild(style);
  }
}

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch carousel slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/carousel');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          // Transform database format to component format
          const transformedSlides = result.data.map(slide => ({
            src: slide.image_url,
            width: 1200,
            height: 600,
            alt: slide.alt_text || slide.title,
            text: slide.title,
            subtext: slide.subtext || '',
            offer: slide.offer_text || '',
            buttonText: slide.button_text || 'Shop Now',
            buttonLink: slide.button_link || '/shop',
          }));
          setSlides(transformedSlides);
        } else {
          // Fallback to default slides if no data
          setSlides([
            {
              src: '/images/carousel/carousel_1.jpg',
              width: 1200,
              height: 600,
              alt: 'Worldwide Shipping Banner',
              text: 'Worldwide Shipping',
              subtext: 'Get Free Gift On Prepaid Order',
              offer: 'Get Up to 20% on Prepaid Orders',
              buttonText: 'Shop Now',
              buttonLink: '/shop',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching carousel slides:', error);
        // Fallback to default slides on error
        setSlides([
          {
            src: '/images/carousel/carousel_1.jpg',
            width: 1200,
            height: 600,
            alt: 'Worldwide Shipping Banner',
            text: 'Worldwide Shipping',
            subtext: 'Get Free Gift On Prepaid Order',
            offer: 'Get Up to 20% on Prepaid Orders',
            buttonText: 'Shop Now',
            buttonLink: '/shop',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Preload all images to prevent white flash
  useEffect(() => {
    if (slides.length === 0) return;
    
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
  }, [slides]);

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
    if (slides.length <= 1) return; // Don't auto-play if only one slide
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Don't render if loading or no slides
  if (loading || slides.length === 0) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-none bg-black"
        style={{ marginTop: '-120px', border: 'none', height: 'calc(90vh + 120px)' }}
        role="region"
        aria-label="Carousel">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">Loading carousel...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-none bg-black"
      style={{ marginTop: '-120px', border: 'none' }}
      role="region"
      aria-label="Carousel">
      {/* Images wrapper - Hotstar style fade effect */}
      <div className="relative w-full h-[calc(90vh+120px)] sm:h-[calc(95vh+120px)] md:h-[calc(100vh+120px)] lg:h-[calc(100vh+120px)] overflow-hidden bg-black">
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
            
            {/* Text content with stunning design */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 md:px-8"
              style={{ 
                top: '120px', 
                bottom: 0,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.6s ease-out 0.2s',
                willChange: 'opacity',
                zIndex: 15
              }}>
              
              {/* Decorative accent line */}
              <div 
                className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6 sm:mb-8 rounded-full"
                style={{
                  transform: isActive 
                    ? 'scaleX(1) translateY(0)' 
                    : 'scaleX(0) translateY(-30px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, opacity 0.6s ease-out 0.2s',
                  willChange: 'transform, opacity',
                  boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)'
                }}
              />

              {/* Main heading with animated gradient text */}
              <h1 
                className="carousel-title-gradient text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-3 sm:mb-5 md:mb-6 leading-tight"
                style={{
                  textShadow: '0 0 40px rgba(251, 191, 36, 0.3), 0 0 80px rgba(251, 191, 36, 0.2)',
                  transform: isActive 
                    ? 'translateY(0) scale(1)' 
                    : 'translateY(50px) scale(0.9)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 0.8s ease-out 0.3s',
                  willChange: 'transform, opacity',
                  letterSpacing: '-0.02em',
                  filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.5))'
                }}>
                {slide.text}
              </h1>

              {/* Subtext with elegant styling */}
              <p 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-2 sm:mt-3 font-light tracking-wide"
                style={{
                  color: '#fef3c7',
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 191, 36, 0.3)',
                  transform: isActive 
                    ? 'translateY(0)' 
                    : 'translateY(30px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s, opacity 0.8s ease-out 0.5s',
                  willChange: 'transform, opacity',
                  fontWeight: 300,
                  letterSpacing: '0.05em'
                }}>
                {slide.subtext}
              </p>

              {/* Offer text with badge style */}
              <div 
                className="mt-4 sm:mt-6 md:mt-8 inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-md border border-amber-300/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  transform: isActive 
                    ? 'translateY(0) scale(1)' 
                    : 'translateY(30px) scale(0.95)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s, opacity 0.8s ease-out 0.7s',
                  willChange: 'transform, opacity'
                }}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L13.586 7H4a1 1 0 110-2h9.586l-1.293-1.293a1 1 0 010-1.414zm-6 10a1 1 0 010 1.414L4.414 13H14a1 1 0 110 2H4.414l1.293 1.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p 
                  className="text-sm sm:text-base md:text-lg font-semibold text-amber-200"
                  style={{
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                  }}>
                  {slide.offer}
                </p>
              </div>

              {/* CTA Button with stunning design */}
              <a
                href={slide.buttonLink || '/shop'}
                className="mt-8 sm:mt-10 md:mt-12 group relative overflow-hidden px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-full font-bold text-base sm:text-lg md:text-xl transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                  boxShadow: '0 10px 40px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  transform: isActive 
                    ? 'translateY(0) scale(1)' 
                    : 'translateY(40px) scale(0.9)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s, opacity 0.8s ease-out 0.9s, box-shadow 0.3s ease',
                  willChange: 'transform, opacity',
                  color: '#1f2937',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                }}
                aria-label={`${slide.buttonText || 'Shop now'} for ${slide.text}`}>
                <span className="relative z-10 flex items-center gap-2">
                  {slide.buttonText || 'Shop Now'}
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                {/* Shine effect */}
                <span 
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                  }}
                />
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
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 85%, rgba(255, 255, 255, 0.7) 95%, rgba(255, 255, 255, 0.9) 98%, rgba(255, 255, 255, 1) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 80%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 80%, black 100%)',
            zIndex: 11
          }}
        />
      </div>

    </div>
  );
};

export default Carousel;
