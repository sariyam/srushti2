import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { Language } from "../types";
import { useStudioConfig, FALLBACK_HERO_SLIDES, HeroSlide } from "../context/StudioConfigContext";

interface HeroCarouselProps {
  lang: Language;
  badge?: string;
  tagline?: string;
}

const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ lang, badge, tagline }) => {
  const { heroSlides } = useStudioConfig();
  const slides: HeroSlide[] = useMemo(
    () => (heroSlides && heroSlides.length > 0 ? heroSlides : FALLBACK_HERO_SLIDES),
    [heroSlides]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const defaultBadge =
    lang === "en"
      ? "AI Photoshoot for Home Sellers & Small Shops"
      : "హోమ్ బిజినెస్‌లు & చిన్న షాపుల కోసం ఏఐ ఫోటోషూట్";

  const defaultTagline =
    lang === "en"
      ? "Turn Phone Photos into Studio-Quality Model Shoots"
      : "ఫోన్ ఫోటోలను అందమైన మోడల్ షూట్‌గా మార్చేయండి";

  const displayBadge = badge || defaultBadge;
  const displayTagline = tagline || defaultTagline;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, slides.length]);

  const current = slides[currentIndex] || slides[0] || FALLBACK_HERO_SLIDES[0];

  return (
    <div
      id="hero-fashion-carousel"
      className="relative w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden nm-outset p-2 sm:p-3 bg-[var(--bg-secondary)] group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 16:9 Aspect Ratio Container with Stacked Text Overlay */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center nm-inset-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={current.image}
              alt={lang === "en" ? current.titleEn : current.titleTe}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.08]"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (current.fallback && target.src !== current.fallback) {
                  target.src = current.fallback;
                }
              }}
            />

            {/* Scrim Overlay Gradient for Crystal-Clear Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />
            <div className="absolute inset-0 bg-black/20 backdrop-brightness-95" />
          </motion.div>
        </AnimatePresence>

        {/* --- STACKED TEXT OVERLAY: BADGE & TAGLINE ON TOP OF MIDDLE HEADER IMAGES --- */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-10 max-w-3xl mx-auto space-y-2.5 sm:space-y-4 pointer-events-none">
          {/* Eyebrow badge stacked on top */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] sm:text-xs md:text-sm font-black text-accent shadow-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent animate-spin-slow shrink-0" />
            <span className="tracking-wide">{displayBadge}</span>
          </motion.div>

          {/* Main Headline stacked on middle header images */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight sm:leading-snug"
          >
            {displayTagline}
          </motion.h1>
        </div>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-6 sm:w-8 bg-accent shadow-md shadow-accent/50"
                  : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
