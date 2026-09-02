import React, { useState, useEffect } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import { Logo } from "../components/Logo";
import { HeroCarousel } from "../components/HeroCarousel";
import { QuoteSlider } from "../components/QuoteSlider";
import { Language } from "../types";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPageComponent,
});

// Icons
const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const ArrowRight = (props: any) => <Icon icon="lucide:arrow-right" {...props} />;
const Check = (props: any) => <Icon icon="lucide:check" {...props} />;
const SunIcon = (props: any) => <Icon icon="lucide:sun" {...props} />;
const MoonIcon = (props: any) => <Icon icon="lucide:moon" {...props} />;
const GlobeIcon = (props: any) => <Icon icon="lucide:globe" {...props} />;
const CameraIcon = (props: any) => <Icon icon="lucide:camera" {...props} />;
const ShirtIcon = (props: any) => <Icon icon="lucide:shirt" {...props} />;
const GemIcon = (props: any) => <Icon icon="lucide:gem" {...props} />;
const PackageIcon = (props: any) => <Icon icon="lucide:package" {...props} />;
const SmartphoneIcon = (props: any) => <Icon icon="lucide:smartphone" {...props} />;
const BadgeCheck = (props: any) => <Icon icon="lucide:badge-check" {...props} />;
const ZapIcon = (props: any) => <Icon icon="lucide:zap" {...props} />;
const HeartHandshake = (props: any) => <Icon icon="lucide:heart-handshake" {...props} />;
const Share2Icon = (props: any) => <Icon icon="lucide:share-2" {...props} />;
const ShieldCheck = (props: any) => <Icon icon="lucide:shield-check" {...props} />;
const TrendingUp = (props: any) => <Icon icon="lucide:trending-up" {...props} />;

