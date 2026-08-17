import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { GENDER_GARMENT_MAPPING, GENDER_JEWELRY_MAPPING, GARMENT_CATEGORY_MAPPING, JEWELRY_CATEGORY_MAPPING } from "../utils/optionMapping";
import { AdminWorkspace } from "./AdminWorkspace";
import { SettingsWorkspace } from "./SettingsWorkspace";
import { WalletModal } from "./WalletModal";
import { WalletTransaction, getInitialWalletBalance, getInitialWalletTransactions, saveWalletBalance, saveWalletTransactions } from "../utils/wallet";
import { Logo } from "./Logo";
import { LOGOS_BASE64 } from "../assets/logoBase64";
import frontLogo from "../assets/front_logo.png";

const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const Pencil = (props: any) => <Icon icon="lucide:pencil" {...props} />;
const X = (props: any) => <Icon icon="lucide:x" {...props} />;
const Shirt = (props: any) => <Icon icon="lucide:shirt" {...props} />;
const Gem = (props: any) => <Icon icon="lucide:gem" {...props} />;
const CreditCard = (props: any) => <Icon icon="lucide:credit-card" {...props} />;
const Settings = (props: any) => <Icon icon="lucide:settings" {...props} />;
const UserIcon = (props: any) => <Icon icon="lucide:user" {...props} />;
const Download = (props: any) => <Icon icon="lucide:download" {...props} />;

const LuLayersIcon = (props: any) => <Icon icon="lucide:layers" {...props} />;
const LuSparklesIcon = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const LuPocketIcon = (props: any) => <Icon icon="lucide:pocket" {...props} />;
const LuFlowerIcon = (props: any) => <Icon icon="lucide:flower" {...props} />;
const LuLeafIcon = (props: any) => <Icon icon="lucide:leaf" {...props} />;
const LuCrownIcon = (props: any) => <Icon icon="lucide:crown" {...props} />;
const LuWatchIcon = (props: any) => <Icon icon="lucide:watch" {...props} />;
const LuCircleIcon = (props: any) => <Icon icon="lucide:circle" {...props} />;
const LuLinkIcon = (props: any) => <Icon icon="lucide:link" {...props} />;
const LuHeartIcon = (props: any) => <Icon icon="lucide:heart" {...props} />;

const KurtaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
    <path d="M6 3h12l3 5-3 14H6L3 8l3-5z" />
    <path d="M12 3v7" />
    <path d="M10 7h4" />
    <path d="M12 17v4" />
  </svg>
);

const SuitIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
    <path d="M4 3h16l-3 6v12H7V9L4 3z" />
    <path d="M8 3l4 6 4-6" />
    <path d="M12 9v12" />
    <polygon points="12,9 10.5,11.5 12,14 13.5,11.5" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

const WesternWearIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
    <path d="M9 2h6l2 4-2 4 3 12H6l3-12-2-4 2-4z" />
    <path d="M9 10h6" />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

const NecklaceIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
    <path d="M4 3c0 7 3.5 13 8 13s8-6 8-13" />
    <polygon points="12,15 15,19 12,22 9,19" fill="currentColor" fillOpacity="0.3" />
    <circle cx="7" cy="8" r="1" fill="currentColor" />
    <circle cx="17" cy="8" r="1" fill="currentColor" />
  </svg>
);

const ChokerIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
    <rect x="3" y="6" width="18" height="6" rx="2" fill="currentColor" fillOpacity="0.15" />
    <path d="M12 12v5" />
    <polygon points="12,17 14.5,20 12,22 9.5,20" fill="currentColor" />
  </svg>
);

const GARMENT_ICONS: Record<string, React.ReactNode> = {
  saree: <Icon icon="lucide:sparkles" className="w-4 h-4" />,
  western_wear: <WesternWearIcon />,
  westernwear: <WesternWearIcon />,
  "western wear": <WesternWearIcon />,
  jeans: <Icon icon="lucide:scissors" className="w-4 h-4" />,
  salwar: <Icon icon="lucide:flower-2" className="w-4 h-4" />,
  tshirt: <Shirt className="w-4 h-4" />,
  shirt: <Shirt className="w-4 h-4" />,
  kurta: <KurtaIcon />,
  suit: <SuitIcon />,
  classic_suit: <SuitIcon />,
  classicsuit: <SuitIcon />,
  "classic suit": <SuitIcon />,
  lehenga: <Icon icon="lucide:sparkles" className="w-4 h-4" />,
  gown: <Icon icon="lucide:crown" className="w-4 h-4" />,
  skirt: <Icon icon="lucide:layers" className="w-4 h-4" />,
  crop_top: <Shirt className="w-4 h-4" />,
  blouse: <Shirt className="w-4 h-4" />,
  sherwani: <KurtaIcon />,
  dhoti: <Icon icon="lucide:layers" className="w-4 h-4" />,
  blazer: <SuitIcon />,
  tracksuit: <Icon icon="lucide:activity" className="w-4 h-4" />,
  hoodie: <Shirt className="w-4 h-4" />,
};

