import React, { useState, useEffect } from "react";
import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "../components/Logo";
import { Language } from "../types";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPageComponent,
});

// Icon Helpers
const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const ArrowRight = (props: any) => <Icon icon="lucide:arrow-right" {...props} />;
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
const SmartphoneIcon = (props: any) => <Icon icon="lucide:smartphone" {...props} />;
const StoreIcon = (props: any) => <Icon icon="lucide:store" {...props} />;
const HomeIcon = (props: any) => <Icon icon="lucide:home" {...props} />;
const ShoppingBagIcon = (props: any) => <Icon icon="lucide:shopping-bag" {...props} />;
const PackageIcon = (props: any) => <Icon icon="lucide:package" {...props} />;
const HeartHandshakeIcon = (props: any) => <Icon icon="lucide:heart-handshake" {...props} />;

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

  const [activeShowcase, setActiveShowcase] = useState<"garment" | "jewelry" | "lifestyle">("garment");
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
      badge: "AI Product Photography for Local & Home Businesses",
      headlineTitle: "Studio-Quality Product Photography for",
      headlineHighlight: "Local & Home Businesses",
      subtitle: "Turn everyday smartphone photos of your sarees, boutique wear, jewelry, handmade crafts, and home products into high-fashion model shoots and editorial catalogues in seconds — no expensive photographers or studios needed.",
      targetTags: ["Home Businesses", "Local Boutiques", "Handloom Weavers", "Jewelry Creators", "Instagram & WhatsApp Sellers"],
      ctaLaunch: "Launch AI Studio",
      ctaDemo: "Explore Showcase",
      stats1: "Zero Studio Needed",
      stats1Sub: "Just Your Smartphone",
      stats2: "90% Cost Savings",
      stats2Sub: "vs ₹30,000+ Traditional Shoots",
      stats3: "WhatsApp & Insta Ready",
      stats3Sub: "Instant 4K Catalogues",
      stats4: "Telugu & Multi-Lingual",
      stats4Sub: "Simple Regional Navigation",
      showcaseTitle: "Studio Magic for Every Local Product",
      showcaseSub: "Choose a product category to see how simple phone photos transform into high-converting commercial photography.",
      garmentTab: "Fashion & Sarees",
      jewelryTab: "Jewelry & Accessories",
      lifestyleTab: "Home & Handmade Goods",
      localBizTitle: "Why Local & Home Businesses Choose Srushti AI",
      localBizSub: "Tailored to help neighborhood entrepreneurs and home creators scale their sales without big agency budgets.",
      benefit1Title: "Shoot Anywhere on Your Phone",
      benefit1Desc: "Take a flat-lay picture on your bed, table, or shop counter. Srushti AI extracts the product and places it into high-end studio lighting.",
      benefit2Title: "No Models or Studio Rent",
      benefit2Desc: "Save ₹15,000 to ₹50,000 per photoshoot. Get diverse Indian and global models on-demand for every single new piece.",
      benefit3Title: "Built for WhatsApp & Social Selling",
      benefit3Desc: "Generate stunning vertical stories, catalogue squares, and high-res zoomable photos that build trust and close orders faster in DMs.",
      benefit4Title: "Zero Tech Skills Required",
      benefit4Desc: "Designed with an intuitive visual interface in Telugu & English. Upload, pick your style, and download in under 30 seconds.",
      featuresTitle: "Everything You Need to Turn Products into Brands",
      feature1Title: "Authentic Indian & Global Models",
      feature1Desc: "Choose regional Indian models, custom hairstyles, poses, and expressions tailored to your target audience.",
      feature2Title: "True Fabric & Material Realism",
      feature2Desc: "Preserves zari gold weave, silk sheen, intricate embroidery, and gemstone refractions with photographic accuracy.",
      feature3Title: "Luxury Velvet & Marble Pedestals",
      feature3Desc: "Display necklaces, earrings, cosmetics, and handicrafts on velvet mannequins, marble slabs, or natural sunlight scenes.",
      feature4Title: "Custom Face & Model Creator",
      feature4Desc: "Generate unique brand-exclusive faces or maintain a consistent model identity across your seasonal collections.",
      howItWorksTitle: "How It Works for Home & Local Sellers",
      step1Title: "1. Snap a Quick Photo",
      step1Desc: "Take a simple photo of your saree, jewelry piece, or product using your smartphone.",
      step2Title: "2. Select Model & Setting",
      step2Desc: "Pick male/female models, lighting tone, boutique studio, or festive temple backdrops.",
      step3Title: "3. Download 4K Visuals",
      step3Desc: "Get instant commercial-ready photos ready to post on Instagram, WhatsApp catalogues, Amazon, and Meesho.",
      pricingTitle: "Affordable Pay-As-You-Go Credits",
      pricingSub: "Recharge with UPI, GPay, PhonePe, or Cards anytime. No monthly subscription lock-ins.",
      plan1Title: "Home Business Starter",
      plan1Credits: "100 Credits",
      plan1Desc: "Ideal for testing new drops, home sellers, and weekly social media posts.",
      plan2Title: "Boutique & Artisan Pro",
      plan2Credits: "500 Credits",
      plan2Desc: "Most popular for local boutiques, handloom weavers, and seasonal catalogue launches.",
      plan3Title: "Commercial Studio Growth",
      plan3Credits: "2,000 Credits",
      plan3Desc: "For growing brands, jewelry showrooms, and high-volume e-commerce stores.",
      testimonialsTitle: "Loved by Local & Home Businesses Across India",
      testimonial1: "“Running a boutique from home in Hyderabad, I used to struggle to photograph sarees without hiring models. Srushti AI gives my collection a designer boutique look right from my phone!”",
      testimonial1Author: "Sravani Reddy",
      testimonial1Role: "Home Boutique Owner, Hyderabad",
      testimonial2: "“We sell handmade temple jewelry on WhatsApp and Instagram. After using Srushti AI’s velvet bust renders, customer trust jumped and our daily orders doubled.”",
      testimonial2Author: "Ramesh & Sunitha V.",
      testimonial2Role: "Handmade Jewelry Artisans, Vijayawada",
      footerTagline: "Business to Brand — Empowering local shops and home entrepreneurs with studio-grade photography.",
      rights: "All rights reserved. Dedicated to empowering local & home businesses.",
    },
    te: {
      badge: "స్థానిక & గృహ వ్యాపారాల కోసం ఏఐ ప్రొడక్ట్ ఫోటోగ్రఫీ",
      headlineTitle: "మీ స్థానిక & గృహ వ్యాపార ఉత్పత్తులకు",
      headlineHighlight: "రాయల్ స్టూడియో ఫోటోషూట్",
      subtitle: "ఖరీదైన కెమెరాలు, లైట్లు మరియు మోడల్స్ ఖర్చు లేకుండా — మీ మొబైల్ ఫోటోలతో పట్టు చీరలు, బొటిక్ దుస్తులు, చేతితో చేసిన ఆభరణాలు మరియు హోమ్ ఉత్పత్తులకు క్షణాల్లో సూపర్ క్వాలిటీ ఫోటోషూట్ సిద్ధం చేయండి.",
      targetTags: ["గృహ వ్యాపారాలు", "స్థానిక బొటిక్స్", "చేనేత నేతన్నలు", "జ్యువెలరీ వ్యాపారులు", "వాట్సాప్ & ఇన్‌స్టాగ్రామ్ సెల్లర్స్"],
      ctaLaunch: "స్టూడియో ప్రారంభించండి",
      ctaDemo: "ప్రదర్శన చూడండి",
      stats1: "స్టూడియో అవసరం లేదు",
      stats1Sub: "మీ సాధారణ స్మార్ట్‌ఫోన్ చాలు",
      stats2: "90% ఖర్చు ఆదా",
      stats2Sub: "వేలకు వేలు ఖర్చుల నుండి ఉపశమనం",
      stats3: "వాట్సాప్ & సోషల్ రెడీ",
      stats3Sub: "వెంటనే 4K క్యాటలాగ్స్",
      stats4: "పూర్తి తెలుగు మద్దతు",
      stats4Sub: "ఎంతో సులభమైన ఉపయోగం",
      showcaseTitle: "ప్రతి స్థానిక ఉత్పత్తికి స్టూడియో మెరుపు",
      showcaseSub: "మీ మొబైల్ ఫోటో ఎంత అద్భుతంగా ప్రొఫెషనల్ మోడల్ ఫోటోగా మారుతుందో చూడండి.",
      garmentTab: "ఫ్యాషన్ & చీరలు",
      jewelryTab: "ఆభరణాలు & జ్యువెలరీ",
      lifestyleTab: "హోమ్ & చేతివృత్తులు",
      localBizTitle: "స్థానిక & గృహ వ్యాపారాలు సృష్టి ఏఐని ఎందుకు ఎంచుకుంటాయి?",
      localBizSub: "చిన్న వ్యాపారులు మరియు గృహ విక్రేతలు తక్కువ ఖర్చుతో ఎక్కువ ఆర్డర్లు సాధించడానికి ప్రత్యేకం.",
      benefit1Title: "మొబైల్ ఫోన్‌తో ఎక్కడి నుంచైనా ఫోటో తీయండి",
      benefit1Desc: "మీ ఇంటి టేబుల్ లేదా బెడ్ పై ఫోటో తీయండి. సృష్టి ఏఐ బ్యాక్‌గ్రౌండ్ మార్చి హై-ఎండ్ స్టూడియో లైటింగ్‌లో మోడల్ పై చూపిస్తుంది.",
      benefit2Title: "మోడల్స్ లేదా స్టూడియో అద్దె భారం లేదు",
      benefit2Desc: "ప్రతి కొత్త కలెక్షన్‌కు వేల రూపాయలు వెచ్చించాల్సిన పనిలేదు. మీకు నచ్చిన భారతీయ మోడల్స్‌ను ఎంచుకోండి.",
      benefit3Title: "వాట్సాప్ & ఇన్‌స్టాగ్రామ్ అమ్మకాల కోసం ప్రత్యేకం",
      benefit3Desc: "కస్టమర్లను ఆకట్టుకునే అందమైన ఫోటోలు, వాట్సాప్ క్యాటలాగ్స్ మరియు స్టేటస్ ఇమేజెస్ సులభంగా తయారు చేసుకోండి.",
      benefit4Title: "ఎటువంటి సాంకేతిక నైపుణ్యం అవసరం లేదు",
      benefit4Desc: "పూర్తిగా తెలుగులో సరళమైన బటన్లతో 30 సెకన్లలోనే ప్రొడక్ట్ ఫోటోలను సిద్ధం చేసుకోండి.",
      featuresTitle: "ఉత్పత్తిని బ్రాండ్‌గా మార్చే ఫీచర్లు",
      feature1Title: "ప్రాంతీయ మరియు విభిన్న మోడల్స్",
      feature1Desc: "దక్షిణ భారత, ఉత్తర భారత సాంప్రదాయ మోడల్స్, హెయిర్‌స్టైల్స్ మరియు ఎక్స్‌ప్రెషన్స్‌ను ఎంచుకోండి.",
      feature2Title: "సహజమైన నేత మరియు జరీ మెరుపు",
      feature2Desc: "పట్టు చీరల జరీ అంచులు, నేత నైపుణ్యం మరియు రంగులు సహజమైన కాంతితో కనిపిస్తాయి.",
      feature3Title: "లగ్జరీ వెల్వెట్ & మార్బుల్ స్టాండ్స్",
      feature3Desc: "నెక్లెస్‌లు, చెవిపోగులు మరియు హ్యాండ్‌మేడ్ వస్తువులను ప్రీమియం వెల్వెట్ బస్ట్‌లపై అందంగా చూపించండి.",
      feature4Title: "కస్టమ్ ఫేస్ & మోడల్ క్రియేటర్",
      feature4Desc: "మీ బ్రాండ్ కోసం ప్రత్యేకమైన మోడల్ ముఖాలను రూపొందించండి లేదా మీ స్వంత ఫోటోలను మోడల్‌గా మార్చుకోండి.",
      howItWorksTitle: "గృహ & స్థానిక వ్యాపారులకు ఇది ఎలా పనిచేస్తుంది?",
      step1Title: "1. మీ ఫోన్‌తో ఫోటో తీయండి",
      step1Desc: "మీ చీర, ఆభరణం లేదా ప్రొడక్ట్ ఫోటోను ఫోన్ కెమెరాతో తీసి అప్‌లోడ్ చేయండి.",
      step2Title: "2. మోడల్ మరియు స్టైల్ ఎంచుకోండి",
      step2Desc: "మీకు నచ్చిన మోడల్, రాయల్ పాలెస్ లేదా మినిమల్ స్టూడియో లైటింగ్‌ను ఎంపిక చేయండి.",
      step3Title: "3. 4K ఫోటోలను డౌన్‌లోడ్ చేయండి",
      step3Desc: "వాట్సాప్, ఇన్‌స్టాగ్రామ్, మీషో మరియు అమెజాన్‌లో పోస్ట్ చేయడానికి హై-క్వాలిటీ ఫోటోలను పొందండి.",
      pricingTitle: "సులభమైన క్రెడిట్ రీఛార్జ్",
      pricingSub: "యూపీఐ (Google Pay, PhonePe) ద్వారా రీఛార్జ్ చేసుకోండి. నెలవారీ చందా ఏదీ లేదు.",
      plan1Title: "హోమ్ బిజినెస్ స్టార్టర్",
      plan1Credits: "100 క్రెడిట్స్",
      plan1Desc: "కొత్త కలెక్షన్స్ మరియు సోషల్ మీడియా వీక్లీ పోస్టులకు సరైనది.",
      plan2Title: "బొటిక్ & ఆర్టిసాన్ ప్రో",
      plan2Credits: "500 క్రెడిట్స్",
      plan2Desc: "స్థానిక బొటిక్స్ మరియు చేనేత వ్యాపారులకు అత్యంత ప్రజాదరణ పొందిన ప్లాన్.",
      plan3Title: "కమర్షియల్ స్టూడియో గ్రోత్",
      plan3Credits: "2,000 క్రెడిట్స్",
      plan3Desc: "పెద్ద ఎత్తున ఆభరణాల షోరూమ్‌లు మరియు ఈ-కామర్స్ స్టోర్ల కోసం.",
      testimonialsTitle: "స్థానిక & గృహ వ్యాపారుల అనుభవాలు",
      testimonial1: "“హైదరాబాద్‌లో ఇంటి నుండి బొటిక్ నడుపుతున్నాను. మోడల్స్ లేకుండా చీరల ఫోటోలు తీయడం కష్టమయ్యేది. సృష్టి ఏఐతో నా కలెక్షన్స్ డిజైనర్ లుక్ పొందాయి!”",
      testimonial1Author: "శ్రావణి రెడ్డి",
      testimonial1Role: "హోమ్ బొటిక్ ఓనర్, హైదరాబాద్",
      testimonial2: "“మేము విజయవాడలో చేతితో చేసిన టెంపుల్ జ్యువెలరీ అమ్ముతాము. సృష్టి ఏఐ వాడిన తర్వాత వాట్సాప్ ఎంక్వైరీలు రెట్టింపు అయ్యాయి.”",
      testimonial2Author: "రమేష్ & సునీత",
      testimonial2Role: "హ్యాండ్‌మేడ్ జ్యువెలరీ మేకర్స్, విజయవాడ",
      footerTagline: "బిజినెస్ టు బ్రాండ్ — స్థానిక మరియు గృహ వ్యాపారులకు స్టూడియో స్థాయి ఫోటోగ్రఫీ సేవలు.",
      rights: "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి. స్థానిక వ్యాపారుల పురోగతి కోసం రూపొందించబడింది.",
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

          {/* Target Audience Badges Pill Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-1 pb-1 max-w-3xl mx-auto"
          >
            {t.targetTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold nm-inset-sm bg-black/5 dark:bg-white/5 text-[var(--text-primary)] border border-black/5 dark:border-white/5 flex items-center gap-1.5"
              >
                {idx === 0 && <HomeIcon className="w-3 h-3 text-accent" />}
                {idx === 1 && <StoreIcon className="w-3 h-3 text-amber-500" />}
                {idx === 2 && <ShirtIcon className="w-3 h-3 text-rose-500" />}
                {idx === 3 && <GemIcon className="w-3 h-3 text-emerald-500" />}
                {idx === 4 && <SmartphoneIcon className="w-3 h-3 text-sky-500" />}
                <span>{tag}</span>
              </span>
            ))}
          </motion.div>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-3 max-w-md xs:max-w-none mx-auto px-4"
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
              <span className="text-base sm:text-xl md:text-2xl font-black text-accent block">{t.stats1}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stats1Sub}</span>
            </div>
            <div className="nm-outset rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-base sm:text-xl md:text-2xl font-black text-emerald-500 block">{t.stats2}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stats2Sub}</span>
            </div>
            <div className="nm-outset rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-base sm:text-xl md:text-2xl font-black text-amber-500 block">{t.stats3}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stats3Sub}</span>
            </div>
            <div className="nm-outset rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-base sm:text-xl md:text-2xl font-black text-rose-500 block">{t.stats4}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] block mt-0.5">{t.stats4Sub}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- WHY LOCAL & HOME BUSINESSES SECTION --- */}
      <section className="py-12 sm:py-16 md:py-20 px-3 xs:px-4 sm:px-6 lg:px-8 border-b border-black/5 dark:border-white/5 bg-accent/[0.02]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <span className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 inline-block">
              Made For Local Sellers
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-4xl font-black text-[var(--text-emphasis)] tracking-tight">
              {t.localBizTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium px-2">
              {t.localBizSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Benefit 1 */}
            <div className="nm-outset rounded-2xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center nm-outset">
                  <SmartphoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.benefit1Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {t.benefit1Desc}
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="nm-outset rounded-2xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center nm-outset">
                  <WalletIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.benefit2Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {t.benefit2Desc}
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="nm-outset rounded-2xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center nm-outset">
                  <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.benefit3Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {t.benefit3Desc}
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="nm-outset rounded-2xl p-5 sm:p-6 bg-[var(--bg-primary)] space-y-3 flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center nm-outset">
                  <HeartHandshakeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)]">
                  {t.benefit4Title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {t.benefit4Desc}
                </p>
              </div>
            </div>
          </div>
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
          <div className="inline-flex rounded-2xl nm-inset p-1 sm:p-1.5 mt-2 sm:mt-4 max-w-full flex-wrap justify-center gap-1">
            <button
              id="btn-tab-garments"
              onClick={() => setActiveShowcase("garment")}
              className={`px-3 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
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
              className={`px-3 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                activeShowcase === "jewelry"
                  ? "bg-accent text-white shadow-md font-black"
                  : "text-[var(--text-secondary)] hover:text-accent"
              }`}
            >
              <GemIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{t.jewelryTab}</span>
            </button>

            <button
              id="btn-tab-lifestyle"
              onClick={() => setActiveShowcase("lifestyle")}
              className={`px-3 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                activeShowcase === "lifestyle"
                  ? "bg-accent text-white shadow-md font-black"
                  : "text-[var(--text-secondary)] hover:text-accent"
              }`}
            >
              <PackageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{t.lifestyleTab}</span>
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
                  {activeShowcase === "garment" && (lang === "en" ? "Fashion & Handloom Studio" : "చేనేత & ఫ్యాషన్ స్టూడియో")}
                  {activeShowcase === "jewelry" && (lang === "en" ? "Jewelry & Ornament Studio" : "ఆభరణాల ఏఐ స్టూడియో")}
                  {activeShowcase === "lifestyle" && (lang === "en" ? "Home Goods & Crafts Studio" : "హోమ్ & చేతివృత్తుల స్టూడియో")}
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-[var(--text-emphasis)] leading-snug">
                  {activeShowcase === "garment" && (lang === "en" ? "Silk Sarees, Kurtas & Lehengas on Real Models" : "పట్టు చీరలు & కుర్తాలు రాయల్ మోడల్స్‌పై")}
                  {activeShowcase === "jewelry" && (lang === "en" ? "Temple & Diamond Jewelry on Velvet Busts" : "వజ్రాల మరియు కుందన్ ఆభరణాల మెరుపు")}
                  {activeShowcase === "lifestyle" && (lang === "en" ? "Handcrafted Decor & Soaps in Aesthetic Sunlight" : "చేతివృత్తుల వస్తువులు & డెకోర్ లగ్జరీ సీన్‌లో")}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 sm:mt-2 font-medium leading-relaxed">
                  {activeShowcase === "garment" && (lang === "en" 
                    ? "Seamlessly render silk sheen, heavy zari borders, and flowing pallus with natural model poses, temple courtyards, and boutique studio key-lighting." 
                    : "జరీ అంచులు, సహజమైన పట్టు మెరుపు మరియు మోడల్ హావభావాలు అద్భుతంగా రూపొందుతాయి.")}
                  {activeShowcase === "jewelry" && (lang === "en"
                    ? "Showcase necklace sets, drop earrings, and bangles with realistic diamond brilliance, gold reflections, and customizable luxury display velvet."
                    : "బంగారు మరియు వజ్రాల మెరుపును హై-ఎండ్ స్టూడియో లైటింగ్‌తో కస్టమర్లను ఆకట్టుకునేలా చూపించండి.")}
                  {activeShowcase === "lifestyle" && (lang === "en"
                    ? "Transform home-made candles, organic cosmetics, pottery, and packaged snacks into editorial Instagram aesthetic scenes on marble pedestals with natural sunrays."
                    : "మీ ఇంట్లో తయారుచేసిన కొవ్వొత్తులు, సేంద్రీయ సౌందర్య సాధనాలు మరియు క్రాఫ్ట్స్ లగ్జరీ స్టూడియో లైటింగ్‌లో మెరుస్తాయి.")}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 sm:space-y-2.5">
                {(activeShowcase === "garment"
                  ? [
                      lang === "en" ? "Authentic Indian Female & Male Models" : "దక్షిణ మరియు ఉత్తర భారత మోడల్స్",
                      lang === "en" ? "Heritage Temple & Palace Courtyard Poses" : "సాంప్రదాయ ఆలయ & రాజభవన బ్యాక్‌గ్రౌండ్స్",
                      lang === "en" ? "True-to-Life Fabric Texture Preservation" : "పట్టు నేత మరియు జరీ నాణ్యత పరిరక్షణ",
                      lang === "en" ? "Instant WhatsApp & Instagram Crop Presets" : "వాట్సాప్ & ఇన్‌స్టా సైజులు రెడీ",
                    ]
                  : activeShowcase === "jewelry"
                  ? [
                      lang === "en" ? "Velvet & Marble Neck Bust Display Options" : "వెల్వెట్ & మార్బుల్ నెక్ బస్ట్ ఆప్షన్స్",
                      lang === "en" ? "Realistic Gold, Polki & Diamond Refractions" : "బంగారు మరియు డైమండ్ రిఫ్లెక్షన్స్",
                      lang === "en" ? "Model Lifestyle Neck & Earring Shots" : "మోడల్ లైఫ్‌స్టైల్ క్లోజప్ షాట్స్",
                      lang === "en" ? "Studio Spotlights & Shadow Controls" : "స్టూడియో స్పాట్‌లైట్ & షాడో కంట్రోల్స్",
                    ]
                  : [
                      lang === "en" ? "Natural Sunlight & Marble Aesthetic Scenes" : "మార్బుల్ & సహజ సూర్యకాంతి బ్యాక్‌గ్రౌండ్స్",
                      lang === "en" ? "Label & Brand Packaging Preservation" : "ప్యాకేజింగ్ మరియు బ్రాండ్ లోగో స్పష్టత",
                      lang === "en" ? "Clean Shadow Drop & Depth of Field" : "స్టూడియో డెప్త్ మరియు షాడో ఎఫెక్ట్స్",
                      lang === "en" ? "Perfect for Amazon, Meesho & Instagram" : "అమెజాన్, మీషో మరియు ఇన్‌స్టాగ్రామ్ కోసం రెడీ",
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
                  <span>{lang === "en" ? `Open ${activeShowcase === "garment" ? "Fashion" : activeShowcase === "jewelry" ? "Jewelry" : "Product"} Studio` : "స్టూడియో తెరవండి"}</span>
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
                    <span>{lang === "en" ? "Live Local Business Transformation" : "లైవ్ స్టూడియో రూపాంతరం"}</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-accent font-black tracking-wider uppercase">4K Ready</span>
                </div>

                {/* Split Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Left: Input Product Lay (Phone Snapshot) */}
                  <div className="nm-outset rounded-xl p-2.5 sm:p-3 bg-[var(--bg-primary)] space-y-2">
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-extrabold text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <SmartphoneIcon className="w-3 h-3 text-[var(--text-secondary)]" />
                        <span>{lang === "en" ? "1. Your Phone Snapshot" : "1. మీ ఫోన్ ఫోటో"}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[8.5px] sm:text-[9px] font-bold">Unedited Raw</span>
                    </div>
                    
                    <div className="aspect-[3/4] min-h-[220px] rounded-lg relative overflow-hidden bg-neutral-900 border border-black/10 dark:border-white/10 group">
                      {activeShowcase === "garment" && (
                        <img 
                          src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800" 
                          alt="Raw Phone Saree Snapshot" 
                          className="w-full h-full object-cover object-center filter saturate-[0.85] brightness-[0.92] contrast-[0.95]"
                          loading="lazy"
                        />
                      )}
                      {activeShowcase === "jewelry" && (
                        <img 
                          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800" 
                          alt="Raw Phone Jewelry Snapshot" 
                          className="w-full h-full object-cover object-center filter saturate-[0.8] brightness-[0.88]"
                          loading="lazy"
                        />
                      )}
                      {activeShowcase === "lifestyle" && (
                        <img 
                          src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800" 
                          alt="Raw Phone Product Snapshot" 
                          className="w-full h-full object-cover object-center filter saturate-[0.85] brightness-[0.9]"
                          loading="lazy"
                        />
                      )}
                      
                      {/* Realistic phone camera overlay tag */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[8.5px] font-mono flex items-center gap-1 border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        <span>PHONE CAM • FLAT LAY</span>
                      </div>

                      {/* Bottom caption overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 pt-6 text-white text-left">
                        <span className="text-xs font-bold block text-neutral-100">
                          {activeShowcase === "garment" && "Kanchipuram Silk Saree"}
                          {activeShowcase === "jewelry" && "Temple Choker Necklace"}
                          {activeShowcase === "lifestyle" && "Handmade Botanical Soap & Candle"}
                        </span>
                        <span className="text-[9px] text-neutral-300 font-medium">
                          {lang === "en" ? "Casual indoor phone lighting on table" : "ఇంటి టేబుల్‌పై తీసిన సాధారణ ఫోటో"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Output on Model / Luxury Studio */}
                  <div className="nm-outset rounded-xl p-2.5 sm:p-3 bg-[var(--bg-primary)] space-y-2 border border-accent/40 relative">
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-extrabold text-accent">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span>{lang === "en" ? "2. Srushti AI Studio Result" : "2. సృష్టి ఏఐ స్టూడియో ఫలితం"}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[8.5px] sm:text-[9px] font-black uppercase">4K UHD Studio</span>
                    </div>

                    <div className="aspect-[3/4] min-h-[220px] rounded-lg relative overflow-hidden bg-neutral-900 border border-accent/40 shadow-lg shadow-accent/10 group">
                      {activeShowcase === "garment" && (
                        <img 
                          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800" 
                          alt="AI Studio Model Saree Photoshoot" 
                          className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-[1.02]"
                          loading="lazy"
                        />
                      )}
                      {activeShowcase === "jewelry" && (
                        <img 
                          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800" 
                          alt="AI Studio Velvet Jewelry Showcase" 
                          className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-[1.02]"
                          loading="lazy"
                        />
                      )}
                      {activeShowcase === "lifestyle" && (
                        <img 
                          src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800" 
                          alt="AI Studio Luxury Marble Product Shoot" 
                          className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-[1.03]"
                          loading="lazy"
                        />
                      )}

                      {/* Badge badge overlay */}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-accent text-white text-[8.5px] font-black uppercase shadow-md flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{activeShowcase === "lifestyle" ? "Luxury Editorial" : "Commercial Model Shoot"}</span>
                      </div>

                      {/* Bottom details overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2.5 pt-8 text-white text-left space-y-0.5">
                        <div className="flex items-center gap-1">
                          <BadgeCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="text-xs font-black text-amber-200">
                            {activeShowcase === "garment" && "Royal Model Runway Drape"}
                            {activeShowcase === "jewelry" && "Editorial Velvet Studio Showcase"}
                            {activeShowcase === "lifestyle" && "Sunlit Marble Aesthetic Shoot"}
                          </span>
                        </div>
                        <p className="text-[9px] text-neutral-200 font-semibold">
                          {lang === "en" ? "Studio Key-Light • Zero Model Cost • Ready for WhatsApp" : "స్టూడియో లైటింగ్ • మోడల్ ఖర్చు సున్నా • వాట్సాప్ రెడీ"}
                        </p>
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
