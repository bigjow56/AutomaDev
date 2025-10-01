import { useState, useEffect, useRef } from "react";
import "./hero-slider.css";
import AutomaDevSlide from "./slides/automaDev-slide";
import AIHeroSlide from "./slides/ai-hero-slide";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSlides = 2;
  const autoplayDelay = 8000; // 8 segundos

  // Auto-play functionality with self-scheduling
  useEffect(() => {
    if (isPaused) return;

    autoplayTimerRef.current = setTimeout(() => {
      nextSlide();
    }, autoplayDelay);

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [currentSlide, isPaused]);

  // Cleanup transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => setIsTransitioning(false), 800);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => setIsTransitioning(false), 800);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => setIsTransitioning(false), 800);
  };

  return (
    <div 
      className="hero-slider-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-slider-container">
        {/* Slide 1 - AutomaDev Original */}
        <div
          className={`hero-slide ${currentSlide === 0 ? "active" : ""} ${
            currentSlide === 0 ? "fade-in" : "fade-out"
          }`}
          data-testid="slide-automadev"
        >
          <AutomaDevSlide />
        </div>

        {/* Slide 2 - IA & Automação */}
        <div
          className={`hero-slide ${currentSlide === 1 ? "active" : ""} ${
            currentSlide === 1 ? "fade-in" : "fade-out"
          }`}
          data-testid="slide-ai"
        >
          <AIHeroSlide />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="slider-arrow slider-arrow-left"
        onClick={prevSlide}
        aria-label="Slide anterior"
        data-testid="button-prev-slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button
        className="slider-arrow slider-arrow-right"
        onClick={nextSlide}
        aria-label="Próximo slide"
        data-testid="button-next-slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="slider-dots" data-testid="slider-dots">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
            data-testid={`dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