const JEWELRY_ICONS: Record<string, React.ReactNode> = {
  earrings: <Icon icon="lucide:disc" className="w-4 h-4" />,
  necklace: <NecklaceIcon />,
  chain: <Icon icon="lucide:link" className="w-4 h-4" />,
  ring: <Icon icon="lucide:circle-dot" className="w-4 h-4" />,
  finger_ring: <Icon icon="lucide:circle-dot" className="w-4 h-4" />,
  thumb_ring: <Icon icon="lucide:circle-dot" className="w-4 h-4" />,
  solitaire: <Gem className="w-4 h-4" />,
  bracelet: <Icon icon="lucide:circle" className="w-4 h-4" />,
  watch: <Icon icon="lucide:watch" className="w-4 h-4" />,
  anklet: <Icon icon="lucide:footprints" className="w-4 h-4" />,
  payal: <Icon icon="lucide:footprints" className="w-4 h-4" />,
  toe_ring: <Icon icon="lucide:footprints" className="w-4 h-4" />,
  toe: <Icon icon="lucide:footprints" className="w-4 h-4" />,
  nose_ring: <Icon icon="lucide:circle-dot" className="w-4 h-4" />,
  nose_pin: <Icon icon="lucide:sparkles" className="w-4 h-4" />,
  nath: <Icon icon="lucide:circle-dot" className="w-4 h-4" />,
  nose: <Icon icon="lucide:circle-dot" className="w-4 h-4" />,
  noise: <Icon icon="lucide:circle-dot" className="w-4 h-4" />,
  waistband: <Icon icon="lucide:circle-dashed" className="w-4 h-4" />,
  hip_chain: <Icon icon="lucide:link" className="w-4 h-4" />,
  kamarbandh: <Icon icon="lucide:circle-dashed" className="w-4 h-4" />,
  bangles: <Icon icon="lucide:circle" className="w-4 h-4" />,
  choker: <ChokerIcon />,
  premium_choker: <ChokerIcon />,
  premiumchoker: <ChokerIcon />,
  "premium choker": <ChokerIcon />,
  cufflinks: <Icon icon="lucide:gem" className="w-4 h-4" />,
  pendant: <Icon icon="lucide:heart" className="w-4 h-4" />,
  kada: <Icon icon="lucide:circle" className="w-4 h-4" />,
  maang_tikka: <Icon icon="lucide:sparkles" className="w-4 h-4" />,
  matha_patti: <Icon icon="lucide:crown" className="w-4 h-4" />,
  borla: <Icon icon="lucide:sparkles" className="w-4 h-4" />,
  passa: <Icon icon="lucide:sparkles" className="w-4 h-4" />,
  headband: <Icon icon="lucide:crown" className="w-4 h-4" />,
};

const getGarmentIcon = (id: string) => {
  if (!id) return <Shirt className="w-4 h-4 text-accent" />;
  const cleanId = id.trim();
  const lower = cleanId.toLowerCase();
  const norm = lower.replace(/[\s_]+/g, "_");
  const noSpaces = lower.replace(/[\s_]+/g, "");
  return (
    GARMENT_ICONS[cleanId] ||
    GARMENT_ICONS[lower] ||
    GARMENT_ICONS[norm] ||
    GARMENT_ICONS[noSpaces] ||
    <Shirt className="w-4 h-4 text-accent" />
  );
};

const getJewelryIcon = (id: string) => {
  if (!id) return <Gem className="w-4 h-4 text-accent" />;
  const cleanId = id.trim();
  const lower = cleanId.toLowerCase();
  const norm = lower.replace(/[\s_]+/g, "_");
  const noSpaces = lower.replace(/[\s_]+/g, "");
  return (
    JEWELRY_ICONS[cleanId] ||
    JEWELRY_ICONS[lower] ||
    JEWELRY_ICONS[norm] ||
    JEWELRY_ICONS[noSpaces] ||
    <Gem className="w-4 h-4 text-accent" />
  );
};

interface SingleRowSliderProps {
  items: string[];
  selectedId: string;
  onSelect: (id: string) => void;
  getItemIcon: (id: string) => React.ReactNode;
  t: Record<string, string>;
}

