import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { Language } from "../types";

interface HeroCarouselProps {
  lang: Language;
  badge?: string;
  tagline?: string;
}

const ChevronLeft = (props: any) => <Icon icon="lucide:chevron-left" {...props} />;
const ChevronRight = (props: any) => <Icon icon="lucide:chevron-right" {...props} />;
const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const Camera = (props: any) => <Icon icon="lucide:camera" {...props} />;

const SLIDES = [
  {
    id: "slide-saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=1600&h=900",
    fallback: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=85&w=1600&h=900",
    titleEn: "Royal Kanjeevaram Silk Saree Shoot",
    titleTe: "రాయల్ కాంచీపురం పట్టుచీరల స్టూడియో షూట్",
    tagEn: "Heritage Studio Lighting",
    tagTe: "హెరిటేజ్ స్టూడియో లైటింగ్",
    highlightEn: "Authentic Indian Model • 100% Studio Clarity",
    highlightTe: "భారతీయ మోడల్ • పర్ఫెక్ట్ స్టూడియో క్వాలిటీ",
  },
  {
    id: "slide-lehenga",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=85&w=1600&h=900",
    fallback: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=85&w=1600&h=900",
    titleEn: "Designer Lehenga & Boutique Couture",
    titleTe: "డిజైనర్ లెహంగా & బోటిక్ ఫ్యాషన్ షూట్",
    tagEn: "Editorial Runway Lighting",
    tagTe: "ఎడిటోరియల్ రన్‌వే లైటింగ్",
    highlightEn: "Vibrant Fabric Textures • Instant Catalog Ready",
    highlightTe: "స్పష్టమైన ఫ్యాబ్రిక్ డిటైల్స్ • క్యాటలాగ్ రెడీ",
  },
  {
    id: "slide-jewelry",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=85&w=1600&h=900",
    fallback: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=85&w=1600&h=900",
    titleEn: "Temple Jewelry & Luxury Gold Editorial",
    titleTe: "టెంపుల్ జ్యువెలరీ & గోల్డ్ ఆభరణాల ఫోటోషూట్",
    tagEn: "Velvet Macro Lighting",
    tagTe: "లగ్జరీ వెల్వెట్ లైటింగ్",
    highlightEn: "Glint & Micro Refraction • Zero Studio Setup",
    highlightTe: "మెరిసే గోల్డ్ రిఫ్లెక్షన్ • జీరో స్టూడియో ఖర్చు",
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ lang, badge, tagline }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const defaultBadge =
    lang === "en"
      ? "AI Product Photography for Local & Home Businesses"
      : "స్థానిక & గృహ వ్యాపారాల కోసం ఏఐ ప్రొడక్ట్ ఫోటోగ్రఫీ";

  const defaultTagline =
    lang === "en"
      ? "Turn Phone Photos into Studio-Quality Model Shoots"
      : "మొబైల్ ఫోటోలను రాయల్ స్టూడియో మోడల్ షూట్‌గా మార్చండి";

  const displayBadge = badge || defaultBadge;
  const displayTagline = tagline || defaultTagline;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused]);

  const current = SLIDES[currentIndex];

  return (
    <div
      id="hero-fashion-carousel"
      className="relative w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden nm-outset p-1.5 sm:p-2.5 bg-[var(--bg-panel)] border border-black/5 dark:border-white/10 group select-none shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 16:9 Aspect Ratio Container with Stacked Text Overlay */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center">
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
                if (target.src !== current.fallback) {
                  target.src = current.fallback;
                }
              }}
            />

            {/* Scrim Overlay Gradient for Crystal-Clear Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/70" />
            <div className="absolute inset-0 bg-black/20 backdrop-brightness-95" />

            {/* Top Badges */}
            <div className="absolute top-2.5 sm:top-4 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between pointer-events-none z-20">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] sm:text-[11px] font-bold text-amber-300 shadow-md">
                <Camera className="w-3 h-3 text-amber-400" />
                <span>{lang === "en" ? current.tagEn : current.tagTe}</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-accent text-white text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow-md">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Srushti Studio AI</span>
              </div>
            </div>

            {/* Bottom Content / Slide Detail */}
            <div className="absolute bottom-2.5 sm:bottom-4 left-3 sm:left-5 right-16 sm:right-24 text-left text-white pointer-events-none space-y-0.5 z-20">
              <h3 className="text-xs sm:text-sm md:text-base font-extrabold tracking-tight drop-shadow-md text-neutral-200 truncate">
                {lang === "en" ? current.titleEn : current.titleTe}
              </h3>
              <p className="text-[9px] sm:text-[11px] text-neutral-300 font-medium drop-shadow flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{lang === "en" ? current.highlightEn : current.highlightTe}</span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- STACKED TEXT OVERLAY: BADGE & TAGLINE ON TOP OF MIDDLE HEADER IMAGES --- */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-10 max-w-3xl mx-auto space-y-2.5 sm:space-y-4 pointer-events-none">
          {/* Eyebrow badge stacked on top */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-accent/40 text-[10px] sm:text-xs md:text-sm font-black text-accent shadow-xl"
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

        {/* Carousel Navigation Arrows */}
        <button
          id="carousel-prev-btn"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-xl z-30"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          id="carousel-next-btn"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-xl z-30"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-2.5 right-3 sm:bottom-3 sm:right-5 flex items-center gap-1.5 z-30">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-5 sm:w-7 bg-amber-400 shadow-sm"
                  : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