function LandingPageComponent() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("srushti_theme");
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  });

  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("srushti_lang");
      return (saved as Language) || "en";
    }
    return "en";
  });

  const [activeShowcase, setActiveShowcase] = useState<"garment" | "jewelry" | "lifestyle">("garment");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("srushti_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("srushti_lang", lang);
  }, [lang]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const content = {
    en: {
      badge: "AI Product Photography for Local & Home Businesses",
      tagline: "Turn Phone Photos into Studio-Quality Model Shoots",
      priceOffer: "Get your image starting from ₹1 — No subscriptions needed, just recharge & generate",
      subtext: "Eliminate ₹30,000+ studio and model fees. Upload a casual phone snapshot of your sarees, boutique apparel, jewelry, or handmade products — Srushti AI renders them on authentic models in royal studio lighting in seconds.",
      ctaPrimary: "Launch Srushti",
      ctaPricing: "Launch Srushti",
      stat1Val: "Starting ₹1",
      stat1Lbl: "Pay per image",
      stat2Val: "Zero",
      stat2Lbl: "Subscriptions / Lock-ins",
      stat3Val: "30 Seconds",
      stat3Lbl: "Ready for WhatsApp & Insta",
      showcaseHeading: "The Problem & The Instant Solution",
      showcaseDesc: "See how everyday flat-lay phone shots turn directly into luxury commercial catalogues.",
      garmentTab: "Sarees & Fashion",
      jewelryTab: "Jewelry & Ornaments",
      lifestyleTab: "Home & Handmade Goods",
      supportBadge: "Made with Heart for Home Creators & Small Businesses",
      supportHeading: "Your Hard Work Deserves to Look as Precious as It Truly Is",
      supportDesc: "Behind every handpicked saree, boutique design, or handcrafted product lies countless hours of dedication. You shouldn't need a ₹50,000 studio budget to be taken seriously on WhatsApp & Instagram.",
      pillar1Title: "Share with Unshakable Confidence",
      pillar1Desc: "Never hesitate before sending a catalogue picture to a buyer. Share photos that look like a top-tier luxury brand shoot on WhatsApp statuses and Instagram feeds.",
      pillar2Title: "Turn Casual Inquiries into Confirmed Orders",
      pillar2Desc: "Clear model drapes, true-to-life fabric textures, and studio lighting remove buyer doubts, helping customers visualize the real product and order instantly.",
      pillar3Title: "Zero Financial Burden — Your Profit Stays Yours",
      pillar3Desc: "Big retail brands spend lakhs on professional models, cameras, and studios. Srushti AI brings that exact high-end power directly to your hands starting from ₹1.",
      quoteText: "“You focus on creating and sourcing the best products. We'll make sure the world sees their true beauty.”",
      stepsTitle: "How It Works in 3 Simple Steps",
      step1: "1. Snap on Phone",
      step1Desc: "Take a flat-lay picture on your bed, table, or shop counter.",
      step2: "2. Pick Model & Scene",
      step2Desc: "Select Indian models, velvet display stands, or sunlit editorial setups.",
      step3: "3. Download High-Res Visual",
      step3Desc: "Get WhatsApp & Instagram catalogue-ready photos that convert orders.",
      footerText: "Srushti AI — Empowering local boutiques, home entrepreneurs, and artisans with instant studio photography.",
    },
    te: {
      badge: "స్థానిక & గృహ వ్యాపారాల కోసం ఏఐ ప్రొడక్ట్ ఫోటోగ్రఫీ",
      tagline: "మొబైల్ ఫోటోలను రాయల్ స్టూడియో మోడల్ షూట్‌గా మార్చండి",
      priceOffer: "రూ. 1/- నుంచే మీ ప్రొడక్ట్ ఇమేజ్ — ఎటువంటి సబ్‌స్క్రిప్షన్ అవసరం లేదు, రీఛార్జ్ చేసి వెంటనే జనరేట్ చేసుకోండి",
      subtext: "మోడల్స్ మరియు ఫోటోగ్రాఫర్లకు వేలకు వేలు ఖర్చు చేయాల్సిన పనిలేదు. మీ చీరలు, బొటిక్ దుస్తులు మరియు ఆభరణాల సాధారణ ఫోన్ ఫోటోలను క్షణాల్లో అద్భుతమైన స్టూడియో ఫోటోషూట్‌గా మార్చండి.",
      ctaPrimary: "Launch Srushti",
      ctaPricing: "Launch Srushti",
      stat1Val: "రూ. 1/- నుంచే",
      stat1Lbl: "ప్రతి ఫోటోకు ఖర్చు",
      stat2Val: "జీరో",
      stat2Lbl: "నెలవారీ చందా ఏదీ లేదు",
      stat3Val: "30 సెకన్లు",
      stat3Lbl: "వాట్సాప్ & ఇన్‌స్టా రెడీ",
      showcaseHeading: "సమస్య & తక్షణ పరిష్కారం",
      showcaseDesc: "సాధారణ మొబైల్ ఫోటో క్షణాల్లో ఎలా లగ్జరీ స్టూడియో ఫోటోగా మారుతుందో చూడండి.",
      garmentTab: "చీరలు & ఫ్యాషన్",
      jewelryTab: "ఆభరణాలు & జ్యువెలరీ",
      lifestyleTab: "హోమ్ & చేతివృత్తులు",
      supportBadge: "గృహ మహిళా పారిశ్రామికవేత్తలు & చిన్న వ్యాపారులకు తోడుగా",
      supportHeading: "మీ కష్టానికి దక్కాల్సిన నిజమైన రాయల్ గుర్తింపు",
      supportDesc: "మీరు ఎంతో శ్రద్ధతో ఎంపిక చేసిన చీరలు, డిజైన్ చేసిన దుస్తులు మరియు చేతితో తయారుచేసిన ప్రొడక్ట్స్ సాధారణ ఫోటోలతో వెలవెలబోకూడదు. భారీ స్టూడియో ఖర్చులు లేకుండానే మీ కస్టమర్లను ఆకట్టుకోండి.",
      pillar1Title: "గర్వంగా వాట్సాప్ & ఇన్‌స్టాలో షేర్ చేయండి",
      pillar1Desc: "కస్టమర్లకు వాట్సాప్‌లో ఫోటోలు పంపేటప్పుడు ఇక ఏమాత్రం సందేహం అక్కర్లేదు. పెద్ద బ్రాండ్లలా మెరిసే రాయల్ మోడల్ డ్రేపింగ్‌తో నమ్మకాన్ని పెంచండి.",
      pillar2Title: "క్యాటలాగ్ చూడగానే వేగంగా ఆర్డర్లు",
      pillar2Desc: "స్పష్టమైన మోడల్ లుక్, క్లాత్ టెక్స్చర్ మరియు రిచ్ స్టూడియో వెలుగుతో కస్టమర్లలో సందేహాలు తొలగి, ఎంక్వైరీలు వెంటనే ఆర్డర్లుగా మారతాయి.",
      pillar3Title: "జీరో బడ్జెట్ భారం — మీ లాభం మీదే",
      pillar3Desc: "పెద్ద బ్రాండ్లు లక్షలు ఖర్చు చేసే ఫోటోషూట్లను, గృహ పారిశ్రామికవేత్తలు కేవలం ₹1 నుంచే తమ చేతుల్లోకి తీసుకురావడమే సృష్టి ఏఐ లక్ష్యం.",
      quoteText: "“మీరు అద్భుతమైన ఉత్పత్తులను సృష్టించడంపై దృష్టి పెట్టండి. వాటిని ప్రపంచానికి అత్యంత అందంగా చూపించే బాధ్యత మాది.”",
      stepsTitle: "3 సులభమైన దశల్లో ఫోటోషూట్",
      step1: "1. ఫోన్‌తో ఫోటో తీయండి",
      step1Desc: "మీ ఇంటి టేబుల్ లేదా బెడ్‌పై ఉన్న ప్రొడక్ట్ ఫోటో తీయండి.",
      step2: "2. మోడల్ & స్టైల్ ఎంచుకోండి",
      step2Desc: "భారతీయ మోడల్స్ లేదా లగ్జరీ వెల్వెట్ స్టాండ్స్‌ను ఎంపిక చేయండి.",
      step3: "3. హై-రెజల్యూషన్ ఫోటో డౌన్‌లోడ్ చేయండి",
      step3Desc: "వాట్సాప్ క్యాటలాగ్ మరియు ఇన్‌స్టాగ్రామ్ కోసం వెంటనే వాడుకోండి.",
      footerText: "సృష్టి ఏఐ — స్థానిక మరియు గృహ వ్యాపారుల కోసం సులభమైన స్టూడియో ఫోటోగ్రఫీ.",
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col font-sans">
      
      {/* --- MINIMAL HEADER --- */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-primary)]/90 border-b border-black/5 dark:border-white/5 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-[var(--text-emphasis)] block leading-none">
                Srushti AI
              </span>
              <span className="text-[9.5px] font-bold text-accent">Studio for Local Biz</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "te" : "en")}
              className="px-2.5 py-1.5 rounded-xl nm-outset text-xs font-bold text-[var(--text-primary)] hover:text-accent flex items-center gap-1.5 transition-all"
            >
              <GlobeIcon className="w-3.5 h-3.5 text-accent" />
              <span>{lang === "en" ? "తెలుగు" : "English"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl nm-outset flex items-center justify-center text-[var(--text-secondary)] hover:text-accent transition-all"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO: PROBLEM & SOLUTION AGENDA --- */}
      <section className="pt-2 pb-8 sm:pt-4 sm:pb-12 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-4 sm:space-y-6">
        
        {/* Landscape Fashion Carousel Slider with Stacked Text Overlay */}
        <div className="mb-2 sm:mb-4">
          <HeroCarousel lang={lang} badge={t.badge} tagline={t.tagline} />
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed">
          {t.subtext}
        </p>

        {/* ₹1 Highlight Banner */}
        <div className="max-w-xl mx-auto nm-outset rounded-2xl p-3 bg-gradient-to-r from-accent/10 via-amber-500/10 to-emerald-500/10 border border-accent/30 flex items-center justify-center gap-3 text-left">
          <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-accent/20">
            ₹1
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black text-[var(--text-emphasis)] block leading-tight">
              {t.priceOffer}
            </span>
            <span className="text-[10px] text-accent font-bold flex items-center gap-1 mt-0.5">
              <BadgeCheck className="w-3 h-3" />
              <span>UPI Instant Top-Up • No Monthly Lock-in • Lifetime Validity</span>
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/studio"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl nm-outset bg-[var(--bg-secondary)] text-accent text-sm sm:text-base font-black flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95 transition-all group"
          >
            <CameraIcon className="w-4 h-4 text-accent transition-transform group-hover:scale-110" />
            <span className="text-accent tracking-wide">{t.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 text-accent transition-transform group-hover:translate-x-0.5" />
          </Link>

          <a
            href="#live-transformation"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl nm-outset text-xs sm:text-sm font-extrabold text-[var(--text-primary)] hover:text-accent hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ZapIcon className="w-4 h-4 text-accent" />
            <span>{lang === "en" ? "See Transformation" : "ఫలితం చూడండి"}</span>
          </a>
        </div>

        {/* 3 Quick Value Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 max-w-2xl mx-auto">
          <div className="nm-outset rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-sm sm:text-lg font-black text-accent block">{t.stat1Val}</span>
            <span className="text-[9.5px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stat1Lbl}</span>
          </div>
          <div className="nm-outset rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-sm sm:text-lg font-black text-emerald-500 block">{t.stat2Val}</span>
            <span className="text-[9.5px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stat2Lbl}</span>
          </div>
          <div className="nm-outset rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-sm sm:text-lg font-black text-amber-500 block">{t.stat3Val}</span>
            <span className="text-[9.5px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stat3Lbl}</span>
          </div>
        </div>
      </section>

      {/* --- LIVE PROBLEM VS SOLUTION TRANSFORMATION (INTERACTIVE) --- */}
      <section id="live-transformation" className="py-8 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-3xl font-black text-[var(--text-emphasis)]">
            {t.showcaseHeading}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto font-medium">
            {t.showcaseDesc}
          </p>

          {/* Category Tabs */}
          <div className="inline-flex rounded-2xl nm-inset p-1 mt-2 flex-wrap justify-center gap-1">
            <button
              id="tab-sarees-fashion"
              onClick={() => setActiveShowcase("garment")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                activeShowcase === "garment"
                  ? "nm-outset bg-[var(--bg-secondary)] text-accent shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-accent"
              }`}
            >
              <ShirtIcon className={`w-3.5 h-3.5 ${activeShowcase === "garment" ? "text-accent" : ""}`} />
              <span>{t.garmentTab}</span>
            </button>
            <button
              id="tab-jewelry-ornaments"
              onClick={() => setActiveShowcase("jewelry")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                activeShowcase === "jewelry"
                  ? "nm-outset bg-[var(--bg-secondary)] text-accent shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-accent"
              }`}
            >
              <GemIcon className={`w-3.5 h-3.5 ${activeShowcase === "jewelry" ? "text-accent" : ""}`} />
              <span>{t.jewelryTab}</span>
            </button>
            <button
              id="tab-home-handmade"
              onClick={() => setActiveShowcase("lifestyle")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                activeShowcase === "lifestyle"
                  ? "nm-outset bg-[var(--bg-secondary)] text-accent shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-accent"
              }`}
            >
              <PackageIcon className={`w-3.5 h-3.5 ${activeShowcase === "lifestyle" ? "text-accent" : ""}`} />
              <span>{t.lifestyleTab}</span>
            </button>
          </div>
        </div>

        {/* Side by Side Interactive Visual */}
        <div className="nm-outset rounded-3xl p-3 sm:p-5 bg-[var(--bg-primary)] border border-black/5 dark:border-white/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Left: Raw Phone Snapshot (The Problem) */}
            <div className="nm-inset rounded-2xl p-3 bg-black/5 dark:bg-black/20 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-[var(--text-secondary)]">
                <div className="flex items-center gap-1">
                  <SmartphoneIcon className="w-3.5 h-3.5" />
                  <span>{lang === "en" ? "1. Your Phone Snapshot" : "1. మీ ఫోన్ ఫోటో"}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[8.5px] font-bold">Raw / Home Light</span>
              </div>

              <div className="aspect-[3/4] min-h-[220px] rounded-xl relative overflow-hidden bg-neutral-900 border border-black/10 dark:border-white/10">
                {activeShowcase === "garment" && (
                  <img
                    src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800"
                    alt="Raw Saree Snapshot"
                    className="w-full h-full object-cover filter saturate-[0.85] brightness-[0.92]"
                    loading="lazy"
                  />
                )}
                {activeShowcase === "jewelry" && (
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
                    alt="Raw Jewelry Snapshot"
                    className="w-full h-full object-cover filter saturate-[0.8] brightness-[0.88]"
                    loading="lazy"
                  />
                )}
                {activeShowcase === "lifestyle" && (
                  <img
                    src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800"
                    alt="Raw Product Snapshot"
                    className="w-full h-full object-cover filter saturate-[0.85] brightness-[0.9]"
                    loading="lazy"
                  />
                )}

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[8.5px] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>PHONE CAM • TABLE LAY</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 pt-6 text-white text-left">
                  <span className="text-xs font-bold block">
                    {activeShowcase === "garment" && "Handloom Silk Saree on Bed"}
                    {activeShowcase === "jewelry" && "Temple Necklace on Countertop"}
                    {activeShowcase === "lifestyle" && "Handmade Soap & Candle on Table"}
                  </span>
                  <span className="text-[9px] text-neutral-300">
                    {lang === "en" ? "Casual indoor room lighting" : "గదిలో టేబుల్‌పై తీసిన సాధారణ ఫోటో"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Srushti AI Result (The Solution) */}
            <div className="nm-inset rounded-2xl p-3 bg-accent/5 space-y-2 border border-accent/30">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-accent">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === "en" ? "2. Srushti AI Studio Result" : "2. సృష్టి ఏఐ స్టూడియో ఫలితం"}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[8.5px] font-black uppercase">HD Studio</span>
              </div>

              <div className="aspect-[3/4] min-h-[220px] rounded-xl relative overflow-hidden bg-neutral-900 border border-accent/40 shadow-lg shadow-accent/10">
                {activeShowcase === "garment" && (
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"
                    alt="AI Studio Model Saree"
                    className="w-full h-full object-cover object-top filter contrast-[1.05]"
                    loading="lazy"
                  />
                )}
                {activeShowcase === "jewelry" && (
                  <img
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
                    alt="AI Studio Jewelry Velvet"
                    className="w-full h-full object-cover object-center filter contrast-[1.05]"
                    loading="lazy"
                  />
                )}
                {activeShowcase === "lifestyle" && (
                  <img
                    src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800"
                    alt="AI Studio Marble Product"
                    className="w-full h-full object-cover object-center filter contrast-[1.05]"
                    loading="lazy"
                  />
                )}

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-accent text-white text-[8.5px] font-black uppercase shadow-md flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{activeShowcase === "lifestyle" ? "Marble Editorial" : "Indian Model Shoot"}</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2.5 pt-6 text-white text-left space-y-0.5">
                  <div className="flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="text-xs font-black text-amber-200">
                      {activeShowcase === "garment" && "Royal Model Runway Drape"}
                      {activeShowcase === "jewelry" && "Luxury Velvet Bust Shoot"}
                      {activeShowcase === "lifestyle" && "Sunlit Marble Pedestal Scene"}
                    </span>
                  </div>
                  <p className="text-[9px] text-neutral-200 font-semibold">
                    {lang === "en" ? "Studio Lighting • Ready for Social Media" : "స్టూడియో లైటింగ్ • సోషల్ మీడియా రెడీ"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Studio Trigger under preview */}
          <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-bold text-[var(--text-secondary)]">
              {lang === "en" ? "Ready to transform your own collection?" : "మీ స్వంత ఉత్పత్తులకు ఇప్పుడే ఫోటోషూట్ చేయండి"}
            </span>
            <Link
              to="/studio"
              className="px-5 py-2.5 rounded-xl nm-outset bg-[var(--bg-secondary)] text-accent text-xs font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all group"
            >
              <span className="text-accent">Launch Srushti</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- MINIMALIST EMOTIONAL & PSYCHOLOGICAL SUPPORT SECTION --- */}
      <section className="py-8 sm:py-14 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="nm-outset rounded-3xl p-5 sm:p-8 bg-[var(--bg-primary)] border border-black/5 dark:border-white/5 space-y-6 sm:space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full nm-outset text-[10.5px] sm:text-xs font-black text-rose-500 bg-rose-500/5 border border-rose-500/20">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{t.supportBadge}</span>
            </div>

            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[var(--text-emphasis)] tracking-tight leading-snug">
              {t.supportHeading}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] font-medium leading-relaxed">
              {t.supportDesc}
            </p>
          </div>

          {/* 3 Emotional Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Pillar 1: Social Media Confidence */}
            <div className="nm-outset rounded-2xl p-4 sm:p-5 bg-[var(--bg-secondary)] space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl nm-outset bg-[var(--bg-primary)] flex items-center justify-center text-accent">
                  <Share2Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.pillar1Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                  {t.pillar1Desc}
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                  <BadgeCheck className="w-3 h-3" />
                  <span>WhatsApp & Instagram Ready</span>
                </span>
              </div>
            </div>

            {/* Pillar 2: Conversion & Trust */}
            <div className="nm-outset rounded-2xl p-4 sm:p-5 bg-[var(--bg-secondary)] space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl nm-outset bg-[var(--bg-primary)] flex items-center justify-center text-amber-500">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.pillar2Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                  {t.pillar2Desc}
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Sparkles className="w-3 h-3" />
                  <span>High-Converting Catalogue</span>
                </span>
              </div>
            </div>

            {/* Pillar 3: Zero Financial Burden */}
            <div className="nm-outset rounded-2xl p-4 sm:p-5 bg-[var(--bg-secondary)] space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl nm-outset bg-[var(--bg-primary)] flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.pillar3Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                  {t.pillar3Desc}
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <Check className="w-3 h-3" />
                  <span>Pay-as-you-go from ₹1</span>
                </span>
              </div>
            </div>

          </div>

          {/* Emotional Quote Slider / Reassurance Banner */}
          <QuoteSlider lang={lang} />

        </div>
      </section>

      {/* --- 3-STEP WORKFLOW --- */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-1.5 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-black text-[var(--text-emphasis)]">
            {t.stepsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="nm-outset rounded-2xl p-4 bg-[var(--bg-primary)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-accent text-white font-black text-xs flex items-center justify-center shadow-md shadow-accent/20">
              1
            </div>
            <h3 className="text-sm font-black text-[var(--text-emphasis)]">{t.step1}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="nm-outset rounded-2xl p-4 bg-[var(--bg-primary)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/20">
              2
            </div>
            <h3 className="text-sm font-black text-[var(--text-emphasis)]">{t.step2}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="nm-outset rounded-2xl p-4 bg-[var(--bg-primary)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-emerald-500/20">
              3
            </div>
            <h3 className="text-sm font-black text-[var(--text-emphasis)]">{t.step3}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* --- MINIMAL PRICING / WALLET STATEMENT & DIRECT ACTION --- */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-3xl mx-auto w-full text-center space-y-4">
        <div className="nm-outset rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-accent/5 via-[var(--bg-primary)] to-emerald-500/5 border border-accent/30 space-y-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 inline-block">
            {lang === "en" ? "Simple Pay-As-You-Go" : "సులభమైన క్రెడిట్ రీఛార్జ్"}
          </span>

          <h2 className="text-xl sm:text-3xl font-black text-[var(--text-emphasis)]">
            {lang === "en" ? "Get Your First Image Starting from ₹1" : "రూ. 1/- నుంచే మీ ప్రొడక్ట్ ఫోటోషూట్"}
          </h2>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto font-medium leading-relaxed">
            {lang === "en"
              ? "Zero monthly subscription fees. Recharge your wallet anytime with UPI (Google Pay, PhonePe) and generate high-resolution shoots on demand."
              : "ఎటువంటి నెలవారీ చందాలు లేవు. యూపీఐతో రీఛార్జ్ చేసుకోండి మరియు ఎప్పుడైనా హై-క్వాలిటీ స్టూడియో ఫోటోలు జనరేట్ చేయండి."}
          </p>

          <div className="pt-2">
            <Link
              to="/studio"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl nm-outset bg-[var(--bg-secondary)] text-accent text-sm font-black hover:scale-105 active:scale-95 transition-all group"
            >
              <Sparkles className="w-4 h-4 text-accent transition-transform group-hover:scale-110" />
              <span className="text-accent tracking-wide">{t.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 text-accent transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="mt-auto border-t border-black/10 dark:border-white/10 py-6 px-4 sm:px-6 bg-[var(--bg-primary)] text-center sm:text-left">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xs font-bold text-[var(--text-secondary)]">
              {t.footerText}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-secondary)]">
            <Link to="/studio" className="hover:text-accent transition-colors">
              {lang === "en" ? "Studio" : "స్టూడియో"}
            </Link>
            <Link to="/terms" className="hover:text-accent transition-colors">
              {lang === "en" ? "Terms" : "నిబంధనలు"}
            </Link>
            <Link to="/privacy" className="hover:text-accent transition-colors">
              {lang === "en" ? "Privacy" : "గోప్యత"}
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
