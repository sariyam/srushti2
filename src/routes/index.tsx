import React, { useState, useEffect } from "react";
import { createRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "../components/Logo";
import { Language } from "../types";
import { isMobileStandalonePwa, usePwaInstall } from "../utils/pwautils";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (isMobileStandalonePwa()) {
      throw redirect({
        to: "/studio",
      });
    }
  },
  component: LandingPageComponent,
});

// Icon Helpers
const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const ArrowRight = (props: any) => <Icon icon="lucide:arrow-right" {...props} />;
const DownloadIcon = (props: any) => <Icon icon="lucide:download" {...props} />;
const Check = (props: any) => <Icon icon="lucide:check" {...props} />;
const SunIcon = (props: any) => <Icon icon="lucide:sun" {...props} />;
const MoonIcon = (props: any) => <Icon icon="lucide:moon" {...props} />;
const GlobeIcon = (props: any) => <Icon icon="lucide:globe" {...props} />;
const CameraIcon = (props: any) => <Icon icon="lucide:camera" {...props} />;
const ShirtIcon = (props: any) => <Icon icon="lucide:shirt" {...props} />;
const GemIcon = (props: any) => <Icon icon="lucide:gem" {...props} />;
const LayersIcon = (props: any) => <Icon icon="lucide:layers" {...props} />;
const ZapIcon = (props: any) => <Icon icon="lucide:zap" {...props} />;
const ShieldCheckIcon = (props: any) => <Icon icon="lucide:shield-check" {...props} />;
const UsersIcon = (props: any) => <Icon icon="lucide:users" {...props} />;
const WalletIcon = (props: any) => <Icon icon="lucide:wallet" {...props} />;
const StarIcon = (props: any) => <Icon icon="lucide:star" {...props} />;
const MenuIcon = (props: any) => <Icon icon="lucide:menu" {...props} />;
const XIcon = (props: any) => <Icon icon="lucide:x" {...props} />;
const BadgeCheck = (props: any) => <Icon icon="lucide:badge-check" {...props} />;
const ImageDown = (props: any) => <Icon icon="lucide:image-down" {...props} />;
const Sliders = (props: any) => <Icon icon="lucide:sliders" {...props} />;

