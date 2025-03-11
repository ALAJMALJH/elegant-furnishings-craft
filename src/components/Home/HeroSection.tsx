
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Timeless Elegance, Crafted for You",
    subtitle: "Discover our handcrafted luxury furniture collections",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    cta: "Shop Now",
    ctaLink: "/shop",
  },
  {
    id: 2,
    title: "Custom Furniture Made Perfect",
    subtitle: "Personalized pieces that tell your unique story",
    image: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89",
    cta: "Create Custom",
    ctaLink: "/custom-furniture",
  },
  {
    id: 3,
    title: "Summer Collection 2023",
    subtitle: "Bright ideas for your living spaces",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb",
    cta: "Explore Collection",
    ctaLink: "/collection/summer",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 7000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      goToNextSlide();
    }

    if (touchStart - touchEnd < -150) {
      goToPrevSlide();
    }
  };

  return (
    <section 
      className="relative h-screen-90 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          </div>
        ))}
      </div>

      <div className="container-custom h-full flex flex-col justify-center relative z-10">
        <div className="max-w-2xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-700 ease-in-out ${
                currentSlide === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute"
              }`}
            >
              {currentSlide === index && (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-playfair font-semibold leading-tight mb-4 text-balance">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-white/90 mb-8">{slide.subtitle}</p>
                  <Link
                    to={slide.ctaLink}
                    className="inline-block px-8 py-3.5 bg-furniture-accent text-furniture-dark font-medium text-lg tracking-wide rounded transition-all duration-300 hover:bg-white hover:shadow-lg"
                  >
                    {slide.cta}
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setCurrentSlide(index);
              setTimeout(() => setIsAnimating(false), 700);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white w-8" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
