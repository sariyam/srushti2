import React, { useState, useEffect } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import { Logo } from "../components/Logo";
import { HeroCarousel } from "../components/HeroCarousel";
import { QuoteSlider } from "../components/QuoteSlider";
import { Language } from "../types";
import { useStudioConfig } from "../context/StudioConfigContext";

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

  type ShowcaseCategory =
    | "saree"
    | "dress"
    | "shirt"
    | "watch"
    | "earrings"
    | "bangle"
    | "jeans"
    | "trouser"
    | "necklace"
    | "chain";

  const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
    "saree",
    "dress",
    "shirt",
    "watch",
    "earrings",
    "bangle",
    "jeans",
    "trouser",
    "necklace",
    "chain",
  ];

  const [activeShowcase, setActiveShowcase] = useState<ShowcaseCategory>("saree");

  // Auto click next tab one by one after every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveShowcase((prev) => {
        const idx = SHOWCASE_CATEGORIES.indexOf(prev);
        const nextIdx = (idx + 1) % SHOWCASE_CATEGORIES.length;
        return SHOWCASE_CATEGORIES[nextIdx];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

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
      contactLabel: "Contact: hi@srushtiai.in",
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
      contactLabel: "Contact: hi@srushtiai.in",
    }
  };

  const t = content[lang];
  const { config } = useStudioConfig();
  const remoteTabs = (config?.settings as any)?.landing_showcase?.tabs;

  const DEFAULT_SHOWCASE_TABS: {
    id: ShowcaseCategory;
    label: { en: string; te: string };
    thumb: string;
  }[] = [
    { id: "saree", label: { en: "Saree", te: "చీరలు" }, thumb: "/items/saree.jpg" },
    { id: "dress", label: { en: "Dress", te: "డ్రెస్" }, thumb: "/items/gown.jpg" },
    { id: "shirt", label: { en: "Shirt", te: "షర్ట్" }, thumb: "/items/shirt.jpg" },
    { id: "watch", label: { en: "Watch", te: "వాచ్" }, thumb: "/items/watch.jpg" },
    { id: "earrings", label: { en: "Earrings", te: "చెవి కమ్మలు" }, thumb: "/items/earrings.jpg" },
    { id: "bangle", label: { en: "Bangle", te: "గాజులు" }, thumb: "/items/bangles.jpg" },
    { id: "jeans", label: { en: "Jeans", te: "జీన్స్" }, thumb: "/items/jeans.jpg" },
    { id: "trouser", label: { en: "Trouser", te: "ట్రౌజర్" }, thumb: "/items/suit.jpg" },
    { id: "necklace", label: { en: "Necklace", te: "నెక్లెస్" }, thumb: "/items/necklace.jpg" },
    { id: "chain", label: { en: "Chain", te: "చైన్" }, thumb: "/items/chain.jpg" },
  ];

  const showcaseTabs = (Array.isArray(remoteTabs) && remoteTabs.length > 0)
    ? remoteTabs
    : DEFAULT_SHOWCASE_TABS;

  const showcaseData: Record<
    ShowcaseCategory,
    {
      img: string;
      title: string;
      desc: string;
      tag: string;
      sourceTag: string;
      lightingTag: string;
      bullet1: string;
      bullet2: string;
      bullet3: string;
    }
  > = {
    saree: {
      img: "/showcase/tryons/1.png",
      title: lang === "en" ? "Royal Saree Drape on Indian Model" : "రాయల్ ఇండియన్ మోడల్ క్యాటలాగ్ డ్రేప్",
      desc: lang === "en" ? "Transformed from a flat-lay phone photo on bed into a high-fashion model shoot" : "మంచంపై తీసిన ఫోటో నుంచి క్షణాల్లో రాయల్ మోడల్ షూట్‌గా మారింది",
      tag: lang === "en" ? "Saree & Traditional Wear" : "చీరలు & సాంప్రదాయ దుస్తులు",
      sourceTag: lang === "en" ? "Source: Phone camera on bed" : "ఇన్‌పుట్: బెడ్‌పై ఫోన్ ఫోటో",
      lightingTag: lang === "en" ? "Studio Lighting • Realistic Fall & Pleating" : "స్టూడియో లైటింగ్ • రియలిస్టిక్ డ్రేపింగ్",
      bullet1: lang === "en" ? "Snap a quick photo of your flat saree on your bed or table with your phone." : "మీ ఇంట్లోని టేబుల్ లేదా బెడ్‌పై పెట్టి ఫోన్‌తో ఒక సాధారణ ఫోటో తీయండి.",
      bullet2: lang === "en" ? "Accurately drapes it on real Indian models with authentic pleats & fabric sheen." : "చీర రంగు, జరీ మెరుపు మారకుండా సహజమైన కుచ్చిళ్ళు & ఫాల్ వస్తుంది.",
      bullet3: lang === "en" ? "Instantly ready to share on WhatsApp Status, Catalog, and Instagram reels." : "వాట్సాప్ స్టేటస్, క్యాటలాగ్, ఇన్‌స్టాలో పోస్ట్ చేయడానికి 30 సెకన్లలో రెడీ.",
    },
    dress: {
      img: "/showcase/tryons/3.png",
      title: lang === "en" ? "High-Fashion Editorial Model Dress Shoot" : "హై-ఫ్యాషన్ ఎడిటోరియల్ మోడల్ డ్రెస్ షూట్",
      desc: lang === "en" ? "Transformed from a hanger snap into a stunning studio fashion editorial" : "హ్యాంగర్‌పై తీసిన ఫోటో నుంచి అద్భుతమైన స్టూడియో ఫ్యాషన్ షూట్‌గా మారింది",
      tag: lang === "en" ? "Designer Dresses & Gowns" : "డిజైనర్ డ్రెస్సెస్ & గౌన్లు",
      sourceTag: lang === "en" ? "Source: Phone snap on hanger" : "ఇన్‌పుట్: హ్యాంగర్‌పై ఫోన్ ఫోటో",
      lightingTag: lang === "en" ? "Warm Editorial • Flowing Silhouette & Flare" : "ఎడిటోరియల్ లైటింగ్ • అందమైన ఫ్లేర్ & సిల్హౌట్",
      bullet1: lang === "en" ? "Hang your frock, gown, or boutique dress on a wall or door and take a photo." : "మీ గౌన్ లేదా బొటిక్ డ్రెస్‌ను గోడపై లేదా హ్యాంగర్‌పై ఉంచి ఫోటో తీయండి.",
      bullet2: lang === "en" ? "Renders onto runway-caliber fashion models with natural fabric flow and fit." : "సహజమైన ఫ్యాబ్రిక్ మూవ్‌మెంట్‌తో టాప్ ఫ్యాషన్ మోడల్స్‌పై డిస్‌ప్లే అవుతుంది.",
      bullet3: lang === "en" ? "Drives 5x more clicks and direct buyer inquiries on WhatsApp & Instagram." : "వాట్సాప్ మరియు ఇన్‌స్టాగ్రామ్‌లో కస్టమర్ల నుంచి రెట్టింపు ఎంక్వైరీలు వస్తాయి.",
    },
    shirt: {
      img: "/showcase/tryons/2.png",
      title: lang === "en" ? "Tailored Menswear Studio Catalogue" : "టైలర్డ్ మెన్స్‌వేర్ స్టూడియో క్యాటలాగ్",
      desc: lang === "en" ? "Transformed from a flat-lay on table into a tailored menswear studio shoot" : "టేబుల్‌పై తీసిన ఫ్లాట్ ఫోటో నుంచి ప్రొఫెషనల్ మెన్స్ స్టూడియో షూట్‌గా మారింది",
      tag: lang === "en" ? "Men's Shirts & Casuals" : "మెన్స్ షర్ట్స్ & క్యాజువల్స్",
      sourceTag: lang === "en" ? "Source: Flat lay on table" : "ఇన్‌పుట్: టేబుల్‌పై ఫ్లాట్ ఫోటో",
      lightingTag: lang === "en" ? "Clean Daylight • Sharp Collar & Fabric Texture" : "స్టూడియో డేలైట్ • షార్ప్ కాలర్ & ఫ్యాబ్రిక్ ఫిట్",
      bullet1: lang === "en" ? "Lay any formal, casual, or linen shirt flat on your counter or table." : "మీ షాపులోని లేదా ఇంట్లోని టేబుల్‌పై షర్ట్ ఉంచి సాధారణ ఫోటో తీయండి.",
      bullet2: lang === "en" ? "Creates a perfectly fitted studio model shoot with sharp collar and real texture." : "షార్ప్ కాలర్ మరియు పర్ఫెక్ట్ ఫిట్టింగ్‌తో కూడిన స్టూడియో మోడల్ షూట్ వస్తుంది.",
      bullet3: lang === "en" ? "Elevates your boutique or tailor shop into an elite menswear brand." : "మీ లోకల్ టైలర్ లేదా మెన్స్ వేర్ షాపుకి ఆన్‌లైన్ బ్రాండెడ్ లుక్ ఇస్తుంది.",
    },
    watch: {
      img: "/showcase/tryons/4.png",
      title: lang === "en" ? "Dark Marble Pedestal Luxury Watch Shoot" : "డార్క్ మార్బుల్ పెడెస్టల్ లగ్జరీ వాచ్ షూట్",
      desc: lang === "en" ? "Transformed from a shop counter snap into elite commercial product photography" : "గ్లాస్ కౌంటర్‌పై తీసిన ఫోటో నుంచి హై-ఎండ్ కమర్షియల్ ప్రొడక్ట్ ఫోటోగా మారింది",
      tag: lang === "en" ? "Luxury Watches & Timepieces" : "లగ్జరీ వాచ్‌లు & టైమ్‌పీసెస్",
      sourceTag: lang === "en" ? "Source: Phone photo on counter" : "ఇన్‌పుట్: కౌంటర్‌పై ఫోన్ ఫోటో",
      lightingTag: lang === "en" ? "Dramatic Rim Light • Glare-Free Dial Reflections" : "రిమ్ లైటింగ్ • డయల్ & బెజెల్ క్లియర్ రిఫ్లెక్షన్స్",
      bullet1: lang === "en" ? "Place any watch on a table or counter and capture a quick phone picture." : "వాచ్‌ని టేబుల్‌పై ఉంచి మీ ఫోన్ కెమెరాతో సింపుల్‌గా ఫోటో తీయండి.",
      bullet2: lang === "en" ? "Removes glaring reflections, lighting up the dial details and metallic sheen." : "గ్లాస్ రిఫ్లెక్షన్స్ తొలగించి, డయల్ నంబర్లు, మెటల్ మెరుపును అద్భుతంగా చూపుతుంది.",
      bullet3: lang === "en" ? "Gives your watch store or resale business an international luxury catalog feel." : "మీ వాచ్ షోరూమ్ లేదా రీసేల్ బిజినెస్‌కి ఇంటర్నేషనల్ లగ్జరీ లుక్ అందిస్తుంది.",
    },
    earrings: {
      img: "/showcase/tryons/5.png",
      title: lang === "en" ? "Editorial Portrait Shoot with Sparkling Jhumkas" : "మెరిసే జుంకాలతో ఎడిటోరియల్ మోడల్ పోర్ట్రెయిట్",
      desc: lang === "en" ? "Transformed from a simple box photo into a glowing model portrait photoshoot" : "బాక్స్‌లో తీసిన సాధారణ ఫోటో నుంచి మెరిసే మోడల్ ఫోటోషూట్‌గా మారింది",
      tag: lang === "en" ? "Earrings & Jhumkas" : "చెవి కమ్మలు & జుంకాలు",
      sourceTag: lang === "en" ? "Source: Phone snapshot in box" : "ఇన్‌పుట్: బాక్స్‌లో ఫోన్ ఫోటో",
      lightingTag: lang === "en" ? "Warm Portrait Keylight • Prismatic Gemstone Glow" : "వార్మ్ పోర్ట్రెయిట్ లైటింగ్ • రత్నాల సహజ మెరుపు",
      bullet1: lang === "en" ? "Photograph earrings inside their box or resting on a plain paper." : "చెవి కమ్మలు లేదా జుంకాలను బాక్స్‌లో పెట్టి ఫోన్‌తో ఒక ఫోటో తీయండి.",
      bullet2: lang === "en" ? "Seamlessly places them on gorgeous Indian models showing realistic size and shine." : "కరెక్ట్ సైజు మరియు మెరుపుతో అందమైన ఇండియన్ మోడల్స్‌పై చూపిస్తుంది.",
      bullet3: lang === "en" ? "Customers visualize the exact look immediately without asking for try-on pictures." : "పెట్టుకుంటే ఎలా ఉంటుందో క్లియర్‌గా చూసి కస్టమర్లు వెంటనే ఆర్డర్ చేస్తారు.",
    },
    bangle: {
      img: "/showcase/tryons/10.png",
      title: lang === "en" ? "Bridal Mehendi Silk Studio Bangle Showcase" : "బ్రైడల్ మెహందీ సిల్క్ స్టూడియో బ్యాంగిల్ షోకేస్",
      desc: lang === "en" ? "Transformed from a flat velvet tray snap into an opulent bridal photoshoot" : "ట్రేలో తీసిన ఫోటో నుంచి వైభవోపేతమైన బ్రైడల్ ఫోటోషూట్‌గా మారింది",
      tag: lang === "en" ? "Bangles & Kadas" : "గాజులు & కడాలు",
      sourceTag: lang === "en" ? "Source: Tray snap on display" : "ఇన్‌పుట్: ట్రేపై ఫోన్ ఫోటో",
      lightingTag: lang === "en" ? "Warm Gold Ambient • Intricate Kundan & Ruby Details" : "గోల్డ్ యాంబియంట్ లైటింగ్ • కుందన్ & రూబీ వర్క్ క్లారిటీ",
      bullet1: lang === "en" ? "Take a picture of single bangles, sets, or kadas on your display velvet." : "గాజుల సెట్ లేదా కడాలను మీ షోకేస్ ట్రేపై ఉంచి ఫోటో తీయండి.",
      bullet2: lang === "en" ? "Arranges them naturally on adorned bridal hands with authentic silk backdrop." : "పట్టు వస్త్రాల బ్యాక్‌డ్రాప్‌తో చేతులకు అందంగా అలంకరించినట్లు చూపిస్తుంది.",
      bullet3: lang === "en" ? "Perfect for festive and wedding season sales on WhatsApp and Instagram." : "పెళ్ళిళ్ళు, పండుగల సీజన్‌లో వాట్సాప్ సేల్స్ పెంచడానికి సూపర్ టూల్.",
    },
    jeans: {
      img: "/showcase/tryons/8.png",
      title: lang === "en" ? "Contemporary Studio Denim Editorial Shoot" : "మోడ్రన్ స్టూడియో డెనిమ్ ఎడిటోరియల్ షూట్",
      desc: lang === "en" ? "Transformed from a folded shelf snap into a high-fashion denim model shoot" : "మడతపెట్టిన ఫోటో నుంచి హై-ఫ్యాషన్ డెనిమ్ మోడల్ షూట్‌గా మారింది",
      tag: lang === "en" ? "Denim & Casual Jeans" : "డెనిమ్ & క్యాజువల్ జీన్స్",
      sourceTag: lang === "en" ? "Source: Folded on shop shelf" : "ఇన్‌పుట్: షాపు షెల్ఫ్‌పై ఫోటో",
      lightingTag: lang === "en" ? "Commercial Diffused Studio • Authentic Denim Wash" : "డిఫ్యూజ్డ్ స్టూడియో లైటింగ్ • రియల్ డెనిమ్ వాష్ అండ్ ఫిట్",
      bullet1: lang === "en" ? "Take a phone snap of folded or hung jeans right in your shop or home." : "మీ షాపులో లేదా ఇంట్లో మడతపెట్టిన జీన్స్ ప్యాంట్‌ను ఫోటో తీయండి.",
      bullet2: lang === "en" ? "Models wear it in natural flattering poses showcasing the true fit and denim wash." : "జీన్స్ కటింగ్, వాష్ మరియు ఫిట్టింగ్ స్పష్టంగా తెలిసేలా మోడల్‌పై చూపిస్తుంది.",
      bullet3: lang === "en" ? "Increases conversions for clothing stores, D2C brands, and reselling groups." : "క్లాత్ స్టోర్లు మరియు రీసెల్లింగ్ గ్రూపుల్లో ఆర్డర్లు గణనీయంగా పెరుగుతాయి.",
    },
    trouser: {
      img: "/showcase/tryons/9.png",
      title: lang === "en" ? "Tailored Trousers Minimalist Studio Shoot" : "టైలర్డ్ ట్రౌజర్స్ మినిమలిస్ట్ స్టూడియో షూట్",
      desc: lang === "en" ? "Transformed from a hanger snap into a sleek architectural studio catalogue" : "హ్యాంగర్ ఫోటో నుంచి క్లాసిక్ ఆర్కిటెక్చరల్ స్టూడియో క్యాటలాగ్‌గా మారింది",
      tag: lang === "en" ? "Trousers & Formal Pants" : "ట్రౌజర్స్ & ఫార్మల్ ప్యాంట్స్",
      sourceTag: lang === "en" ? "Source: Hanger snap on wall" : "ఇన్‌పుట్: గోడ హ్యాంగర్‌పై ఫోటో",
      lightingTag: lang === "en" ? "Minimalist Soft Daylight • Clean Pleat & Crease Line" : "సాఫ్ట్ మినిమలిస్ట్ డేలైట్ • పర్ఫెక్ట్ క్రీజ్ & ప్లీట్ లైన్",
      bullet1: lang === "en" ? "Photograph your tailored formal trousers or casual slacks on a simple hanger." : "మీ ఫార్మల్ ట్రౌజర్స్ లేదా కాటన్ ప్యాంట్లను హ్యాంగర్‌పై పెట్టి ఫోటో తీయండి.",
      bullet2: lang === "en" ? "Renders crisp crease lines, perfect fall, and comfortable waist fit on models." : "నీట్ క్రీజ్ లైన్స్, సహజమైన ఫాల్ మరియు పర్ఫెక్ట్ ఫిట్‌తో డిస్‌ప్లే చేస్తుంది.",
      bullet3: lang === "en" ? "Gives boutique custom tailors and retailers high-end brand credibility." : "టైలరింగ్ బొటిక్‌లు మరియు బట్టల దుకాణాలకు ప్రీమియం బ్రాండ్ గుర్తింపు వస్తుంది.",
    },
    necklace: {
      img: "/showcase/tryons/7.png",
      title: lang === "en" ? "Royal Emerald Velvet Bust Jewelry Shoot" : "రాయల్ ఎమరాల్డ్ వెల్వెట్ బస్ట్ జ్యువెలరీ షూట్",
      desc: lang === "en" ? "Transformed from a flat counter photo into a royal high-jewelry exhibition" : "కౌంటర్‌పై తీసిన ఫోటో నుంచి రాయల్ హై-జ్యువెలరీ ఎగ్జిబిషన్‌గా మారింది",
      tag: lang === "en" ? "Luxury Necklaces & Chokers" : "లగ్జరీ నెక్లెసెస్ & చోకర్స్",
      sourceTag: lang === "en" ? "Source: Flat counter snap" : "ఇన్‌పుట్: కౌంటర్‌పై ఫ్లాట్ ఫోటో",
      lightingTag: lang === "en" ? "Jeweler Spotlights • Glare-Free Emerald & Diamond Sparkle" : "జ్యువెలర్స్ స్పాట్‌లైట్స్ • రత్నాలు & వజ్రాల స్పార్కిల్",
      bullet1: lang === "en" ? "Place heavy bridal chokers or necklaces flat on velvet or a clean sheet." : "నెక్లెస్ లేదా చోకర్‌ని టేబుల్‌పై ఉంచి సాధారణ ఫోన్‌తో ఫోటో తీయండి.",
      bullet2: lang === "en" ? "Creates a luxury dark velvet bust exhibition highlighting every intricate stone." : "రిచ్ వెల్వెట్ స్టాండ్‌పై ప్రతి రాయి మెరిసేలా ప్రొఫెషనల్ లుక్ క్రియేట్ చేస్తుంది.",
      bullet3: lang === "en" ? "Customers trust the craftsmanship instantly and book orders without doubts." : "కస్టమర్లు డిజైన్ నైపుణ్యాన్ని చూసి ఎలాంటి సంకోచం లేకుండా ఆర్డర్ చేస్తారు.",
    },
    chain: {
      img: "/showcase/tryons/6.png",
      title: lang === "en" ? "Sculpted Dark Pedestal 22k Gold Chain Shoot" : "స్కల్ప్టెడ్ డార్క్ పెడెస్టల్ 22k గోల్డ్ చైన్ షూట్",
      desc: lang === "en" ? "Transformed from a plain box photo into an elite precious metal showcase" : "బాక్స్‌లో తీసిన ఫోటో నుంచి ఎలైట్ గోల్డ్ షోకేస్‌గా మారింది",
      tag: lang === "en" ? "Gold Chains & Mangalsutras" : "గోల్డ్ చైన్స్ & మంగళసూత్రాలు",
      sourceTag: lang === "en" ? "Source: Phone snap in box" : "ఇన్‌పుట్: బాక్స్‌లో ఫోన్ ఫోటో",
      lightingTag: lang === "en" ? "Directional Rim Light • Rich 22k Yellow Gold Speculars" : "డైరెక్షనల్ రిమ్ లైట్ • 22k గోల్డ్ సహజ పసుపు మెరుపు",
      bullet1: lang === "en" ? "Take a close photo of gold chains, chains with pendants, or mangalsutras." : "గోల్డ్ చైన్స్, పెండెంట్స్ లేదా మంగళసూత్రాలను ఫోన్ కెమెరాతో క్లోజప్‌గా తీయండి.",
      bullet2: lang === "en" ? "Displays intricate link patterns and lustrous gold finish on sleek pedestals." : "లింక్ డిజైన్, స్వచ్ఛమైన బంగారు రంగు స్పష్టంగా కనిపించేలా చూపిస్తుంది.",
      bullet3: lang === "en" ? "Ideal for daily gold rate updates and festival offers on WhatsApp status." : "డైలీ గోల్డ్ రేట్ అప్‌డేట్స్ మరియు వాట్సాప్ ఆఫర్స్ పోస్టింగ్ కోసం ఉత్తమం.",
    },
  };

  const curShowcase = showcaseData[activeShowcase];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col font-sans">

      {/* --- MINIMAL HEADER --- */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-primary)]/90 border-b border-black/5 dark:border-white/5 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo theme="dark" />
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

      {/* --- LIVE PROBLEM VS SOLUTION TRANSFORMATION (SINGLE LANDSCAPE PHOTO SLOT) --- */}
      <section id="live-transformation" className="py-8 sm:py-14 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-3xl font-black text-[var(--text-emphasis)] tracking-tight">
            {t.showcaseHeading}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto font-medium">
            {t.showcaseDesc}
          </p>

          {/* 10 Category Tabs */}
          <div className="w-full flex justify-center pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl nm-inset bg-[var(--bg-secondary)] max-w-4xl">
              {showcaseTabs.map((tab) => {
                const isActive = activeShowcase === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveShowcase(tab.id)}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all select-none ${isActive
                      ? "nm-outset bg-[var(--bg-secondary)] text-accent shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-accent hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                  >
                    <img
                      src={tab.thumb}
                      alt={tab.label[lang]}
                      className={`w-4 h-4 rounded-full object-cover shrink-0 transition-transform ${isActive ? "scale-105" : "opacity-75"
                        }`}
                    />
                    <span>{tab.label[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Showcase Container with SINGLE LANDSCAPE PHOTO SLOT */}
        <div className="nm-outset rounded-3xl p-4 sm:p-6 lg:p-7 bg-[var(--bg-secondary)] space-y-6">


          {/* THE SINGLE LANDSCAPE PHOTO SLOT */}
          <div className="nm-inset rounded-2xl p-2 sm:p-3 bg-[var(--bg-secondary)]">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] w-full rounded-xl overflow-hidden bg-neutral-950 shadow-md select-none group">

              {/* Single Landscape Image */}
              <img
                src={curShowcase.img}
                alt={curShowcase.title}
                className="w-full h-full object-cover object-center filter contrast-[1.03] transition-all duration-300 group-hover:scale-[1.01]"
                loading="lazy"
              />
            </div>
          </div>

          {/* 3 Step Workflow / Value Cards (Under Landscape Photo) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-1">
            <div className="nm-inset rounded-2xl p-3.5 sm:p-4 bg-[var(--bg-secondary)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl nm-outset bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 text-accent">
                <SmartphoneIcon className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-[var(--text-emphasis)] block">
                  {lang === "en" ? "1. Simple Phone Click" : "1. మీ ఫోన్‌తో ఒక ఫోటో"}
                </span>
                <p className="text-[10.5px] sm:text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed">
                  {curShowcase.bullet1}
                </p>
              </div>
            </div>

            <div className="nm-inset rounded-2xl p-3.5 sm:p-4 bg-[var(--bg-secondary)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl nm-outset bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 text-accent">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-accent block">
                  {lang === "en" ? "2. AI Studio Model Shoot" : "2. రాయల్ మోడల్ షూట్"}
                </span>
                <p className="text-[10.5px] sm:text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed">
                  {curShowcase.bullet2}
                </p>
              </div>
            </div>

            <div className="nm-inset rounded-2xl p-3.5 sm:p-4 bg-[var(--bg-secondary)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl nm-outset bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 text-accent">
                <ZapIcon className="w-4 h-4 text-accent" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-[var(--text-emphasis)] block">
                  {lang === "en" ? "3. Orders on WhatsApp" : "3. వాట్సాప్ & ఇన్‌స్టా ఆర్డర్లు"}
                </span>
                <p className="text-[10.5px] sm:text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed">
                  {curShowcase.bullet3}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Studio Trigger & Value Bar */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/5 dark:border-white/5">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs sm:text-sm font-black text-[var(--text-emphasis)] block">
                {lang === "en" ? "Ready to transform your own collection?" : "మీ స్వంత ఉత్పత్తులకు ఇప్పుడే ఫోటోషూట్ చేయండి"}
              </span>
              <span className="text-[10.5px] text-[var(--text-secondary)] font-medium block">
                {lang === "en" ? "From ₹1/photo • No monthly subscriptions • Ready in 30 seconds" : "కేవలం ₹1 నుంచే • ఎలాంటి నెలవారీ ఫీజులు లేవు • 30 సెకన్లలో రెడీ"}
              </span>
            </div>
            <Link
              to="/studio"
              className="px-6 py-3 rounded-2xl nm-outset bg-[var(--bg-secondary)] text-accent text-xs sm:text-sm font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all group shrink-0 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>{t.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 text-accent transition-transform group-hover:translate-x-1" />
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
              href="mailto:hi@srushtiai.in"
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