function InstallAppBanner({ lang }: { lang: Language }) {
  const { canInstall, promptInstall } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <section className="border-t border-black/10 dark:border-white/10 py-8 sm:py-12 px-3 xs:px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl nm-inset-sm bg-accent/5 p-6 sm:p-8 border border-accent/20">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-white shadow-md shadow-accent/20">
              <DownloadIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--text-emphasis)] sm:text-lg">
                {lang === "en" ? "Get the Srushti AI app" : "సృష్టి AI యాప్‌ను ఇన్‌స్టాల్ చేసుకోండి"}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
                {lang === "en"
                  ? "Install Srushti AI on your device for quick, one-tap photoshoot access anytime."
                  : "ఎప్పుడైనా సులభంగా ఒక్క ట్యాప్‌తో ఫోటోషూట్ చేయడానికి మీ డివైజ్‌లో ఇన్‌స్టాల్ చేసుకోండి."}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-install-pwa-banner"
            onClick={promptInstall}
            className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <DownloadIcon className="h-4 w-4" />
            <span>{lang === "en" ? "Download now" : "ఇప్పుడే డౌన్‌లోడ్ చేయండి"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function LandingPageComponent() {
  const navigate = useNavigate();

  // Local theme state with auto-detection & persistence
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("srushti_theme");
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  });

  // Local language state
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("srushti_lang");
      return (saved as Language) || "en";
    }
    return "en";
  });

  const [activeShowcase, setActiveShowcase] = useState<"garment" | "jewelry">("garment");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const translations = {
    en: {
      badge: "AI Product Photography for Indian Artisans & Brands",
      headlineTitle: "Turn Simple Product Photos into",
      headlineHighlight: "High-Fashion Model Shoots",
      subtitle: "Empower your handloom sarees, kurtas, and handcrafted jewelry with studio-grade on-model visual campaigns in seconds — no expensive photographers or models needed.",
      ctaLaunch: "Launch AI Studio",
      ctaDemo: "Explore Demo",
      stats1: "10x Faster",
      stats1Sub: "Catalogue Production",
      stats2: "90% Cheaper",
      stats2Sub: "Than Traditional Shoots",
      stats3: "4K UHD",
      stats3Sub: "Print & Social Ready",
      stats4: "5+ Languages",
      stats4Sub: "Vernacular First",
      showcaseTitle: "Studio Quality In Three Clicks",
      showcaseSub: "Switch between Garment and Jewelry workspaces to see AI in action.",
      garmentTab: "Handloom & Garments",
      jewelryTab: "Jewelry & Ornaments",
      featuresTitle: "Crafted for Weavers, Boutique Owners & Jewelers",
      feature1Title: "Regional & Diverse Models",
      feature1Desc: "Choose authentic Indian models, diverse skin tones, regional expressions, and customizable hairstyles.",
      feature2Title: "Realistic Fabric & Drape Texture",
      feature2Desc: "Preserves delicate zari work, handwoven borders, silk textures, and embroidery with optical accuracy.",
      feature3Title: "Jewelry Velvet & Model Busts",
      feature3Desc: "Showcase gold necklaces, polki chokers, and diamond rings on premium velvet busts or real lifestyle models.",
      feature4Title: "Multi-Lingual Experience",
      feature4Desc: "Easily navigate in Telugu, Hindi, Tamil, Kannada, and English with dedicated voice & text prompt support.",
      howItWorksTitle: "How Srushti AI Works",
      step1Title: "1. Upload Product Image",
      step1Desc: "Snap a quick photo on your phone or upload a flat-lay picture of your saree, dress, or jewelry item.",
      step2Title: "2. Select Model & Ambience",
      step2Desc: "Pick male or female models, pose style, lighting mood, and heritage or minimalist studio backdrops.",
      step3Title: "3. Generate 4K Visuals",
      step3Desc: "Click generate to receive high-resolution, commercial-ready photos ready for Instagram, Amazon, or WhatsApp catalogue.",
      pricingTitle: "Simple, Pay-As-You-Go Credits",
      pricingSub: "Recharge with UPI, Cards, or Net Banking anytime. No monthly lock-in contracts.",
      plan1Title: "Starter Pack",
      plan1Credits: "100 Credits",
      plan1Desc: "Perfect for testing new collections and quick social media drops.",
      plan2Title: "Artisan Pro",
      plan2Credits: "500 Credits",
      plan2Desc: "Ideal for boutique owners and handloom weavers launching season catalogues.",
      plan3Title: "Enterprise Studio",
      plan3Credits: "2,000 Credits",
      plan3Desc: "For high-volume manufacturers, jewellery chains, and e-commerce brands.",
      testimonialsTitle: "Loved by 2,000+ Artisans Across India",
      testimonial1: "“Srushti AI changed our handloom business in Dharmavaram. We no longer spend ₹30,000 on studio models for every new silk saree launch!”",
      testimonial1Author: "Venkata Rao",
      testimonial1Role: "Master Weaver & Boutique Owner, AP",
      testimonial2: "“The jewelry lighting on our kundan and diamond sets looks like a luxury Vogue campaign. Our WhatsApp inquiries tripled in 2 weeks.”",
      testimonial2Author: "Pooja Mehta",
      testimonial2Role: "Fine Jewelry Designer, Surat",
      footerTagline: "Business to Brand - Transforming local craftsmanship into global luxury.",
      rights: "All rights reserved. Designed with passion for Indian artisans.",
    },
    te: {
      badge: "చేనేత కార్మికులు & ఆభరణాల వ్యాపారుల కోసం ఏఐ ఫోటోషూట్",
      headlineTitle: "మీ సాధారణ ఉత్పత్తులను మార్చండి",
      headlineHighlight: "రాయల్ మోడల్ ఫోటోషూట్ లా",
      subtitle: "ఖరీదైన మోడల్స్, కెమెరాలు మరియు స్టూడియో ఖర్చులు లేకుండా — క్షణాల్లో మీ పట్టు చీరలు, కుర్తాలు మరియు బంగారు ఆభరణాలకు హై-క్వాలిటీ ఫోటోలు రూపొందించండి.",
      ctaLaunch: "స్టూడియో ప్రారంభించండి",
      ctaDemo: "డెమో చూడండి",
      stats1: "10 రెట్లు వేగం",
      stats1Sub: "క్యాటలాగ్ తయారీ",
      stats2: "90% ఆదా",
      stats2Sub: "సాంప్రదాయ షూట్ కంటే",
      stats3: "4K అల్ట్రా HD",
      stats3Sub: "ప్రింట్ & సోషల్ మీడియాకు సిద్ధం",
      stats4: "తెలుగు సహా 5+ భాషలు",
      stats4Sub: "మీ ప్రాంతీయ భాషలో",
      showcaseTitle: "మూడు క్లిక్కుల్లో స్టూడియో నాణ్యత",
      showcaseSub: "గార్మెంట్స్ మరియు ఆభరణాల కోసం రూపొందించిన ప్రత్యేక ప్రదర్శన.",
      garmentTab: "చేనేత & దుస్తులు",
      jewelryTab: "బంగారు & వెండి ఆభరణాలు",
      featuresTitle: "చేనేత నేతన్నలు మరియు జ్యువెలర్స్ కోసం రూపొందించబడింది",
      feature1Title: "ప్రాంతీయ మరియు విభిన్న మోడల్స్",
      feature1Desc: "దక్షిణ భారత, ఉత్తర భారత సాంప్రదాయ మోడల్స్ మరియు ముఖకవళికలను సులభంగా ఎంచుకోండి.",
      feature2Title: "సహజమైన నేత మరియు జరీ మెరుపు",
      feature2Desc: "పట్టు చీరల జరీ అంచులు, నేత నైపుణ్యం మరియు రంగులు యథాతథంగా కనిపిస్తాయి.",
      feature3Title: "ఆభరణాల నెక్ బస్ట్స్ & మోడల్స్",
      feature3Desc: "నెక్లెస్‌లు, చెవిపోగులు మరియు ఉంగరాలను లగ్జరీ వెల్వెట్ బస్ట్‌లపై లేదా మోడల్స్‌పై అందంగా చూపించండి.",
      feature4Title: "పూర్తి తెలుగు మరియు బహుభాషా మద్దతు",
      feature4Desc: "తెలుగు, హిందీ, తమిళం, కన్నడ మరియు ఆంగ్లంలో ఎంతో సులభంగా ఉపయోగించండి.",
      howItWorksTitle: "సృష్టి ఏఐ ఎలా పనిచేస్తుంది?",
      step1Title: "1. ఉత్పత్తి ఫోటో అప్‌లోడ్ చేయండి",
      step1Desc: "మీ మొబైల్ కెమెరాతో తీసిన చీర లేదా ఆభరణాల ఫోటోను అప్‌లోడ్ చేయండి.",
      step2Title: "2. మోడల్ మరియు బ్యాక్‌గ్రౌండ్ ఎంచుకోండి",
      step2Desc: "మీకు నచ్చిన పోజ్, స్టూడియో లేదా ఆలయ బ్యాక్‌గ్రౌండ్ లైటింగ్‌ను ఎంపిక చేయండి.",
      step3Title: "3. 4K ఫోటోలను డౌన్‌లోడ్ చేయండి",
      step3Desc: "ఏఐ సిద్ధం చేసిన హై-రెజల్యూషన్ ఫోటోలను వాట్సాప్ మరియు ఆన్‌లైన్ సేల్స్ కోసం డౌన్‌లోడ్ చేయండి.",
      pricingTitle: "సులభమైన క్రెడిట్ పద్ధతి",
      pricingSub: "యూపీఐ ద్వారా సులభంగా రీఛార్జ్ చేసుకోండి. నెలవారీ చందా ఏదీ లేదు.",
      plan1Title: "స్టార్టర్ ప్యాక్",
      plan1Credits: "100 క్రెడిట్స్",
      plan1Desc: "కొత్త కలెక్షన్స్ మరియు సోషల్ మీడియా పోస్టులకు అనుకూలం.",
      plan2Title: "ఆర్టిసాన్ ప్రో",
      plan2Credits: "500 క్రెడిట్స్",
      plan2Desc: "బొటిక్ వ్యాపారులు మరియు చేనేత కార్మికులకు ఉత్తమమైనది.",
      plan3Title: "ఎంటర్‌ప్రైజ్ స్టూడియో",
      plan3Credits: "2,000 క్రెడిట్స్",
      plan3Desc: "పెద్ద ఎత్తున ఆభరణాల షోరూమ్‌లు మరియు ఈ-కామర్స్ బ్రాండ్‌ల కోసం.",
      testimonialsTitle: "2,000+ చేనేత కళాకారులు & వ్యాపారుల నమ్మకం",
      testimonial1: "“ధర్మవరంలో మా పట్టు చీరల వ్యాపారానికి సృష్టి ఏఐ ఎంతో సహాయపడింది. ప్రతి మోడల్‌కు వేలకు వేలు ఖర్చు చేయాల్సిన పని తప్పింది!”",
      testimonial1Author: "వెంకట రావు",
      testimonial1Role: "మాస్టర్ వీవర్, ఆంధ్రప్రదేశ్",
      testimonial2: "“మా కుందన్ మరియు వజ్రాల నెక్లెస్‌లు లగ్జరీ మ్యాగజైన్ కవర్‌లా కనిపిస్తున్నాయి. మా వాట్సాప్ ఆర్డర్లు రెట్టింపు అయ్యాయి.”",
      testimonial2Author: "పూజా మెహతా",
      testimonial2Role: "జ్యువెలరీ డిజైనర్, గుజరాత్",
      footerTagline: "బిజినెస్ టు బ్రాండ్ - స్థానిక నైపుణ్యాన్ని గ్లోబల్ బ్రాండ్‌గా మార్చండి.",
      rights: "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి. భారతీయ కళాకారుల కోసం రూపొందించబడింది.",
    },
  };

  const t = translations[lang === "te" ? "te" : "en"];

  const planFeatures = {
    plan1: [
      lang === "en" ? "4K Ultra-HD Downloads" : "4K అల్ట్రా-HD డౌన్‌లోడ్స్",
      lang === "en" ? "Garment & Jewelry Workspaces" : "గార్మెంట్స్ & జ్యువెలరీ స్టూడియో",
      lang === "en" ? "Standard Indian Models" : "స్టాండర్డ్ భారతీయ మోడల్స్",
      lang === "en" ? "Standard Processing Speed" : "స్టాండర్డ్ ప్రాసెసింగ్ స్పీడ్",
    ],
    plan2: [
      lang === "en" ? "All Starter Features" : "స్టార్టర్ ఫీచర్లు అన్నీ",
      lang === "en" ? "Custom Face Swap & Upload" : "కస్టమ్ ఫేస్ స్వాప్ & అప్‌లోడ్",
      lang === "en" ? "Luxury Velvet & Temple Backdrops" : "లగ్జరీ వెల్వెట్ & టెంపుల్ బ్యాక్‌గ్రౌండ్స్",
      lang === "en" ? "High Priority GPU Speed" : "హై ప్రయారిటీ సూపర్ ఫాస్ట్ ప్రాసెసింగ్",
      lang === "en" ? "Full Commercial Rights" : "పూర్తి కమర్షియల్ హక్కులు",
    ],
    plan3: [
      lang === "en" ? "All Artisan Pro Features" : "ఆర్టిసాన్ ప్రో ఫీచర్లు అన్నీ",
      lang === "en" ? "Batch High-Res Processing" : "బ్యాచ్ ప్రాసెసింగ్ సపోర్ట్",
      lang === "en" ? "Dedicated Account Manager" : "డెడికేటెడ్ అకౌంట్ సపోర్ట్",
      lang === "en" ? "Custom Brand Watermark Removal" : "వాటర్‌మార్క్ లేకుండా డౌన్‌లోడ్స్",
      lang === "en" ? "API Access for Web Stores" : "వెబ్‌సైట్ & స్టోర్ల కోసం API సపోర్ట్",
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-sans flex flex-col selection:bg-accent/20 selection:text-accent overflow-x-hidden">
      
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 px-3 xs:px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0">
            <Logo />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl font-black tracking-tight text-[var(--text-emphasis)] block leading-none group-hover:text-accent transition-colors">
                  Srushti AI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                  Studio
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] block mt-0.5">
                Business to Brand
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop & Large Tablet) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-extrabold text-[var(--text-secondary)]">
            <a href="#showcase" className="hover:text-accent transition-colors py-1">
              {lang === "en" ? "Showcase" : "ప్రదర్శన"}
            </a>
            <a href="#features" className="hover:text-accent transition-colors py-1">
              {lang === "en" ? "Features" : "ఫీచర్లు"}
            </a>
            <a href="#how-it-works" className="hover:text-accent transition-colors py-1">
              {lang === "en" ? "How It Works" : "ఎలా పనిచేస్తుంది"}
            </a>
            <a href="#pricing" className="hover:text-accent transition-colors py-1">
              {lang === "en" ? "Pricing" : "ధరలు"}
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Language Selector */}
            <div className="flex items-center rounded-xl nm-inset p-0.5 text-[10px] sm:text-[11px] font-bold">
              <button
                id="btn-nav-lang-te"
                onClick={() => setLang("te")}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === "te"
                    ? "bg-accent text-white font-extrabold shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-accent"
                }`}
                title="తెలుగు"
              >
                తెలుగు
              </button>
              <button
                id="btn-nav-lang-en"
                onClick={() => setLang("en")}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-accent text-white font-extrabold shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-accent"
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              id="btn-nav-theme-toggle"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl nm-outset text-xs font-bold flex items-center justify-center hover:text-accent transition-all cursor-pointer shrink-0"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <MoonIcon className="w-4 h-4 text-accent" /> : <SunIcon className="w-4 h-4 text-accent" />}
            </button>

            {/* Mobile / Tablet Menu Trigger */}
            <button
              id="btn-nav-mobile-menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl nm-outset text-[var(--text-emphasis)] hover:text-accent transition-all cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden pt-3 border-t border-black/10 dark:border-white/10 mt-2.5"
            >
              <div className="flex flex-col gap-2 p-2 rounded-2xl nm-inset-sm bg-black/5 dark:bg-black/20 text-xs font-bold text-[var(--text-primary)]">
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <span>{lang === "en" ? "Showcase & Demos" : "ప్రదర్శన & డెమోలు"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <span>{lang === "en" ? "Core Features" : "ఫీచర్లు & సామర్థ్యాలు"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <span>{lang === "en" ? "How It Works" : "ఎలా పనిచేస్తుంది"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <span>{lang === "en" ? "Pricing & Wallet Credits" : "ధరలు & క్రెడిట్స్"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-black/5 dark:border-white/5">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[550px] lg:w-[700px] h-[250px] sm:h-[350px] bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-6">
          
          {/* Eyebrow Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full nm-outset text-[10.5px] sm:text-xs font-black text-accent bg-accent/5 border border-accent/20 max-w-full"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 animate-spin-slow" />
            <span className="truncate">{t.badge}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[var(--text-emphasis)] leading-[1.2] sm:leading-[1.15]"
          >
            {t.headlineTitle}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-500 to-rose-500 block sm:inline mt-1 sm:mt-0">
              {t.headlineHighlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl lg:max-w-3xl mx-auto text-xs xs:text-sm sm:text-base md:text-lg text-[var(--text-secondary)] font-medium leading-relaxed px-2"
          >
            {t.subtitle}
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 max-w-md xs:max-w-none mx-auto px-4"
          >
            <Link
              id="btn-hero-launch-studio"
              to="/studio"
              className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-accent text-white text-xs sm:text-sm md:text-base font-black flex items-center justify-center gap-2.5 sm:gap-3 shadow-xl shadow-accent/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
            >
              <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>{t.ctaLaunch}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </Link>

            <a
              id="btn-hero-explore-demo"
              href="#showcase"
              className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl nm-outset text-xs sm:text-sm md:text-base font-extrabold text-[var(--text-primary)] hover:text-accent hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
            >
              <ZapIcon className="w-4 h-4 text-accent shrink-0" />
              <span>{t.ctaDemo}</span>
            </a>
          </motion.div>

          {/* Metric Stats Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-6 sm:pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
          >
            <div className="nm-outset rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-lg sm:text-2xl font-black text-accent block">{t.stats1}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stats1Sub}</span>
            </div>
            <div className="nm-outset rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-lg sm:text-2xl font-black text-emerald-500 block">{t.stats2}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stats2Sub}</span>
            </div>
            <div className="nm-outset rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-lg sm:text-2xl font-black text-amber-500 block">{t.stats3}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stats3Sub}</span>
            </div>
            <div className="nm-outset rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-lg sm:text-2xl font-black text-rose-500 block">{t.stats4}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stats4Sub}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- INTERACTIVE SHOWCASE SECTION --- */}
      <section id="showcase" className="py-12 sm:py-16 md:py-24 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-10">
          <h2 className="text-xl xs:text-2xl sm:text-4xl font-black text-[var(--text-emphasis)] tracking-tight">
            {t.showcaseTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto font-medium px-2">
            {t.showcaseSub}
          </p>

          {/* Tab Selector */}
          <div className="inline-flex rounded-2xl nm-inset p-1 sm:p-1.5 mt-2 sm:mt-4 max-w-full">
            <button
              id="btn-tab-garments"
              onClick={() => setActiveShowcase("garment")}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                activeShowcase === "garment"
                  ? "bg-accent text-white shadow-md font-black"
                  : "text-[var(--text-secondary)] hover:text-accent"
              }`}
            >
              <ShirtIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{t.garmentTab}</span>
            </button>

            <button
              id="btn-tab-jewelry"
              onClick={() => setActiveShowcase("jewelry")}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                activeShowcase === "jewelry"
                  ? "bg-accent text-white shadow-md font-black"
                  : "text-[var(--text-secondary)] hover:text-accent"
              }`}
            >
              <GemIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{t.jewelryTab}</span>
            </button>
          </div>
        </div>

        {/* Showcase Card Preview */}
        <div className="nm-outset rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bg-[var(--bg-primary)] border border-black/5 dark:border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left: Interactive Details & Preset Highlights */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <div>
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 inline-block mb-2 sm:mb-3">
                  {activeShowcase === "garment" ? "Garment AI Studio" : "Jewelry AI Studio"}
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-[var(--text-emphasis)] leading-snug">
                  {activeShowcase === "garment" 
                    ? (lang === "en" ? "Silk Sarees, Kurtas & Lehengas on Real Models" : "పట్టు చీరలు & కుర్తాలు రాయల్ మోడల్స్‌పై")
                    : (lang === "en" ? "Temple & Diamond Jewelry on Velvet Busts" : "వజ్రాల మరియు కుందన్ ఆభరణాల మెరుపు")}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 sm:mt-2 font-medium leading-relaxed">
                  {activeShowcase === "garment"
                    ? (lang === "en" 
                        ? "Seamlessly render silk sheen, heavy zari borders, and flowing pallus with natural model poses, temple backdrops, and studio key-lighting." 
                        : "జరీ అంచులు, సహజమైన పట్టు మెరుపు మరియు మోడల్ హావభావాలు అద్భుతంగా రూపొందుతాయి.")
                    : (lang === "en"
                        ? "Showcase necklace sets, drop earrings, and bangles with realistic diamond brilliance, gold reflections, and customizable luxury display velvet."
                        : "బంగారు మరియు వజ్రాల మెరుపును హై-ఎండ్ స్టూడియో లైటింగ్‌తో కస్టమర్లను ఆకట్టుకునేలా చూపించండి.")}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 sm:space-y-2.5">
                {(activeShowcase === "garment"
                  ? [
                      lang === "en" ? "Authentic Indian Female & Male Models" : "దక్షిణ మరియు ఉత్తర భారత మోడల్స్",
                      lang === "en" ? "Heritage Temple & Palace Courtyard Poses" : "సాంప్రదాయ ఆలయ & రాజభవన బ్యాక్‌గ్రౌండ్స్",
                      lang === "en" ? "True-to-Life Fabric Texture Preservation" : "పట్టు నేత మరియు జరీ నాణ్యత పరిరక్షణ",
                      lang === "en" ? "Custom Color Grading & Contrast Tuning" : "కలర్ గ్రేడింగ్ & కాంట్రాస్ట్ ఎంపికలు",
                    ]
                  : [
                      lang === "en" ? "Velvet & Marble Neck Bust Display Options" : "వెల్వెట్ & మార్బుల్ నెక్ బస్ట్ ఆప్షన్స్",
                      lang === "en" ? "Realistic Gold, Polki & Diamond Refractions" : "బంగారు మరియు డైమండ్ రిఫ్లెక్షన్స్",
                      lang === "en" ? "Model Lifestyle Neck & Earring Shots" : "మోడల్ లైఫ్‌స్టైల్ క్లోజప్ షాట్స్",
                      lang === "en" ? "Studio Spotlights & Shadow Controls" : "స్టూడియో స్పాట్‌లైట్ & షాడో కంట్రోల్స్",
                    ]
                ).map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs font-bold text-[var(--text-primary)]">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Direct Link to Studio */}
              <div className="pt-1 sm:pt-2">
                <Link
                  id="btn-showcase-open-studio"
                  to="/studio"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-3 rounded-xl bg-accent text-white text-xs sm:text-sm font-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{lang === "en" ? `Open ${activeShowcase === "garment" ? "Garment" : "Jewelry"} Studio` : "స్టూడియో తెరవండి"}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>
            </div>

            {/* Right: Studio Mockup Preview Card */}
            <div className="lg:col-span-7">
              <div className="nm-inset rounded-2xl p-3 sm:p-4 bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between px-1 sm:px-2 text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)]">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{lang === "en" ? "Live Studio Generation Preview" : "స్టూడియో లైవ్ ప్రివ్యూ"}</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-accent font-black tracking-wider uppercase">4K Ready</span>
                </div>

                {/* Split Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Left: Input Product Lay */}
                  <div className="nm-outset rounded-xl p-2.5 sm:p-3 bg-[var(--bg-primary)] space-y-2">
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-extrabold text-[var(--text-secondary)]">
                      <span>{lang === "en" ? "1. Your Product Photo" : "1. మీ ఉత్పత్తి ఫోటో"}</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[8.5px] sm:text-[9px]">Input</span>
                    </div>
                    <div className="aspect-[3/4] min-h-[190px] sm:min-h-[220px] rounded-lg bg-neutral-200 dark:bg-neutral-800 flex flex-col items-center justify-center p-3 sm:p-4 text-center border border-dashed border-black/20 dark:border-white/20">
                      {activeShowcase === "garment" ? (
                        <>
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-2 nm-inset-sm">
                            <ShirtIcon className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                          </div>
                          <span className="text-xs sm:text-sm font-black text-[var(--text-primary)]">Handloom Silk Saree</span>
                          <span className="text-[9.5px] sm:text-[10px] text-[var(--text-secondary)] mt-1">Raw phone flat-lay photo</span>
                          <span className="mt-2 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[8.5px] font-mono text-[var(--text-secondary)]">
                            Original Specimen
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-2 nm-inset-sm">
                            <GemIcon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                          </div>
                          <span className="text-xs sm:text-sm font-black text-[var(--text-primary)]">Temple Gold Necklace</span>
                          <span className="text-[9.5px] sm:text-[10px] text-[var(--text-secondary)] mt-1">Raw jeweler piece photo</span>
                          <span className="mt-2 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[8.5px] font-mono text-[var(--text-secondary)]">
                            Original Specimen
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: AI Output on Model */}
                  <div className="nm-outset rounded-xl p-2.5 sm:p-3 bg-[var(--bg-primary)] space-y-2 border border-accent/30">
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-extrabold text-accent">
                      <span>{lang === "en" ? "2. AI Studio Model Output" : "2. ఏఐ స్టూడియో అవుట్‌పుట్"}</span>
                      <span className="px-1.5 py-0.5 rounded bg-accent/15 text-[8.5px] sm:text-[9px] font-black">4K UHD</span>
                    </div>
                    <div className="aspect-[3/4] min-h-[190px] sm:min-h-[220px] rounded-lg bg-gradient-to-b from-accent/10 via-amber-500/10 to-rose-500/15 flex flex-col items-center justify-center p-3 sm:p-4 text-center border border-accent/40 relative overflow-hidden">
                      <div className="absolute top-2 right-2 px-1.5 sm:px-2 py-0.5 rounded bg-accent text-white text-[8px] sm:text-[9px] font-black shadow-sm">
                        AI Model
                      </div>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-2 nm-outset-sm">
                        <CameraIcon className="w-6 h-6 sm:w-8 sm:h-8 text-accent animate-bounce-slow" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-[var(--text-emphasis)]">
                        {activeShowcase === "garment" ? "Royal Runway Drape" : "Luxury Velvet Bust Shoot"}
                      </span>
                      <span className="text-[9.5px] sm:text-[10px] text-accent font-bold mt-1">
                        {lang === "en" ? "Studio Lighting • True Texture" : "స్టూడియో లైటింగ్ • సహజమైన అందం"}
                      </span>
                      <div className="mt-2 flex items-center gap-1 text-[8.5px] font-bold text-[var(--text-secondary)]">
                        <BadgeCheck className="w-3 h-3 text-accent" />
                        <span>Ready for E-Commerce</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-12 sm:py-16 md:py-24 px-3 xs:px-4 sm:px-6 lg:px-8 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <span className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 inline-block">
              Core Capabilities
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-4xl font-black text-[var(--text-emphasis)] tracking-tight">
              {t.featuresTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Feature 1 */}
            <div className="nm-outset rounded-2xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 sm:space-y-4 hover:scale-[1.02] transition-transform flex flex-col justify-between">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center nm-outset">
                  <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.feature1Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {t.feature1Desc}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="nm-outset rounded-2xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 sm:space-y-4 hover:scale-[1.02] transition-transform flex flex-col justify-between">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center nm-outset">
                  <LayersIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.feature2Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {t.feature2Desc}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="nm-outset rounded-2xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 sm:space-y-4 hover:scale-[1.02] transition-transform flex flex-col justify-between">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center nm-outset">
                  <GemIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.feature3Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {t.feature3Desc}
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="nm-outset rounded-2xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 sm:space-y-4 hover:scale-[1.02] transition-transform flex flex-col justify-between">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center nm-outset">
                  <GlobeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.feature4Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {t.feature4Desc}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (3 EASY STEPS) --- */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-24 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto mb-8 sm:mb-14">
          <span className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 inline-block">
            Workflow
          </span>
          <h2 className="text-xl xs:text-2xl sm:text-4xl font-black text-[var(--text-emphasis)] tracking-tight">
            {t.howItWorksTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 relative">
          {/* Step 1 */}
          <div className="nm-outset rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent text-white font-black text-sm sm:text-base flex items-center justify-center shadow-lg shadow-accent/30">
              1
            </div>
            <h3 className="text-base sm:text-lg font-black text-[var(--text-emphasis)] pt-1 sm:pt-2">
              {t.step1Title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="nm-outset rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-lg shadow-amber-500/30">
              2
            </div>
            <h3 className="text-base sm:text-lg font-black text-[var(--text-emphasis)] pt-1 sm:pt-2">
              {t.step2Title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="nm-outset rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-lg shadow-emerald-500/30">
              3
            </div>
            <h3 className="text-base sm:text-lg font-black text-[var(--text-emphasis)] pt-1 sm:pt-2">
              {t.step3Title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
              {t.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* --- PRICING & CREDITS --- */}
      <section id="pricing" className="py-12 sm:py-16 md:py-24 px-3 xs:px-4 sm:px-6 lg:px-8 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <span className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 inline-block">
              Wallet & Pricing
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-4xl font-black text-[var(--text-emphasis)] tracking-tight">
              {t.pricingTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium px-2">
              {t.pricingSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto items-stretch">
            
            {/* Starter Plan */}
            <div className="nm-outset rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] block">
                    {t.plan1Title}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-[var(--text-emphasis)]">₹499</span>
                    <span className="text-xs font-bold text-accent">/ {t.plan1Credits}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-1.5">
                    {t.plan1Desc}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                  {planFeatures.plan1.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[var(--text-primary)]">
                      <Check className="w-3.5 h-3.5 text-accent shrink-0 stroke-[3]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                id="btn-pricing-starter"
                to="/studio"
                className="w-full py-3 rounded-xl nm-outset text-xs font-black text-center text-[var(--text-primary)] hover:text-accent hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer block min-h-[44px] flex items-center justify-center"
              >
                {lang === "en" ? "Get Started" : "ప్రారంభించండి"}
              </Link>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="nm-outset rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-5 flex flex-col justify-between border-2 border-accent relative shadow-xl shadow-accent/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 sm:py-1 rounded-full bg-accent text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div className="space-y-4 pt-1 sm:pt-2">
                <div>
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-accent block">
                    {t.plan2Title}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-[var(--text-emphasis)]">₹1,999</span>
                    <span className="text-xs font-bold text-accent">/ {t.plan2Credits}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-1.5">
                    {t.plan2Desc}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                  {planFeatures.plan2.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[var(--text-primary)]">
                      <Check className="w-3.5 h-3.5 text-accent shrink-0 stroke-[3]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                id="btn-pricing-pro"
                to="/studio"
                className="w-full py-3.5 rounded-xl bg-accent text-white text-xs font-black text-center shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer block min-h-[44px] flex items-center justify-center"
              >
                {lang === "en" ? "Launch Studio" : "స్టూడియో ప్రారంభించండి"}
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="nm-outset rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] block">
                    {t.plan3Title}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-[var(--text-emphasis)]">₹6,999</span>
                    <span className="text-xs font-bold text-accent">/ {t.plan3Credits}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-1.5">
                    {t.plan3Desc}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                  {planFeatures.plan3.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[var(--text-primary)]">
                      <Check className="w-3.5 h-3.5 text-accent shrink-0 stroke-[3]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                id="btn-pricing-enterprise"
                to="/studio"
                className="w-full py-3 rounded-xl nm-outset text-xs font-black text-center text-[var(--text-primary)] hover:text-accent hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer block min-h-[44px] flex items-center justify-center"
              >
                {lang === "en" ? "Select Plan" : "ప్లాన్ ఎంచుకోండి"}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-12 sm:py-16 md:py-24 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 inline-block">
            Success Stories
          </span>
          <h2 className="text-xl xs:text-2xl sm:text-4xl font-black text-[var(--text-emphasis)] tracking-tight">
            {t.testimonialsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {/* Testimonial 1 */}
          <div className="nm-outset rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-[var(--bg-primary)] space-y-3 sm:space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-primary)] font-semibold italic leading-relaxed">
                {t.testimonial1}
              </p>
            </div>
            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[var(--text-emphasis)] block">{t.testimonial1Author}</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block">{t.testimonial1Role}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold">Verified</span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="nm-outset rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-[var(--bg-primary)] space-y-3 sm:space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-primary)] font-semibold italic leading-relaxed">
                {t.testimonial2}
              </p>
            </div>
            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[var(--text-emphasis)] block">{t.testimonial2Author}</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block">{t.testimonial2Role}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold">Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- PWA INSTALL APP BANNER --- */}
      <InstallAppBanner lang={lang} />

      {/* --- BOTTOM CALL TO ACTION --- */}
      <section className="py-12 sm:py-16 md:py-20 px-3 xs:px-4 sm:px-6 lg:px-8 border-t border-black/5 dark:border-white/5 bg-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <h2 className="text-xl xs:text-2xl sm:text-4xl font-black text-[var(--text-emphasis)] tracking-tight">
            {lang === "en" ? "Ready to create stunning product photos?" : "మీ ఉత్పత్తులకు అద్భుతమైన ఫోటోషూట్ సిద్ధం చేయండి"}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto font-medium px-2">
            {lang === "en" 
              ? "Join thousands of handloom weavers, boutique designers, and jewelry artisans elevating their brand presence today."
              : "ఈరోజే వేలాది మంది చేనేత కళాకారులు మరియు వ్యాపారులతో కలిసి మీ వ్యాపారాన్ని బ్రాండ్‌గా మార్చుకోండి."}
          </p>
          <div className="pt-1 sm:pt-2">
            <Link
              id="btn-cta-bottom-launch"
              to="/studio"
              className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-accent text-white text-xs sm:text-sm md:text-base font-black shadow-xl shadow-accent/30 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>{t.ctaLaunch}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-black/10 dark:border-white/10 py-8 sm:py-10 px-4 sm:px-8 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <Logo />
            <div>
              <span className="text-sm sm:text-base font-black text-[var(--text-emphasis)] block">
                Srushti AI
              </span>
              <span className="text-[10px] sm:text-[11px] text-[var(--text-secondary)] font-medium block">
                {t.footerTagline}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-bold text-[var(--text-secondary)]">
            <Link to="/studio" className="hover:text-accent transition-colors py-1">
              {lang === "en" ? "AI Studio" : "ఏఐ స్టూడియో"}
            </Link>
            <Link to="/terms" className="hover:text-accent transition-colors py-1">
              {lang === "en" ? "Terms & Conditions" : "నియమ నిబంధనలు"}
            </Link>
            <Link to="/privacy" className="hover:text-accent transition-colors py-1">
              {lang === "en" ? "Privacy Policy" : "గోప్యతా విధానం"}
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-[10px] sm:text-[11px] text-[var(--text-secondary)] font-medium text-center md:text-right">
            © {new Date().getFullYear()} Srushti AI. {t.rights}
          </div>

        </div>
      </footer>

    </div>
  );
}
