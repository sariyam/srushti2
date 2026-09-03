import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { Language } from "../types";

interface QuoteSliderProps {
  lang: Language;
}

const QuoteIcon = (props: any) => <Icon icon="lucide:quote" {...props} />;
const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;

const QUOTES = [
  {
    id: "quote-1",
    en: {
      text: "“You pick and craft wonderful products with care. We make sure they look like top showroom shoots so customers fall in love at first glance!”",
      author: "Supporting Home Sellers & Resellers",
    },
    te: {
      text: "“మీరు ఎంతో ఇష్టపడి తెచ్చిన వస్తువులు సాధారణ ఫోటోలతో వెలవెలబోకూడదు. కస్టమర్లు చూడగానే 'వావ్ చాలా బాగుంది' అని మెచ్చేలా చేద్దాం!”",
      author: "హోమ్ బిజినెస్ మిత్రులకు ఎల్లప్పుడూ తోడుగా",
    },
  },
  {
    id: "quote-2",
    en: {
      text: "“You don't need lakhs in the bank or costly studio lights. Your hard work deserves to shine just like big fashion brands.”",
      author: "For Local Boutiques & Crafters",
    },
    te: {
      text: "“స్టూడియోలకు వేలకు వేలు ఖర్చు పెట్టే పనేలేదు. మీ కష్టానికి తగ్గ అందమైన మోడల్ లుక్ ఇప్పుడు మీ చేతిలోని ఫోన్ లోనే!”",
      author: "స్థానిక బోటిక్‌లు & షాపుల కోసం",
    },
  },
  {
    id: "quote-3",
    en: {
      text: "“No more hesitation before sharing photos on WhatsApp or Instagram. Post with total pride, get instant trust, and close orders fast!”",
      author: "More Trust • Happy Customers • Instant Orders",
    },
    te: {
      text: "“వాట్సాప్ స్టేటస్ లేదా ఇన్‌స్టాలో గర్వంగా పోస్ట్ చేయండి. ఫోటో చూసి కస్టమర్లు వెంటనే నమ్మకంతో ఆర్డర్ పెట్టేస్తారు.”",
      author: "కస్టమర్ల నమ్మకం & వేగవంతమైన ఆర్డర్లు",
    },
  },
];

export const QuoteSlider: React.FC<QuoteSliderProps> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextQuote();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused]);

  const currentQuote = QUOTES[currentIndex][lang];

  return (
    <div
      id="quote-banner-slider"
      className="relative nm-outset rounded-3xl p-6 sm:p-8 bg-[var(--bg-primary)] text-center max-w-4xl mx-auto border border-black/5 dark:border-white/5 select-none overflow-hidden transition-all shadow-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Quote Background Glyph */}
      <div className="absolute top-3 left-4 sm:left-6 text-accent/15 dark:text-accent/10 pointer-events-none">
        <QuoteIcon className="w-10 h-10 sm:w-12 sm:h-12 rotate-180" />
      </div>
      <div className="absolute bottom-3 right-4 sm:right-6 text-accent/15 dark:text-accent/10 pointer-events-none">
        <QuoteIcon className="w-10 h-10 sm:w-12 sm:h-12" />
      </div>

      <div className="relative min-h-[95px] sm:min-h-[85px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={QUOTES[currentIndex].id + "-" + lang}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="space-y-2.5 px-6 sm:px-12"
          >
            <p className="text-sm sm:text-base md:text-lg font-semibold italic text-[var(--text-emphasis)] leading-relaxed tracking-wide">
              {currentQuote.text}
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-accent tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-accent animate-pulse" />
              <span>{currentQuote.author}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4 pt-1">
        {QUOTES.map((quote, idx) => (
          <button
            key={quote.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to quote ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "w-6 sm:w-8 bg-accent shadow-sm"
                : "w-2 bg-black/20 dark:bg-white/20 hover:bg-accent/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
