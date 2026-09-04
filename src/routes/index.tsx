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
const MailIcon = (props: any) => <Icon icon="lucide:mail" {...props} />;

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
      priceOffer: "Photos starting at just ₹1 — No monthly plans, just recharge whenever you need",
      subtext: "Why spend ₹30,000 on studio lights and models? Take a simple phone photo of your sarees, boutique dresses, jewelry, or handmade items at home. Srushti AI puts them on real models in stunning studio lighting in seconds.",
      ctaPrimary: "Launch Srushti",
      ctaPricing: "Launch Srushti",
      stat1Val: "From ₹1",
      stat1Lbl: "Per photo",
      stat2Val: "Zero Plans",
      stat2Lbl: "No monthly fees or lock-ins",
      stat3Val: "30 Seconds",
      stat3Lbl: "Ready to share on WhatsApp & Insta",
      showcaseHeading: "Simple Phone Pic vs Studio Model Shoot",
      showcaseDesc: "See how a quick photo taken on your bed or table turns directly into a showroom catalogue pic.",
      garmentTab: "Sarees & Dresses",
      jewelryTab: "Jewelry & Ornaments",
      lifestyleTab: "Handmade & Home Items",
      supportBadge: "Made with love for Home Sellers & Small Shops",
      supportHeading: "Your hard work shouldn't look like a simple phone snap",
      supportDesc: "You put your heart into picking the prettiest sarees, designing dresses, or handcrafting items. You don't need a ₹50,000 studio budget to get respect and orders on WhatsApp and Instagram.",
      pillar1Title: "Share on WhatsApp & Insta with Full Confidence",
      pillar1Desc: "No more feeling shy before sending pics to customers. Post photos that look just like top designer brand shoots on your WhatsApp status and Instagram reels.",
      pillar2Title: "Turn 'Price Please?' into Confirmed Orders",
      pillar2Desc: "When customers see how the saree drapes on a model or how jewelry shines in studio light, their doubts vanish and they order immediately.",
      pillar3Title: "Zero Studio Costs — Your Profit Stays Yours",
      pillar3Desc: "Big showrooms spend lakhs on models and cameras. Srushti AI gives you that exact royal look right on your phone starting from ₹1.",
      quoteText: "“You focus on bringing the best products. We'll make sure they look stunning to every buyer.”",
      stepsTitle: "Just 3 Easy Steps",
      step1: "1. Snap on Phone",
      step1Desc: "Take a simple photo on your bed, table, or shop counter.",
      step2: "2. Pick Your Look",
      step2Desc: "Choose Indian models, rich velvet stands, or neat studio backgrounds.",
      step3: "3. Download & Share",
      step3Desc: "Get crisp HD photos ready to share on WhatsApp and Instagram.",
      footerText: "Srushti AI — Helping home sellers and local shops take stunning model photos in seconds.",
      termsLabel: "Terms and Conditions",
      privacyLabel: "Privacy Policy",
      contactLabel: "Contact: hi@srushti-ai.com",
    },
    te: {
      badge: "హోమ్ బిజినెస్‌లు & చిన్న షాపుల కోసం ఏఐ ఫోటోషూట్",
      tagline: "ఫోన్ ఫోటోలను అందమైన మోడల్ షూట్‌గా మార్చేయండి",
      priceOffer: "రూ. 1/- నుంచే ఫోటోషూట్ — ఎలాంటి నెలవారీ ఫీజులు లేవు, కావలసినప్పుడు రీఛార్జ్ చేసుకోండి",
      subtext: "స్టూడియోలకు, మోడల్స్‌కి వేలకు వేలు ఖర్చు పెట్టాల్సిన పనేలేదు. ఇంట్లో బెడ్‌పై లేదా టేబుల్‌పై తీసిన చీరలు, డ్రెస్సులు, జ్యువెలరీ ఫోటోలను సృష్టి ఏఐ క్షణాల్లో రిచ్ మోడల్ ఫోటోలుగా మార్చేస్తుంది.",
      ctaPrimary: "Launch Srushti",
      ctaPricing: "Launch Srushti",
      stat1Val: "రూ. 1/- నుంచే",
      stat1Lbl: "ఒక్కో ఫోటోకి",
      stat2Val: "జీరో ఫీజులు",
      stat2Lbl: "నెలవారీ కట్లు ఏమీ ఉండవు",
      stat3Val: "30 సెకన్లు",
      stat3Lbl: "వాట్సాప్ & ఇన్‌స్టాలో పోస్ట్ చేయవచ్చు",
      showcaseHeading: "సాధారణ ఫోన్ ఫోటో vs స్టూడియో మోడల్ లుక్",
      showcaseDesc: "ఇంట్లో తీసిన ఫోటో క్షణాల్లో పెద్ద బ్రాండ్ల క్యాటలాగ్‌లా ఎలా మారుతుందో మీరే చూడండి.",
      garmentTab: "చీరలు & డ్రెస్సులు",
      jewelryTab: "ఆభరణాలు & జ్యువెలరీ",
      lifestyleTab: "చేతివస్తువులు & హోమ్ ప్రొడక్ట్స్",
      supportBadge: "ఇంటి నుంచి బిజినెస్ చేసే వాళ్లకు & చిన్న షాపులకు పూర్తి తోడుగా",
      supportHeading: "మీ కష్టపడి తెచ్చిన వస్తువులు సాధారణ ఫోటోలతో వెలవెలబోకూడదు",
      supportDesc: "మీరు ఎంతో ఇష్టపడి తెచ్చిన చీరలు, కుట్టిన దుస్తులు, చేతితో చేసిన వస్తువులు కస్టమర్లకి చూడగానే నచ్చాలి. వాట్సాప్, ఇన్‌స్టాలో పెద్ద బ్రాండ్‌లా కనిపించడానికి భారీ స్టూడియో ఖర్చులు అక్కర్లేదు.",
      pillar1Title: "వాట్సాప్, ఇన్‌స్టాలో గర్వంగా షేర్ చేయండి",
      pillar1Desc: "కస్టమర్లకి ఫోటోలు పంపేటప్పుడు ఇక ఏమాత్రం సందేహం అక్కర్లేదు. పెద్ద పెద్ద షోరూమ్‌ల లాంటి మోడల్ డ్రేపింగ్ ఫోటోలతో మీ వాట్సాప్ స్టేటస్ నింపేయండి.",
      pillar2Title: "చూడగానే నచ్చి వెంటనే ఆర్డర్లు ఇస్తారు",
      pillar2Desc: "చీర కట్టుకుంటే ఎలా ఉంటుంది, జ్యువెలరీ ఎలా మెరుస్తుందో స్పష్టంగా కనిపించడం వల్ల కస్టమర్ల అనుమానాలు పోయి వెంటనే కొంటారు.",
      pillar3Title: "స్టూడియో ఖర్చు సున్నా — మీ లాభం మీ జేబులోనే",
      pillar3Desc: "పెద్ద కంపెనీలు మోడల్స్, కెమెరాల కోసం లక్షలు ఖర్చు చేస్తాయి. సృష్టి ఏఐతో ఆ లుక్ మీకు కేవలం ₹1 నుంచే మీ చేతుల్లోకి వస్తుంది.",
      quoteText: "“మీరు మంచి ప్రొడక్ట్స్ ఎంపిక చేయడంపై దృష్టి పెట్టండి. వాటిని కస్టమర్లకు ఎంత అందంగా చూపాలో ఆ బాధ్యత మాది.”",
      stepsTitle: "కేవలం 3 చిన్న స్టెప్పులు",
      step1: "1. ఫోన్‌తో ఫోటో తీయండి",
      step1Desc: "మీ ఇంట్లోని టేబుల్ లేదా బెడ్‌పై పెట్టి ఫోన్‌తో ఒక ఫోటో తీయండి.",
      step2: "2. మోడల్ లేదా బ్యాక్‌గ్రౌండ్ ఎంచుకోండి",
      step2Desc: "ఇండియన్ మోడల్స్ లేదా రిచ్ వెల్వెట్ స్టాండ్స్‌ని సెలెక్ట్ చేసుకోండి.",
      step3: "3. డౌన్‌లోడ్ చేసి షేర్ చేసుకోండి",
      step3Desc: "సూపర్ క్లారిటీ ఫోటోను డౌన్‌లోడ్ చేసి వాట్సాప్, ఇన్‌స్టాలో పోస్ట్ చేయండి.",
      footerText: "సృష్టి ఏఐ — హోమ్ బిజినెస్‌లు మరియు లోకల్ షాపుల కోసం సులభమైన ఏఐ ఫోటోషూట్.",
      termsLabel: "Terms and Conditions",
      privacyLabel: "Privacy Policy",
      contactLabel: "Contact: hi@srushti-ai.com",
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
              className="px-2.5 py-1.5 rounded-xl nm-outset bg-[var(--bg-secondary)] text-xs font-bold text-[var(--text-primary)] hover:text-accent flex items-center gap-1.5 transition-all"
            >
              <GlobeIcon className="w-3.5 h-3.5 text-accent" />
              <span>{lang === "en" ? "తెలుగు" : "English"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl nm-outset bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-accent transition-all"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <MoonIcon className="w-4 h-4 text-accent" /> : <SunIcon className="w-4 h-4 text-accent" />}
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
        <div className="max-w-xl mx-auto nm-outset rounded-2xl p-3.5 bg-[var(--bg-secondary)] flex items-center justify-center gap-3.5 text-left">
          <div className="w-9 h-9 rounded-xl nm-inset bg-[var(--bg-secondary)] text-accent flex items-center justify-center font-black text-sm shrink-0">
            ₹1
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black text-[var(--text-emphasis)] block leading-tight">
              {t.priceOffer}
            </span>
            <span className="text-[10px] text-accent font-bold flex items-center gap-1 mt-0.5">
              <BadgeCheck className="w-3 h-3 text-accent" />
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
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl nm-outset bg-[var(--bg-secondary)] text-xs sm:text-sm font-extrabold text-[var(--text-primary)] hover:text-accent hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ZapIcon className="w-4 h-4 text-accent" />
            <span>{lang === "en" ? "See Transformation" : "ఫలితం చూడండి"}</span>
          </a>
        </div>

        {/* 3 Quick Value Stats */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-4 max-w-2xl mx-auto">
          <div className="nm-outset rounded-2xl p-3 sm:p-4 bg-[var(--bg-secondary)] text-center">
            <span className="text-sm sm:text-lg font-black text-accent block tracking-tight">{t.stat1Val}</span>
            <span className="text-[9.5px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stat1Lbl}</span>
          </div>
          <div className="nm-outset rounded-2xl p-3 sm:p-4 bg-[var(--bg-secondary)] text-center">
            <span className="text-sm sm:text-lg font-black text-accent block tracking-tight">{t.stat2Val}</span>
            <span className="text-[9.5px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stat2Lbl}</span>
          </div>
          <div className="nm-outset rounded-2xl p-3 sm:p-4 bg-[var(--bg-secondary)] text-center">
            <span className="text-sm sm:text-lg font-black text-accent block tracking-tight">{t.stat3Val}</span>
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
          <div className="inline-flex rounded-2xl nm-inset p-1 mt-2 flex-wrap justify-center gap-1 bg-[var(--bg-secondary)]">
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
        <div className="nm-outset rounded-3xl p-3 sm:p-5 bg-[var(--bg-secondary)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Left: Raw Phone Snapshot (The Problem) */}
            <div className="nm-inset rounded-2xl p-3 bg-[var(--bg-secondary)] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-[var(--text-secondary)]">
                <div className="flex items-center gap-1">
                  <SmartphoneIcon className="w-3.5 h-3.5" />
                  <span>{lang === "en" ? "1. Your Phone Snapshot" : "1. మీ ఫోన్ ఫోటో"}</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg nm-inset text-[8.5px] font-bold text-[var(--text-secondary)]">Raw / Home Light</span>
              </div>

              <div className="aspect-[3/4] min-h-[220px] rounded-xl relative overflow-hidden bg-neutral-900">
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

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[8.5px] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
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
            <div className="nm-inset rounded-2xl p-3 bg-[var(--bg-secondary)] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-accent">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>{lang === "en" ? "2. Srushti AI Studio Result" : "2. సృష్టి ఏఐ స్టూడియో ఫలితం"}</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg nm-outset text-accent text-[8.5px] font-black uppercase">HD Studio</span>
              </div>

              <div className="aspect-[3/4] min-h-[220px] rounded-xl relative overflow-hidden bg-neutral-900 shadow-md">
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

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-accent text-[8.5px] font-black uppercase flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-accent" />
                  <span>{activeShowcase === "lifestyle" ? "Marble Editorial" : "Indian Model Shoot"}</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2.5 pt-6 text-white text-left space-y-0.5">
                  <div className="flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="text-xs font-black text-white">
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
          <div className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
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
        <div className="nm-outset rounded-3xl p-5 sm:p-8 bg-[var(--bg-secondary)] space-y-6 sm:space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full nm-inset bg-[var(--bg-secondary)] text-[10.5px] sm:text-xs font-black text-accent">
              <HeartHandshake className="w-3.5 h-3.5 text-accent shrink-0" />
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
                <div className="w-10 h-10 rounded-2xl nm-inset bg-[var(--bg-secondary)] flex items-center justify-center text-accent">
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
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent px-2.5 py-1 rounded-lg nm-inset-sm">
                  <BadgeCheck className="w-3 h-3 text-accent" />
                  <span>WhatsApp & Instagram Ready</span>
                </span>
              </div>
            </div>

            {/* Pillar 2: Conversion & Trust */}
            <div className="nm-outset rounded-2xl p-4 sm:p-5 bg-[var(--bg-secondary)] space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl nm-inset bg-[var(--bg-secondary)] flex items-center justify-center text-accent">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.pillar2Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                  {t.pillar2Desc}
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent px-2.5 py-1 rounded-lg nm-inset-sm">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>High-Converting Catalogue</span>
                </span>
              </div>
            </div>

            {/* Pillar 3: Zero Financial Burden */}
            <div className="nm-outset rounded-2xl p-4 sm:p-5 bg-[var(--bg-secondary)] space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl nm-inset bg-[var(--bg-secondary)] flex items-center justify-center text-accent">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.pillar3Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                  {t.pillar3Desc}
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent px-2.5 py-1 rounded-lg nm-inset-sm">
                  <Check className="w-3 h-3 text-accent" />
                  <span>Pay-as-you-go from ₹1</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- STANDALONE EMOTIONAL QUOTES CARD --- */}
      <section className="py-4 sm:py-6 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <QuoteSlider lang={lang} />
      </section>

      {/* --- 3-STEP WORKFLOW --- */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-1.5 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-black text-[var(--text-emphasis)]">
            {t.stepsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="nm-outset rounded-2xl p-5 bg-[var(--bg-secondary)] space-y-2.5">
            <div className="w-9 h-9 rounded-xl nm-inset bg-[var(--bg-secondary)] text-accent font-black text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="text-sm font-black text-[var(--text-emphasis)]">{t.step1}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="nm-outset rounded-2xl p-5 bg-[var(--bg-secondary)] space-y-2.5">
            <div className="w-9 h-9 rounded-xl nm-inset bg-[var(--bg-secondary)] text-accent font-black text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="text-sm font-black text-[var(--text-emphasis)]">{t.step2}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="nm-outset rounded-2xl p-5 bg-[var(--bg-secondary)] space-y-2.5">
            <div className="w-9 h-9 rounded-xl nm-inset bg-[var(--bg-secondary)] text-accent font-black text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="text-sm font-black text-[var(--text-emphasis)]">{t.step3}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* --- MINIMAL PRICING / WALLET STATEMENT & DIRECT ACTION --- */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-3xl mx-auto w-full text-center space-y-4">
        <div className="nm-outset rounded-3xl p-6 sm:p-10 bg-[var(--bg-secondary)] space-y-4">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider nm-inset bg-[var(--bg-secondary)] text-accent inline-block">
            {lang === "en" ? "Simple UPI Recharge" : "సులభమైన యూపీఐ పేమెంట్"}
          </span>

          <h2 className="text-xl sm:text-3xl font-black text-[var(--text-emphasis)]">
            {lang === "en" ? "Start Your First Photoshoot from Just ₹1" : "కేవలం రూ. 1/- నుంచే మీ ఫోటోషూట్ మొదలుపెట్టండి"}
          </h2>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto font-medium leading-relaxed">
            {lang === "en"
              ? "No monthly plans or hidden charges. Just add a few rupees using Google Pay or PhonePe whenever you get new stock."
              : "నెలనెలా కట్టాల్సిన పనేలేదు. కొత్త స్టాక్ వచ్చినప్పుడు గూగుల్ పే లేదా ఫోన్‌పేతో చిన్న రీఛార్జ్ చేసుకొని వెంటనే ఫోటోలు రెడీ చేసుకోండి."}
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

      {/* --- FOOTER (COMPLIANCE & NAVIGATION) --- */}
      <footer className="mt-auto border-t border-black/10 dark:border-white/10 py-8 px-4 sm:px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <Logo />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                {t.footerText}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] opacity-60 mt-0.5">
                © 2026 Srushti AI. All rights reserved.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2.5 text-xs font-bold text-[var(--text-secondary)]">
            <Link to="/studio" className="hover:text-accent transition-colors">
              {lang === "en" ? "Studio" : "స్టూడియో"}
            </Link>
            <Link
              to="/terms-and-conditions"
              className="hover:text-accent transition-colors underline-offset-4 hover:underline"
            >
              {t.termsLabel}
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-accent transition-colors underline-offset-4 hover:underline"
            >
              {t.privacyLabel}
            </Link>
            <a
              href="mailto:hi@srushti-ai.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl nm-inset-sm text-accent font-extrabold hover:opacity-80 transition-all border border-accent/20"
            >
              <MailIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{t.contactLabel}</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
