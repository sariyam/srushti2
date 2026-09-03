import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { Language } from "../types";

interface HeroCarouselProps {
  lang: Language;
  badge?: string;
  tagline?: string;
}

const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;

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
      ? "AI Photoshoot for Home Sellers & Small Shops"
      : "హోమ్ బిజినెస్‌లు & చిన్న షాపుల కోసం ఏఐ ఫోటోషూట్";

  const defaultTagline =
    lang === "en"
      ? "Turn Phone Photos into Studio-Quality Model Shoots"
      : "ఫోన్ ఫోటోలను అందమైన మోడల్ షూట్‌గా మార్చేయండి";

  const displayBadge = badge || defaultBadge;
  const displayTagline = tagline || defaultTagline;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
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

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-6 sm:w-8 bg-amber-400 shadow-md"
                  : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