const SingleRowSlider: React.FC<SingleRowSliderProps> = ({
  items,
  selectedId,
  onSelect,
  getItemIcon,
  t,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const isMouseDown = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeftPos = React.useRef(0);
  const hasDragged = React.useRef(false);

  const updateScrollState = () => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length > 0) {
      const containerCenter = scrollLeft + clientWidth / 2;
      let closestIdx = 0;
      let minDistance = Infinity;
      children.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(containerCenter - childCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    }
  };

  useEffect(() => {
    updateScrollState();
    if (containerRef.current && items.length > 0) {
      const selectedIndex = items.indexOf(selectedId);
      if (selectedIndex !== -1) {
        const el = containerRef.current;
        const child = el.children[selectedIndex] as HTMLElement;
        if (child) {
          child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      }
    }
  }, [items, selectedId]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const amount = direction === "left" ? -180 : 180;
    containerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const scrollToItem = (index: number) => {
    if (!containerRef.current) return;
    const child = containerRef.current.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isMouseDown.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftPos.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    containerRef.current.scrollLeft = scrollLeftPos.current - walk;
    updateScrollState();
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    isMouseDown.current = true;
    hasDragged.current = false;
    startX.current = e.touches[0].pageX - containerRef.current.offsetLeft;
    scrollLeftPos.current = containerRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMouseDown.current || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    containerRef.current.scrollLeft = scrollLeftPos.current - walk;
    updateScrollState();
  };

  const handleTouchEnd = () => {
    isMouseDown.current = false;
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="py-1 w-full">
      <div className="flex flex-wrap items-center justify-center gap-2 py-1 px-1 w-full">
        {items.map((id) => {
          const isSelected = selectedId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`min-w-[80px] sm:min-w-[90px] p-2 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isSelected
                  ? "nm-inset-sm text-accent scale-[0.98] font-black"
                  : "nm-outset-sm hover:scale-[1.02]"
              }`}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full nm-inset-sm flex items-center justify-center flex-shrink-0">
                {getItemIcon(id)}
              </div>
              <span className="text-[8.5px] sm:text-[10px] font-bold text-center leading-tight break-words max-w-full whitespace-normal">
                {t[id] || id}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface HeaderProps {
  title: string;
  subtitle: string;
  workspace: string;
  garmentModelGender: "female" | "male";
  jewelryModelGender: "female" | "male";
  onSelectBusiness: (category: "garment" | "jewelry", gender: "female" | "male") => void;
  lang: "en" | "te";
  
  // Billing props
  apiKey: string;
  apiInput: string;
  setApiInput: (val: string) => void;
  onSaveApiKey: () => void;
  estimatedCost: string;
  selectedImageModel: string;
  setSelectedImageModel: (val: string) => void;
  gptImageQuality?: "low" | "medium" | "high";
  setGptImageQuality?: (val: "low" | "medium" | "high") => void;
  selectedVideoModel: string;
  setSelectedVideoModel: (val: string) => void;
  currency: "USD" | "INR";
  setCurrency: (val: "USD" | "INR") => void;
  usdToInrRate: number;
  setUsdToInrRate: (val: number) => void;
  onRefreshLiveRate?: () => void;
  isFetchingRate?: boolean;
  rateFetchStatus?: string | null;
  t: any;

  // Settings props
  theme: "light" | "dark";
  setTheme: (val: "light" | "dark") => void;
  setLang: (val: "en" | "te") => void;
  isValidatingKey?: boolean;
  keyValidationError?: string | null;
  setKeyValidationError?: (val: string | null) => void;

  // Extended provider and key props
  selectedProvider?: "all" | "openai" | "google";
  setSelectedProvider?: (val: "all" | "openai" | "google") => void;
  geminiApiKey?: string;
  geminiApiInput?: string;
  setGeminiApiInput?: (val: string) => void;
  onSaveGeminiApiKey?: (val?: string) => void;
  openaiApiKey?: string;
  openaiApiInput?: string;
  setOpenaiApiInput?: (val: string) => void;
  onSaveOpenaiApiKey?: (val?: string) => void;

  // Moved item selections props
  garmentType: "saree" | "tshirt" | "jeans" | "shirt" | "western_wear" | "kurta" | "suit" | "salwar" | "lehenga" | "gown" | "skirt" | "crop_top" | "blouse" | "sherwani" | "dhoti" | "blazer" | "tracksuit" | "hoodie";
  setGarmentType: (val: any) => void;
  jewelryType: "earrings" | "necklace" | "chain" | "ring" | "bracelet" | "watch" | "anklet" | "nose_ring" | "nose" | "noise" | "bangles" | "choker" | "cufflinks" | "pendant" | "kada" | "maang_tikka" | "matha_patti" | "borla" | "passa" | "headband";
  setJewelryType: (val: any) => void;

  // Wallet props
  walletBalance?: number;
  walletTransactions?: WalletTransaction[];
  onRecharge?: (amount: number, bonus: number, note: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  workspace,
  garmentModelGender,
  jewelryModelGender,
  onSelectBusiness,
  lang,
  
  // Billing props
  apiKey,
  apiInput,
  setApiInput,
  onSaveApiKey,
  estimatedCost,
  selectedImageModel,
  setSelectedImageModel,
  gptImageQuality,
  setGptImageQuality,
  selectedVideoModel,
  setSelectedVideoModel,
  currency,
  setCurrency,
  usdToInrRate,
  setUsdToInrRate,
  onRefreshLiveRate,
  isFetchingRate,
  rateFetchStatus,
  t,

  // Settings props
  theme,
  setTheme,
  setLang,
  isValidatingKey,
  keyValidationError,
  setKeyValidationError,

  // Extended provider and key props
  selectedProvider,
  setSelectedProvider,
  geminiApiKey,
  geminiApiInput,
  setGeminiApiInput,
  onSaveGeminiApiKey,
  openaiApiKey,
  openaiApiInput,
  setOpenaiApiInput,
  onSaveOpenaiApiKey,

  // Moved item selections props
  garmentType,
  setGarmentType,
  jewelryType,
  setJewelryType,

  // Wallet props
  walletBalance: propWalletBalance,
  walletTransactions: propWalletTransactions,
  onRecharge: propOnRecharge,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Internal wallet fallback state if not provided from top
  const [internalWalletBalance, setInternalWalletBalance] = useState<number>(() =>
    getInitialWalletBalance(currency)
  );
  const [internalTransactions, setInternalTransactions] = useState<WalletTransaction[]>(() =>
    getInitialWalletTransactions()
  );

  const activeWalletBalance =
    propWalletBalance !== undefined ? propWalletBalance : internalWalletBalance;
  const activeTransactions =
    propWalletTransactions !== undefined ? propWalletTransactions : internalTransactions;

  const handleWalletRecharge = (amount: number, bonus: number, note: string) => {
    if (propOnRecharge) {
      propOnRecharge(amount, bonus, note);
    } else {
      const total = amount + bonus;
      setInternalWalletBalance((prev) => {
        const next = prev + total;
        saveWalletBalance(currency, next);
        return next;
      });
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: "credit",
        amount: total,
        currency: currency,
        title:
          currency === "INR"
            ? `UPI / Card Top-up (+₹${bonus} Bonus)`
            : `Card Top-up (+$${bonus.toFixed(2)} Bonus)`,
        titleTe:
          currency === "INR"
            ? `UPI / కార్డ్ టాప్-అప్ (+₹${bonus} బోనస్)`
            : `కార్డ్ టాప్-అప్ (+$${bonus.toFixed(2)} బోనస్)`,
        description: note,
        descriptionTe: note,
        date: "Just now",
        status: "success",
        category: "recharge",
      };
      setInternalTransactions((prev) => {
        const next = [newTx, ...prev];
        saveWalletTransactions(next);
        return next;
      });
    }
  };
  const [isSignedOut, setIsSignedOut] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("srushti_is_signed_out") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("srushti_is_signed_out", isSignedOut ? "true" : "false");
    }
    if (isSignedOut) {
      setIsSettingsOpen(true);
    }
  }, [isSignedOut]);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    const isMarked = localStorage.getItem("srushti_pwa_installed") === "true";
    return isStandalone || isMarked;
  });
  const isEn = lang === "en";

  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = typeof navigator !== "undefined" && /Android/.test(navigator.userAgent);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.setItem("srushti_pwa_installed", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(display-mode: standalone)");
      const handleDisplayChange = (evt: MediaQueryListEvent) => {
        if (evt.matches) {
          setIsInstalled(true);
          localStorage.setItem("srushti_pwa_installed", "true");
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleDisplayChange);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Temporary selection states to support the Confirm button workflow
  const [tempWorkspace, setTempWorkspace] = useState<"garment" | "jewelry">(
    (workspace === "garment" || workspace === "jewelry") ? workspace : "garment"
  );
  const [tempGarmentGender, setTempGarmentGender] = useState<"female" | "male">(garmentModelGender);
  const [tempJewelryGender, setTempJewelryGender] = useState<"female" | "male">(jewelryModelGender);
  const [tempGarmentType, setTempGarmentType] = useState<any>(garmentType);
  const [tempJewelryType, setTempJewelryType] = useState<any>(jewelryType);
  const [tempGarmentCategoryFilter, setTempGarmentCategoryFilter] = useState<"full_wear" | "top_wear" | "bottom_wear">("full_wear");
  const [tempJewelryCategoryFilter, setTempJewelryCategoryFilter] = useState<"neck_ear" | "ear_wear" | "wrist_ring" | "hip" | "nose" | "leg" | "forehead" | "accessories">("neck_ear");

  const handleOpenModal = () => {
    setTempWorkspace((workspace === "garment" || workspace === "jewelry") ? workspace : "garment");
    setTempGarmentGender(garmentModelGender);
    setTempJewelryGender(jewelryModelGender);
    setTempGarmentType(garmentType);
    setTempJewelryType(jewelryType);
    setTempGarmentCategoryFilter("full_wear");
    setTempJewelryCategoryFilter("neck_ear");
    setIsOpen(true);
  };

  useEffect(() => {
    const handleOpenBusinessModalEvent = () => {
      handleOpenModal();
    };
    window.addEventListener("srushti:open-business-modal", handleOpenBusinessModalEvent);
    return () => {
      window.removeEventListener("srushti:open-business-modal", handleOpenBusinessModalEvent);
    };
  }, [workspace, garmentModelGender, jewelryModelGender, garmentType, jewelryType]);

  return (
    <header className="px-4 pt-2 pb-3 mx-auto max-w-lg sm:max-w-xl md:max-w-3xl landscape:max-w-full lg:landscape:max-w-full xl:landscape:max-w-full 2xl:landscape:max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] w-full shrink-0">
      <div className="nm-outset rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 w-full">
        {/* Brand title */}
        <div className="flex items-center gap-2">
          <Logo />
          <div>
            <h1 className="text-base font-bold tracking-tight text-[var(--text-emphasis)] leading-none font-sans">
              {title}
            </h1>
            <p className="text-[9px] font-medium opacity-75 mt-0.5 leading-none font-sans">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Actions panel with Wallet, Billing and Settings triggers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet balance trigger button */}
          <button
            id="btn-trigger-wallet-modal"
            type="button"
            onClick={() => setIsWalletOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl nm-outset-sm hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer bg-[var(--bg-panel)] text-[var(--text-emphasis)] shrink-0"
            title={isEn ? "Studio Wallet & Credits" : "స్టూడియో వాలెట్ & క్రెడిట్స్"}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center nm-inset-sm bg-accent/10 text-accent shrink-0">
              <Icon icon="lucide:wallet" className="w-3 h-3 text-accent" />
            </div>
            <span className="text-xs font-black font-mono text-accent">
              {currency === "INR" ? `₹${activeWalletBalance.toFixed(2)}` : `$${activeWalletBalance.toFixed(2)}`}
            </span>
          </button>

          {/* Admin Panel popup trigger icon */}
          <button
            id="btn-trigger-admin-modal"
            onClick={() => setIsBillingOpen(true)}
            className="w-8 h-8 rounded-xl nm-outset-sm hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center text-accent transition-all cursor-pointer bg-[var(--bg-panel)] shrink-0"
            title={isEn ? "Admin Panel" : "అడ్మిన్ ప్యానెల్"}
          >
            <CreditCard className="w-4 h-4" />
          </button>

          {/* Profile popup trigger icon */}
          <button
            id="btn-trigger-settings-modal"
            onClick={() => setIsSettingsOpen(true)}
            className="w-8 h-8 rounded-xl nm-outset-sm hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center text-accent transition-all cursor-pointer bg-[var(--bg-panel)] shrink-0"
            title={isEn ? "Profile" : "ప్రొఫైల్"}
          >
            <UserIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pop-up Dialog for selecting categories and subcategories */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
              className="relative bg-[var(--bg-primary)] rounded-[2rem] p-5 sm:p-6 max-w-lg w-full border border-neutral-300 dark:border-neutral-700 text-[var(--text-primary)] z-10 h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col space-y-4"
            >
              {/* Header inside the popup card */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/5 dark:border-white/5">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-emphasis)] tracking-tight">
                    {isEn ? "Select Business" : "బిజినెస్ ఎంచుకోండి"}
                  </h3>
                  <p className="text-[10px] opacity-75 mt-0.5 leading-relaxed">
                    {isEn 
                      ? "Choose product category & collection" 
                      : "ఫోటోగ్రఫీ కొరకు కేటగిరి మరియు కలెక్షన్ ఎంచుకోండి"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Language Toggle on right edge */}
                  <div className="flex items-center p-1 rounded-xl nm-inset-sm gap-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setLang("en")}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        lang === "en"
                          ? "bg-accent text-white shadow-xs font-extrabold"
                          : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("te")}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        lang === "te"
                          ? "bg-accent text-white shadow-xs font-extrabold"
                          : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                      }`}
                    >
                      తెలుగు
                    </button>
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-full nm-outset flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Icon icon="lucide:x" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Selection Blocks */}
              {/* Garments block */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black tracking-wider uppercase opacity-60 flex items-center gap-1">
                  <Shirt className="w-3.5 h-3.5 text-accent" />
                  {isEn ? "Garment" : "బట్టలు (Garment)"}
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTempWorkspace("garment");
                      setTempGarmentGender("female");
                      if (!GENDER_GARMENT_MAPPING.female.includes(tempGarmentType as any)) {
                        setTempGarmentType("saree");
                      }
                    }}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                      tempWorkspace === "garment" && tempGarmentGender === "female"
                        ? "nm-inset text-accent font-extrabold"
                        : "nm-outset-sm hover:scale-[1.02] active:scale-[0.98] text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="text-[11px] font-bold">
                      {isEn ? "Female Collection" : "మహిళల కలెక్షన్"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTempWorkspace("garment");
                      setTempGarmentGender("male");
                      if (!GENDER_GARMENT_MAPPING.male.includes(tempGarmentType as any)) {
                        setTempGarmentType("shirt");
                      }
                    }}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                      tempWorkspace === "garment" && tempGarmentGender === "male"
                        ? "nm-inset text-accent font-extrabold"
                        : "nm-outset-sm hover:scale-[1.02] active:scale-[0.98] text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="text-[11px] font-bold">
                      {isEn ? "Male Collection" : "పురుషుల కలెక్షన్"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Jewelry block */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black tracking-wider uppercase opacity-60 flex items-center gap-1">
                  <Gem className="w-3.5 h-3.5 text-accent" />
                  {isEn ? "Jewelry" : "నగలు (Jewelry)"}
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTempWorkspace("jewelry");
                      setTempJewelryGender("female");
                      if (!GENDER_JEWELRY_MAPPING.female.includes(tempJewelryType as any)) {
                        setTempJewelryType("necklace");
                      }
                    }}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                      tempWorkspace === "jewelry" && tempJewelryGender === "female"
                        ? "nm-inset text-accent font-extrabold"
                        : "nm-outset-sm hover:scale-[1.02] active:scale-[0.98] text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="text-[11px] font-bold">
                      {isEn ? "Female Collection" : "మహిళల కలెక్షన్"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTempWorkspace("jewelry");
                      setTempJewelryGender("male");
                      if (!GENDER_JEWELRY_MAPPING.male.includes(tempJewelryType as any)) {
                        setTempJewelryType("chain");
                      }
                    }}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
                      tempWorkspace === "jewelry" && tempJewelryGender === "male"
                        ? "nm-inset text-accent font-extrabold"
                        : "nm-outset-sm hover:scale-[1.02] active:scale-[0.98] text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="text-[11px] font-bold">
                      {isEn ? "Male Collection" : "పురుషుల కలెక్షన్"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Select Item block */}
              <div className="space-y-2.5 pt-1">
                <label className="text-[10px] font-black tracking-wider uppercase opacity-60 flex items-center gap-1">
                  {tempWorkspace === "garment" ? <Shirt className="w-3.5 h-3.5 text-accent" /> : <Gem className="w-3.5 h-3.5 text-accent" />}
                  {isEn ? "Select Item" : "వస్తువును ఎంచుకోండి"}
                </label>

                {/* Dynamic Item Grid inside Select Business popup for Garment */}
                {tempWorkspace === "garment" && (
                  <div className="space-y-2.5">
                    {/* Temp Category Filter */}
                    <div className="flex flex-wrap gap-1 p-1.5 rounded-xl nm-inset-sm max-w-full">
                      {(["full_wear", "top_wear", "bottom_wear"] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setTempGarmentCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all text-center uppercase tracking-tight ${
                            tempGarmentCategoryFilter === cat
                              ? "bg-accent/10 text-accent font-black nm-outset-xs"
                              : "text-[var(--text-primary)] text-opacity-60 hover:text-opacity-90"
                          }`}
                        >
                          {cat === "full_wear" && (isEn ? "Full" : "పూర్తి")}
                          {cat === "top_wear" && (isEn ? "Top" : "పై")}
                          {cat === "bottom_wear" && (isEn ? "Bottom" : "క్రింది")}
                        </button>
                      ))}
                    </div>

                    <SingleRowSlider
                      items={GENDER_GARMENT_MAPPING[tempGarmentGender].filter((id) =>
                        (GARMENT_CATEGORY_MAPPING[tempGarmentCategoryFilter] as readonly string[]).includes(id)
                      )}
                      selectedId={tempGarmentType}
                      onSelect={(id) => setTempGarmentType(id)}
                      getItemIcon={getGarmentIcon}
                      t={t}
                    />
                  </div>
                )}

                {/* Dynamic Item Grid inside Select Business popup for Jewelry */}
                {tempWorkspace === "jewelry" && (
                  <div className="space-y-2.5">
                    {/* Temp Category Filter */}
                    <div className="flex flex-wrap gap-1 p-1.5 rounded-xl nm-inset-sm max-w-full">
                      {(["neck_ear", "ear_wear", "wrist_ring", "hip", "nose", "leg", "forehead", "accessories"] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setTempJewelryCategoryFilter(cat as any)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all text-center uppercase tracking-tight ${
                            tempJewelryCategoryFilter === cat
                              ? "bg-accent/10 text-accent font-black nm-outset-xs"
                              : "text-[var(--text-primary)] text-opacity-60 hover:text-opacity-90"
                          }`}
                        >
                          {cat === "neck_ear" && (isEn ? "Neck" : "నెక్")}
                          {cat === "ear_wear" && (isEn ? "Ear" : "చెవి")}
                          {cat === "wrist_ring" && (isEn ? "Wrist" : "రిస్ట్")}
                          {cat === "hip" && (isEn ? "Hip" : "వడ్డాణం")}
                          {cat === "nose" && (isEn ? "Nose" : "ముక్కు")}
                          {cat === "leg" && (isEn ? "Leg" : "కాలు / పట్టీలు")}
                          {cat === "forehead" && (isEn ? "Forehead" : "పాపిడి బిళ్ళ")}
                          {cat === "accessories" && (isEn ? "Other" : "ఇతర")}
                        </button>
                      ))}
                    </div>

                    <SingleRowSlider
                      items={GENDER_JEWELRY_MAPPING[tempJewelryGender].filter((id) =>
                        (JEWELRY_CATEGORY_MAPPING[tempJewelryCategoryFilter] as readonly string[]).includes(id)
                      )}
                      selectedId={tempJewelryType}
                      onSelect={(id) => setTempJewelryType(id)}
                      getItemIcon={getJewelryIcon}
                      t={t}
                    />
                  </div>
                )}
              </div>

              {/* Confirm Button */}
              <div className="pt-2 mt-auto">
                <button
                  id="btn-confirm-business"
                  type="button"
                  onClick={() => {
                    const finalGender = tempWorkspace === "garment" ? tempGarmentGender : tempJewelryGender;
                    onSelectBusiness(tempWorkspace, finalGender);
                    if (tempWorkspace === "garment") {
                      setGarmentType(tempGarmentType);
                    } else if (tempWorkspace === "jewelry") {
                      setJewelryType(tempJewelryType);
                    }
                    setIsOpen(false);
                  }}
                  className="w-full py-3 rounded-2xl text-xs font-black tracking-wide nm-outset flex items-center justify-center gap-2 text-[var(--text-emphasis)] bg-accent/10 hover:bg-accent/15 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                  {isEn ? "Confirm Selection" : "సెలక్షన్ నిర్ధారించండి"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pop-up Dialog for Billing */}
      <AnimatePresence>
        {isBillingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBillingOpen(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
              className="relative bg-[var(--bg-primary)] rounded-[2rem] p-6 max-w-lg landscape:max-w-3xl lg:max-w-4xl w-full space-y-4 border border-neutral-300 dark:border-neutral-700 text-[var(--text-primary)] z-10 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-none"
            >
              {/* Header inside the popup card */}
              <div className="flex items-start justify-between border-b border-white/5 pb-2">
                <div>
                  <h3 className="text-sm font-extrabold text-[var(--text-emphasis)] tracking-tight">
                    {t.billingTitle}
                  </h3>
                  <p className="text-[10px] opacity-75 mt-0.5 leading-relaxed">
                    {t.billingSubtitle}
                  </p>
                </div>
                <button
                  onClick={() => setIsBillingOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center nm-outset-sm hover:scale-105 active:scale-95 text-accent cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Admin Workspace Component */}
              <div className="pt-2">
                <AdminWorkspace
                  apiKey={apiKey}
                  apiInput={apiInput}
                  setApiInput={setApiInput}
                  onSaveApiKey={onSaveApiKey}
                  estimatedCost={estimatedCost}
                  lang={lang}
                  t={t}
                  selectedImageModel={selectedImageModel}
                  setSelectedImageModel={setSelectedImageModel}
                  gptImageQuality={gptImageQuality}
                  setGptImageQuality={setGptImageQuality}
                  selectedVideoModel={selectedVideoModel}
                  setSelectedVideoModel={setSelectedVideoModel}
                  selectedProvider={selectedProvider}
                  setSelectedProvider={setSelectedProvider}
                  currency={currency}
                  setCurrency={setCurrency}
                  usdToInrRate={usdToInrRate}
                  setUsdToInrRate={setUsdToInrRate}
                  onRefreshLiveRate={onRefreshLiveRate}
                  isFetchingRate={isFetchingRate}
                  rateFetchStatus={rateFetchStatus}
                  hideTitle={true}
                  isValidatingKey={isValidatingKey}
                  keyValidationError={keyValidationError}
                  setKeyValidationError={setKeyValidationError}
                  openaiApiKey={openaiApiKey}
                  openaiApiInput={openaiApiInput}
                  setOpenaiApiInput={setOpenaiApiInput}
                  onSaveOpenaiApiKey={onSaveOpenaiApiKey}
                  geminiApiKey={geminiApiKey}
                  geminiApiInput={geminiApiInput}
                  setGeminiApiInput={setGeminiApiInput}
                  onSaveGeminiApiKey={onSaveGeminiApiKey}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pop-up Dialog for Settings */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSignedOut) {
                  setIsSettingsOpen(false);
                }
              }}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
              className="relative bg-[var(--bg-primary)] rounded-[2rem] p-4 sm:p-6 md:p-8 w-[90vw] max-w-[90vw] lg:max-w-4xl space-y-4 border border-neutral-300 dark:border-neutral-700 text-[var(--text-primary)] z-10 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-xl transition-all"
            >
              {/* Header inside the popup card (hidden when signed out) */}
              {!isSignedOut && (
                <div className="flex items-start justify-between border-b border-white/5 pb-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[var(--text-emphasis)] tracking-tight">
                      {t.settingsTitle}
                    </h3>
                    <p className="text-[10px] opacity-75 mt-0.5 leading-relaxed">
                      {t.settingsSubtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-7 h-7 rounded-full flex items-center justify-center nm-outset-sm hover:scale-105 active:scale-95 text-accent cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Settings Workspace Component */}
              <div className="pt-2">
                <SettingsWorkspace
                  apiKey={apiKey}
                  apiInput={apiInput}
                  setApiInput={setApiInput}
                  onSaveApiKey={onSaveApiKey}
                  theme={theme}
                  setTheme={setTheme}
                  lang={lang}
                  setLang={setLang}
                  t={t}
                  hideTitle={true}
                  isValidatingKey={isValidatingKey}
                  keyValidationError={keyValidationError}
                  setKeyValidationError={setKeyValidationError}
                  selectedProvider={selectedProvider}
                  setSelectedProvider={setSelectedProvider}
                  selectedImageModel={selectedImageModel}
                  selectedVideoModel={selectedVideoModel}
                  openaiApiKey={openaiApiKey}
                  openaiApiInput={openaiApiInput}
                  setOpenaiApiInput={setOpenaiApiInput}
                  onSaveOpenaiApiKey={onSaveOpenaiApiKey}
                  isSignedOut={isSignedOut}
                  setIsSignedOut={setIsSignedOut}
                  onCloseModal={() => setIsSettingsOpen(false)}
                  onSignInSuccess={() => {
                    setIsSettingsOpen(false);
                    setTimeout(() => {
                      handleOpenModal();
                    }, 100);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pop-up Dialog for Download / Install App */}
      <AnimatePresence>
        {isDownloadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDownloadOpen(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
              className="relative bg-[var(--bg-primary)] rounded-[2.5rem] p-6 max-w-xs sm:max-w-sm w-full border border-neutral-300 dark:border-neutral-700 text-[var(--text-primary)] z-10 shadow-2xl space-y-4 text-center"
            >
              <button
                onClick={() => setIsDownloadOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center nm-outset-sm hover:scale-105 active:scale-95 text-accent cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* App Logo */}
              <div className="pt-2 flex justify-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden nm-outset-sm p-1.5 bg-[var(--bg-panel)] flex items-center justify-center shadow-md">
                  <img
                    src={LOGOS_BASE64.front || frontLogo || "/assets/front_logo.png"}
                    alt="Srushti AI Logo"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.dataset.failed) {
                        target.dataset.failed = "1";
                        target.src = frontLogo || "/assets/front_logo.png";
                      } else if (target.dataset.failed === "1") {
                        target.dataset.failed = "2";
                        target.src = "/front_logo.png";
                      }
                    }}
                  />
                </div>
              </div>

              {/* App Name & Tagline */}
              <div>
                <h3 className="text-xl font-extrabold text-[var(--text-emphasis)] tracking-tight">
                  Srushti AI
                </h3>
                <p className="text-xs font-bold text-accent mt-0.5 uppercase tracking-wider">
                  Business to Brand
                </p>
                <p className="text-[11px] opacity-75 mt-2 leading-relaxed px-1">
                  {isEn
                    ? "Install Srushti AI on your tablet or mobile device as a Progressive Web App (PWA) for an offline-capable, fullscreen studio experience."
                    : "మీ టాబ్లెట్ లేదా మొబైల్‌లో PWA ద్వారా రన్ అయ్యే వేగవంతమైన అనుభవం కోసం Srushti AI ఇన్‌స్టాల్ చేయండి."}
                </p>
              </div>

              {/* Google Chrome & Browser Instruction Box */}
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-3.5 text-left border border-black/5 dark:border-white/5 space-y-2 text-[11px]">
                <p className="font-extrabold text-accent text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isEn ? "Install Srushti AI via Google Chrome:" : "గూగుల్ క్రోమ్‌ ద్వారా ఇన్‌స్టాల్ చేయు విధానం:"}
                  </span>
                </p>

                <div className="space-y-2 text-[11px] opacity-90 leading-relaxed">
                  <div className="flex items-start gap-2 bg-[var(--bg-panel)] p-2 rounded-xl border border-black/5 dark:border-white/5">
                    <span className="w-5 h-5 rounded-full bg-accent/10 text-accent font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      {isEn ? (
                        <>Open <strong>Google Chrome</strong> and click the <strong>three-dots menu (⋮)</strong> in the top-right corner.</>
                      ) : (
                        <><strong>గూగుల్ క్రోమ్</strong> ఓపెన్ చేసి పై భాగాన ఉన్న <strong>మూడు చుక్కల మెనూ (⋮)</strong> క్లిక్ చేయండి.</>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-[var(--bg-panel)] p-2 rounded-xl border border-black/5 dark:border-white/5">
                    <span className="w-5 h-5 rounded-full bg-accent/10 text-accent font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      {isEn ? (
                        <div className="flex items-center flex-wrap gap-1">
                          <span>Select</span>
                          <span className="font-extrabold text-accent bg-accent/10 px-1.5 py-0.5 rounded-md border border-accent/20 flex items-center gap-1">
                            <img
                              src={LOGOS_BASE64.front || frontLogo || "/assets/front_logo.png"}
                              alt="App Icon"
                              className="w-4 h-4 object-contain rounded-sm"
                            />
                            Install page as an app
                          </span>
                          <span>(or "Install app").</span>
                        </div>
                      ) : (
                        <div className="flex items-center flex-wrap gap-1">
                          <span>మెనూలో</span>
                          <span className="font-extrabold text-accent bg-accent/10 px-1.5 py-0.5 rounded-md border border-accent/20 flex items-center gap-1">
                            <img
                              src={LOGOS_BASE64.front || frontLogo || "/assets/front_logo.png"}
                              alt="App Icon"
                              className="w-4 h-4 object-contain rounded-sm"
                            />
                            Install page as an app
                          </span>
                          <span>లేదా "Add to Home Screen" ఎంచుకోండి.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isIOS && (
                  <div className="pt-1 text-[10px] opacity-75 border-t border-black/5 dark:border-white/5">
                    {isEn
                      ? "On iPhone/Safari: Tap Share ⎋ → Add to Home Screen ⊕"
                      : "iPhone/Safari లో: Share ⎋ క్లిక్ చేసి → Add to Home Screen ⊕ ఎంచుకోండి"}
                  </div>
                )}
              </div>

              {/* Download / Install Button */}
              <div className="pt-1 pb-1">
                <button
                  onClick={async () => {
                    if (deferredPrompt) {
                      try {
                        await deferredPrompt.prompt();
                        const choice = await deferredPrompt.userChoice;
                        if (choice && choice.outcome === "accepted") {
                          setIsInstalled(true);
                          localStorage.setItem("srushti_pwa_installed", "true");
                        }
                      } catch (err) {
                        console.error("Install prompt error:", err);
                      }
                      setDeferredPrompt(null);
                      setIsDownloadOpen(false);
                    } else {
                      setIsInstalled(true);
                      localStorage.setItem("srushti_pwa_installed", "true");
                      setIsDownloadOpen(false);
                    }
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl bg-accent text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {deferredPrompt 
                      ? (isEn ? "Install App Now" : "ఇప్పుడే ఇన్‌స్టాల్ చేయండి") 
                      : (isEn ? "Got It / Add to Home Screen" : "అర్థమైంది / హోమ్ స్క్రీన్‌కి జోడించు")}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pop-up Dialog for Studio Wallet & Credits */}
      <AnimatePresence>
        {isWalletOpen && (
          <WalletModal
            isOpen={isWalletOpen}
            onClose={() => setIsWalletOpen(false)}
            currency={currency}
            walletBalance={activeWalletBalance}
            transactions={activeTransactions}
            onRecharge={handleWalletRecharge}
            lang={lang}
            usdToInrRate={usdToInrRate}
          />
        )}
      </AnimatePresence>

    </header>
  );
};
