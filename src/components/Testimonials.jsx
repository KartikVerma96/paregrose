"use client";
import Image from "next/image";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      image: "/images/carousel/pic_1.jpg",
      rating: 5.0,
      review:
        "Absolutely stunning saree! The quality and craftsmanship are top-notch. Highly recommend for any special occasion.",
      date: "Sep 10, 2025",
    },
    {
      id: 2,
      name: "Rohan Mehra",
      image: "/images/carousel/pic_2.jpg",
      rating: 4.7,
      review:
        "The delivery was super fast, and the lehenga saree exceeded my expectations. Great customer service too!",
      date: "Sep 8, 2025",
    },
    {
      id: 3,
      name: "Anjali Patel",
      image: "/images/carousel/pic_1.jpg",
      rating: 4.5,
      review:
        "Beautiful design and comfortable fit. Perfect for Karwa Chauth. Will shop again!",
      date: "Sep 5, 2025",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [direction, setDirection] = useState("next");

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i + 1 <= rating ? "text-amber-500" : "text-gray-300"}
        size={14}
      />
    ));

  const nextTestimonial = () => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection("prev");
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 
                           rounded-full text-amber-700 text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-amber-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              Customer Reviews
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from real customers who love our products and service
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
            <div className="h-1 w-2 bg-amber-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
          </div>
        </motion.div>

        <div className="relative">
        <AnimatePresence mode="wait">
          {isDesktop ? (
            // ================= DESKTOP VIEW (3 Columns + Outside Arrows) =================
            <div className="relative">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: direction === "next" ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "next" ? -100 : 100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10"
              >
                {testimonials
                  .slice(currentIndex, currentIndex + 3)
                  .map((testimonial) => (
                    <motion.div
                      key={testimonial.id}
                      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 overflow-hidden rounded-full mr-4 border-2 border-amber-500">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-800">
                            {testimonial.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {testimonial.review}
                      </p>
                    </motion.div>
                  ))}
              </motion.div>

              {/* Prev Button */}
              <button
                onClick={prevTestimonial}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all duration-300 z-20 cursor-pointer"
              >
                <FaChevronLeft size={20} />
              </button>

              {/* Next Button */}
              <button
                onClick={nextTestimonial}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all duration-300 z-20 cursor-pointer"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          ) : (
            // ================= MOBILE & TABLET VIEW (Prev | Card | Next) =================
            <div className="flex items-center justify-center space-x-4 relative">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-amber-600 transition-all duration-300 z-20 cursor-pointer"
              >
                <FaChevronLeft size={18} />
              </button>

              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: direction === "next" ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "next" ? -100 : 100 }}
                transition={{ duration: 0.5 }}
                className="flex-1 max-w-sm bg-white border border-gray-100 rounded-xl p-5 shadow-md relative z-10"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 overflow-hidden rounded-full mr-4 border-2 border-amber-500">
                    <Image
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {testimonials[currentIndex].date}
                    </p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {testimonials[currentIndex].review}
                </p>
              </motion.div>

              <button
                onClick={nextTestimonial}
                className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-amber-600 transition-all duration-300 z-20"
              >
                <FaChevronRight size={18} />
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${
                currentIndex === idx ? "bg-amber-500" : "bg-gray-300"
              } hover:bg-amber-400 transition-colors duration-300`}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
