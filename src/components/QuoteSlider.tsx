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
      text: "“You focus on creating and sourcing the best products. We'll make sure the world sees their true beauty.”",
      author: "Srushti Promise to Creators & Home Businesses",
    },
    te: {
      text: "“మీరు అద్భుతమైన ఉత్పత్తులను సృష్టించడంపై దృష్టి పెట్టండి. వాటిని ప్రపంచానికి అత్యంత అందంగా చూపించే బాధ్యత మాది.”",
      author: "క్రియేటర్లు & గృహ వ్యాపారులకు సృష్టి వాగ్దానం",
    },
  },
  {
    id: "quote-2",
    en: {
      text: "“Big budgets don't define great businesses — your passion, craft, and quality do. Every piece you create deserves royal presentation.”",
      author: "Empowering Local Boutiques & Artisans",
    },
    te: {
      text: "“భారీ బడ్జెట్లతో వ్యాపార ఘనత రాదు — మీ శ్రమ, ప్రతిభ మరియు నాణ్యతే మీ బలం. మీరు రూపొందించే ప్రతి వస్తువుకు రాయల్ ప్రెజెంటేషన్ దక్కాలి.”",
      author: "స్థానిక బోటిక్‌లు & కళాకారులకు నిజమైన తోడ్పాటు",
    },
  },
  {
    id: "quote-3",
    en: {
      text: "“Turn casual inquiries into lifelong loyal customers with images that build instant trust on WhatsApp & Instagram.”",
      author: "Building Buyer Trust & Growing Orders",
    },
    te: {
      text: "“కస్టమర్లకు మొదటి చూపులోనే నమ్మకాన్ని కలిగించి, మీ కష్టాన్ని గర్వంగా చాటిచెప్పే ఫోటోలతో వాట్సాప్ & ఇన్‌స్టాలో ఆర్డర్లు పెంచుకోండి.”",
      author: "నమ్మకమైన వ్యాపారం & ఆర్డర్ల అభివృద్ధి",
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
      className="relative nm-inset rounded-2xl p-4 sm:p-6 bg-black/5 dark:bg-black/20 text-center max-w-3xl mx-auto border border-black/5 dark:border-white/5 select-none overflow-hidden transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Quote Background Glyph */}
      <div className="absolute top-2 left-3 sm:left-5 text-accent/15 dark:text-accent/10 pointer-events-none">
        <QuoteIcon className="w-8 h-8 sm:w-10 sm:h-10 rotate-180" />
      </div>
      <div className="absolute bottom-2 right-3 sm:right-5 text-accent/15 dark:text-accent/10 pointer-events-none">
        <QuoteIcon className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>

      <div className="relative min-h-[90px] sm:min-h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={QUOTES[currentIndex].id + "-" + lang}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="space-y-2 px-6 sm:px-10"
          >
            <p className="text-xs sm:text-sm md:text-base font-semibold italic text-[var(--text-emphasis)] leading-relaxed tracking-wide">
              {currentQuote.text}
            </p>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-accent tracking-wider uppercase">
              <Sparkles className="w-2.5 h-2.5 text-accent animate-pulse" />
              <span>{currentQuote.author}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3 pt-1">
        {QUOTES.map((quote, idx) => (
          <button
            key={quote.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to quote ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "w-6 bg-accent shadow-sm"
                : "w-2 bg-black/20 dark:bg-white/20 hover:bg-accent/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
