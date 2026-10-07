import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { GENDER_GARMENT_MAPPING, GENDER_JEWELRY_MAPPING, GARMENT_CATEGORY_MAPPING, JEWELRY_CATEGORY_MAPPING } from "../utils/optionMapping";
import { useStudioConfig, FALLBACK_WORKSPACES } from "../context/StudioConfigContext";

const SettingsWorkspace = lazy(() =>
  import("./SettingsWorkspace").then((m) => ({ default: m.SettingsWorkspace }))
);
const WalletModal = lazy(() =>
  import("./WalletModal").then((m) => ({ default: m.WalletModal }))
);
const HistoryModal = lazy(() =>
  import("./HistoryModal").then((m) => ({ default: m.HistoryModal }))
);
import { WalletTransaction, getInitialWalletBalance, getInitialWalletTransactions, saveWalletBalance, saveWalletTransactions, formatCredits } from "../utils/wallet";
import { Logo } from "./Logo";
import { getStoredAuthUser, getAuthToken, fetchCurrentUserApi, AuthUser, CatalogItemRecord, BusinessCategoryRecord } from "../utils/api";
import { JewelryType } from "../types";

const Sparkles = (props: any) => <Icon icon="lucide:sparkles" {...props} />;
const Pencil = (props: any) => <Icon icon="lucide:pencil" {...props} />;
const X = (props: any) => <Icon icon="lucide:x" {...props} />;
const Shirt = (props: any) => <Icon icon="lucide:shirt" {...props} />;
const Gem = (props: any) => <Icon icon="lucide:gem" {...props} />;
const CreditCard = (props: any) => <Icon icon="lucide:credit-card" {...props} />;
const Settings = (props: any) => <Icon icon="lucide:settings" {...props} />;
const UserIcon = (props: any) => <Icon icon="lucide:user" {...props} />;
const Check = (props: any) => <Icon icon="lucide:check" {...props} />;

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
  catalogItemsMap?: Map<string, CatalogItemRecord>;
  lang?: "en" | "te";
}

const SingleRowSlider: React.FC<SingleRowSliderProps> = ({
  items,
  selectedId,
  onSelect,
  getItemIcon,
  t,
  catalogItemsMap,
  lang = "en",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const hasDragged = useRef(false);

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
      <div className="flex flex-wrap items-stretch justify-center gap-2 py-1 px-0.5 w-full">
        {items.map((id) => {
          const isSelected = selectedId === id;
          const catItem = catalogItemsMap?.get(id);
          const displayName = lang === "te"
            ? (catItem?.nameTe || t[id] || id)
            : (catItem?.nameEn || t[id] || id.replace(/_/g, " "));

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`relative min-w-[76px] xs:min-w-[84px] sm:min-w-[94px] max-w-[120px] flex-1 py-2.5 px-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "nm-inset bg-accent/10 text-accent font-black shadow-inner border border-accent/30 scale-[0.98]"
                  : "nm-outset-sm hover:scale-[1.03] active:scale-[0.97] text-[var(--text-primary)] hover:text-accent bg-[var(--bg-secondary)]/50"
              }`}
            >
              {isSelected && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-accent text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2 h-2 stroke-[3]" />
                </span>
              )}

              {/* Label */}
              <span className={`text-[11px] sm:text-xs font-bold text-center leading-tight max-w-full px-1 uppercase tracking-tight break-words whitespace-normal ${
                isSelected ? "text-accent font-black" : "text-[var(--text-primary)]"
              }`}>
                {displayName}
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
  onSelectBusiness: (category: "garment" | "jewelry", gender: "female" | "male", selectedItem?: string) => void;
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
  jewelryType: JewelryType;
  setJewelryType: (val: any) => void;

  // Wallet props
  walletBalance?: number;
  walletTransactions?: WalletTransaction[];
  onRecharge?: (amount: number, bonus: number, note: string) => void;
  onClearHistory?: () => void;
  isWalletOpen?: boolean;
  setIsWalletOpen?: (val: boolean) => void;
  isSuperAdmin?: boolean;
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
  onClearHistory: propOnClearHistory,
  isWalletOpen: propIsWalletOpen,
  setIsWalletOpen: propSetIsWalletOpen,
  isSuperAdmin: propIsSuperAdmin,
}) => {
  const {
    garmentCategories,
    jewelryCategories,
    getGarmentItems,
    getJewelryItems,
    catalogItems,
    businesses,
    workspacesList,
    wearTypes,
    getWearTypesByWorkspace,
    genders,
  } = useStudioConfig();

  const catalogItemsMap = useMemo(() => {
    const map = new Map<string, CatalogItemRecord>();
    for (const item of catalogItems || []) {
      map.set(item.id, item);
    }
    return map;
  }, [catalogItems]);
  const [isOpen, setIsOpen] = useState(true);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [internalIsWalletOpen, setInternalIsWalletOpen] = useState(false);

  // Authenticated user state for role verification
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getStoredAuthUser());

  useEffect(() => {
    const syncUser = async () => {
      const stored = getStoredAuthUser();
      if (stored) {
        setAuthUser(stored);
      }
      const token = getAuthToken();
      if (token) {
        try {
          const liveUser = await fetchCurrentUserApi();
          if (liveUser) {
            setAuthUser(liveUser);
          }
        } catch {
          // Keep stored user on network error
        }
      } else {
        setAuthUser(null);
      }
    };

    syncUser();

    const handleAuthChange = () => {
      setAuthUser(getStoredAuthUser());
    };

    window.addEventListener("srushti:auth-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("srushti:auth-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const effectiveIsSuperAdmin =
    propIsSuperAdmin !== undefined ? propIsSuperAdmin : authUser?.role === "admin";

  const isWalletOpen = propIsWalletOpen !== undefined ? propIsWalletOpen : internalIsWalletOpen;
  const setIsWalletOpen = propSetIsWalletOpen !== undefined ? propSetIsWalletOpen : setInternalIsWalletOpen;

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
      const now = Date.now();
      const newTx: WalletTransaction = {
        id: `tx-${now}`,
        timestamp: now,
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
        date: new Date(now).toLocaleDateString(lang === "te" ? "te-IN" : "en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
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

  const handleClearTransactions = () => {
    if (propOnClearHistory) {
      propOnClearHistory();
    } else {
      setInternalTransactions([]);
      saveWalletTransactions([]);
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

  const isEn = lang === "en";

  // Temporary selection states to support the Confirm button workflow
  const [tempWorkspace, setTempWorkspace] = useState<"garment" | "jewelry">(
    (workspace === "garment" || workspace === "jewelry") ? workspace : "garment"
  );
  const [tempGarmentGender, setTempGarmentGender] = useState<"female" | "male">(garmentModelGender);
  const [tempJewelryGender, setTempJewelryGender] = useState<"female" | "male">(jewelryModelGender);
  const [tempGarmentType, setTempGarmentType] = useState<any>(garmentType);
  const [tempJewelryType, setTempJewelryType] = useState<any>(jewelryType);
  const [tempGarmentCategoryFilter, setTempGarmentCategoryFilter] = useState<string>("full_wear");
  const [tempJewelryCategoryFilter, setTempJewelryCategoryFilter] = useState<string>("neck_wear");
  const [tempBusinessCategoryId, setTempBusinessCategoryId] = useState<string>(() => {
    const ws = (workspace === "garment" || workspace === "jewelry") ? workspace : "garment";
    const g = ws === "garment" ? garmentModelGender : jewelryModelGender;
    return `${ws}_${g}`;
  });

  const activeWorkspacesWithBusinesses = useMemo(() => {
    const wsWithBiz = new Set(
      (businesses || []).filter((b) => b.isActive).map((b) => b.workspace)
    );
    const list = (workspacesList || []).filter(
      (ws) => ws.isActive && wsWithBiz.has(ws.id as any)
    );
    if (list.length > 0) return list;
    return FALLBACK_WORKSPACES.filter((ws) => ws.id === "garment" || ws.id === "jewelry");
  }, [workspacesList, businesses]);

  // Sync tempBusinessCategoryId whenever businesses or selection changes
  useEffect(() => {
    if (businesses && businesses.length > 0) {
      const currentGender = tempWorkspace === "garment" ? tempGarmentGender : tempJewelryGender;
      const match = businesses.find(
        (b) => b.workspace === tempWorkspace && b.genderTarget === currentGender && b.isActive
      );
      if (match && match.id !== tempBusinessCategoryId) {
        setTempBusinessCategoryId(match.id);
      }
    }
  }, [businesses, tempWorkspace, tempGarmentGender, tempJewelryGender]);

  const handleOpenModal = () => {
    const currentWs = (workspace === "garment" || workspace === "jewelry") ? workspace : "garment";
    setTempWorkspace(currentWs);
    setTempGarmentGender(garmentModelGender);
    setTempJewelryGender(jewelryModelGender);
    setTempGarmentType(garmentType);
    setTempJewelryType(jewelryType);

    const currentGender = currentWs === "garment" ? garmentModelGender : jewelryModelGender;
    const initialBiz = (businesses || []).find(
      (b) => b.workspace === currentWs && b.genderTarget === currentGender && b.isActive
    ) || (businesses || []).find((b) => b.workspace === currentWs && b.isActive);

    setTempBusinessCategoryId(initialBiz?.id || `${currentWs}_${currentGender}`);

    // Initial category filter dynamically derived from current item's wearType
    const currentGarmentRecord = catalogItemsMap.get(garmentType);
    const garmentWearType = currentGarmentRecord?.wearType || currentGarmentRecord?.wearTypeId || "full_wear";
    setTempGarmentCategoryFilter(garmentWearType);

    const currentJewelryRecord = catalogItemsMap.get(jewelryType);
    const jewelryWearType = currentJewelryRecord?.wearType || currentJewelryRecord?.wearTypeId || "neck_wear";
    setTempJewelryCategoryFilter(jewelryWearType);

    setIsOpen(true);
  };

  const handleSelectBusinessCategory = (biz: BusinessCategoryRecord) => {
    const ws = (biz.workspace === "garment" || biz.workspace === "jewelry") ? biz.workspace : "garment";
    setTempWorkspace(ws);
    setTempBusinessCategoryId(biz.id);
    const targetGender = (biz.genderTarget === "male" ? "male" : "female") as "female" | "male";
    if (ws === "garment") {
      setTempGarmentGender(targetGender);
    } else {
      setTempJewelryGender(targetGender);
    }

    const bizItems = (catalogItems || []).filter(
      (item) =>
        item.isActive &&
        item.workspace === ws &&
        (item.businessCategoryId === biz.id ||
          item.genderTarget === targetGender ||
          item.genderTarget === "unisex" ||
          item.genderTarget === "all")
    ).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    const currentFilter = ws === "garment" ? tempGarmentCategoryFilter : tempJewelryCategoryFilter;
    const itemsInFilter = bizItems.filter((i) => (i.wearType || i.wearTypeId) === currentFilter);

    if (itemsInFilter.length > 0) {
      const currentItem = ws === "garment" ? tempGarmentType : tempJewelryType;
      if (!itemsInFilter.some((i) => i.id === currentItem)) {
        if (ws === "garment") setTempGarmentType(itemsInFilter[0].id);
        else setTempJewelryType(itemsInFilter[0].id);
      }
    } else if (bizItems.length > 0) {
      const nextWearType = bizItems[0].wearType || bizItems[0].wearTypeId;
      if (ws === "garment") {
        if (nextWearType) setTempGarmentCategoryFilter(nextWearType);
        setTempGarmentType(bizItems[0].id);
      } else {
        if (nextWearType) setTempJewelryCategoryFilter(nextWearType);
        setTempJewelryType(bizItems[0].id);
      }
    }
  };

  const handleSelectGarmentCategory = (catCode: string) => {
    setTempGarmentCategoryFilter(catCode);
    const bizItems = (catalogItems || []).filter(
      (item) =>
        item.isActive &&
        item.workspace === "garment" &&
        (tempBusinessCategoryId
          ? item.businessCategoryId === tempBusinessCategoryId ||
            item.genderTarget === tempGarmentGender ||
            item.genderTarget === "unisex" ||
            item.genderTarget === "all"
          : item.genderTarget === tempGarmentGender ||
            item.genderTarget === "unisex" ||
            item.genderTarget === "all")
    );
    const itemsInCat = bizItems.filter((i) => (i.wearType || i.wearTypeId) === catCode);
    if (itemsInCat.length > 0 && !itemsInCat.some((i) => i.id === tempGarmentType)) {
      setTempGarmentType(itemsInCat[0].id);
    }
  };

  const handleSelectJewelryCategory = (catCode: string) => {
    setTempJewelryCategoryFilter(catCode);
    const bizItems = (catalogItems || []).filter(
      (item) =>
        item.isActive &&
        item.workspace === "jewelry" &&
        (tempBusinessCategoryId
          ? item.businessCategoryId === tempBusinessCategoryId ||
            item.genderTarget === tempJewelryGender ||
            item.genderTarget === "unisex" ||
            item.genderTarget === "all"
          : item.genderTarget === tempJewelryGender ||
            item.genderTarget === "unisex" ||
            item.genderTarget === "all")
    );
    const itemsInCat = bizItems.filter((i) => (i.wearType || i.wearTypeId) === catCode);
    if (itemsInCat.length > 0 && !itemsInCat.some((i) => i.id === tempJewelryType)) {
      setTempJewelryType(itemsInCat[0].id);
    }
  };

  const activeWearTypes = useMemo(() => {
    const wsWearTypes = (wearTypes || [])
      .filter((wt) => wt.workspace === tempWorkspace && wt.isActive)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    const currentGender = tempWorkspace === "garment" ? tempGarmentGender : tempJewelryGender;
    const bizItems = (catalogItems || []).filter(
      (item) =>
        item.isActive &&
        item.workspace === tempWorkspace &&
        (tempBusinessCategoryId
          ? item.businessCategoryId === tempBusinessCategoryId ||
            item.genderTarget === currentGender ||
            item.genderTarget === "unisex" ||
            item.genderTarget === "all"
          : item.genderTarget === currentGender ||
            item.genderTarget === "unisex" ||
            item.genderTarget === "all")
    );

    const availableCodes = new Set(bizItems.map((i) => i.wearType || i.wearTypeId));
    const filtered = wsWearTypes.filter((wt) => availableCodes.has(wt.code || wt.id));
    if (filtered.length > 0) return filtered;
    if (wsWearTypes.length > 0) return wsWearTypes;

    const fallbackLookups = tempWorkspace === "garment" ? garmentCategories : jewelryCategories;
    return (fallbackLookups || []).map((l) => ({
      id: l.id || l.code,
      code: l.code,
      workspace: tempWorkspace,
      nameEn: l.nameEn,
      nameTe: l.nameTe,
      description: null,
      icon: null,
      displayOrder: l.displayOrder ?? 0,
      isActive: true,
    }));
  }, [
    wearTypes,
    tempWorkspace,
    tempBusinessCategoryId,
    tempGarmentGender,
    tempJewelryGender,
    catalogItems,
    garmentCategories,
    jewelryCategories,
  ]);

  const activeCategoryItems = useMemo(() => {
    const currentGender = tempWorkspace === "garment" ? tempGarmentGender : tempJewelryGender;
    const currentCategoryFilter =
      tempWorkspace === "garment" ? tempGarmentCategoryFilter : tempJewelryCategoryFilter;

    const bizItems = (catalogItems || []).filter(
      (item) =>
        item.isActive &&
        item.workspace === tempWorkspace &&
        (tempBusinessCategoryId
          ? item.businessCategoryId === tempBusinessCategoryId ||
            item.genderTarget === currentGender ||
            item.genderTarget === "unisex" ||
            item.genderTarget === "all"
          : item.genderTarget === currentGender ||
            item.genderTarget === "unisex" ||
            item.genderTarget === "all")
    ).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    if (bizItems.length === 0) {
      return tempWorkspace === "garment"
        ? getGarmentItems(tempGarmentGender, currentCategoryFilter)
        : getJewelryItems(tempJewelryGender, currentCategoryFilter);
    }

    const filtered = bizItems.filter(
      (i) => (i.wearType || i.wearTypeId) === currentCategoryFilter
    );

    return filtered.length > 0 ? filtered : bizItems;
  }, [
    catalogItems,
    tempWorkspace,
    tempBusinessCategoryId,
    tempGarmentGender,
    tempJewelryGender,
    tempGarmentCategoryFilter,
    tempJewelryCategoryFilter,
    getGarmentItems,
    getJewelryItems,
  ]);

  useEffect(() => {
    const handleOpenBusinessModalEvent = () => {
      handleOpenModal();
    };
    const handleOpenWalletModalEvent = () => {
      setIsWalletOpen(true);
    };
    const handleOpenHistoryModalEvent = () => {
      setIsHistoryOpen(true);
    };
    const handleOpenSettingsModalEvent = () => {
      setIsSettingsOpen(true);
    };
    window.addEventListener("srushti:open-business-modal", handleOpenBusinessModalEvent);
    window.addEventListener("srushti:open-wallet-modal", handleOpenWalletModalEvent);
    window.addEventListener("srushti:open-history-modal", handleOpenHistoryModalEvent);
    window.addEventListener("srushti:open-settings-modal", handleOpenSettingsModalEvent);
    return () => {
      window.removeEventListener("srushti:open-business-modal", handleOpenBusinessModalEvent);
      window.removeEventListener("srushti:open-wallet-modal", handleOpenWalletModalEvent);
      window.removeEventListener("srushti:open-history-modal", handleOpenHistoryModalEvent);
      window.removeEventListener("srushti:open-settings-modal", handleOpenSettingsModalEvent);
    };
  }, [workspace, garmentModelGender, jewelryModelGender, garmentType, jewelryType, setIsWalletOpen, catalogItemsMap]);

  return (
    <header className="px-4 pt-2 pb-3 mx-auto max-w-lg sm:max-w-xl md:max-w-3xl landscape:max-w-full lg:landscape:max-w-full xl:landscape:max-w-full 2xl:landscape:max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] w-full shrink-0">
      <div className="neu-m3-card rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 w-full bg-[var(--md-surface-container)]">
        {/* Brand title */}
        <div className="flex items-center gap-2 select-none">
          <Logo theme="dark" />
          <div>
            <h1 className="text-base font-bold tracking-tight text-[var(--md-on-surface)] leading-none font-sans">
              {title}
            </h1>
            <p className="text-[9px] font-medium text-[var(--md-on-surface-variant)] mt-0.5 leading-none font-sans">
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
            className="neu-m3-btn-tonal flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl cursor-pointer text-[var(--md-on-surface)] shrink-0"
            title={isEn ? "Studio Wallet & Credits" : "స్టూడియో వాలెట్ & క్రెడిట్స్"}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center neu-m3-inset-sm bg-accent/10 text-accent shrink-0">
              <Icon icon="lucide:coins" className="w-3 h-3 text-amber-500" />
            </div>
            <span className="text-xs font-black font-mono text-accent">
              {formatCredits(activeWalletBalance)}
            </span>
          </button>

          {/* Usage & Payment History trigger icon */}
          <button
            id="btn-trigger-history-modal"
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="neu-m3-icon-btn w-9 h-9 rounded-xl flex items-center justify-center text-accent cursor-pointer shrink-0"
            title={isEn ? "Usage & Payment History" : "వాడుక & చెల్లింపుల చరిత్ర"}
          >
            <Icon icon="lucide:history" className="w-4 h-4" />
          </button>

          {/* Admin Panel button - directs admins directly to /admin-dashboard */}
          {effectiveIsSuperAdmin && (
            <Link
              to="/admin-dashboard"
              id="btn-trigger-admin-modal"
              className="neu-m3-icon-btn w-9 h-9 rounded-xl flex items-center justify-center text-accent cursor-pointer shrink-0"
              title={isEn ? "Open Admin Dashboard" : "అడ్మిన్ డాష్‌బోర్డ్ తెరవండి"}
            >
              <CreditCard className="w-4 h-4" />
            </Link>
          )}

          {/* Profile popup trigger icon */}
          <button
            id="btn-trigger-settings-modal"
            onClick={() => setIsSettingsOpen(true)}
            className="neu-m3-icon-btn w-9 h-9 rounded-xl flex items-center justify-center text-accent cursor-pointer shrink-0"
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
              className="relative bg-[var(--bg-primary)] rounded-[2rem] p-5 sm:p-6 max-w-lg w-full border border-neutral-300 dark:border-neutral-700 text-[var(--text-primary)] z-10 h-[90vh] h-[90dvh] max-h-[90dvh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col space-y-4"
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
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${lang === "en"
                        ? "bg-accent text-white shadow-xs font-extrabold"
                        : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                        }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("te")}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${lang === "te"
                        ? "bg-accent text-white shadow-xs font-extrabold"
                        : "opacity-60 hover:opacity-100 text-[var(--text-primary)]"
                        }`}
                    >
                      తెలుగు
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Business Categories grouped by Workspace from API + DB */}
              <div className="space-y-4">
                {activeWorkspacesWithBusinesses.map((ws) => {
                  const wsBusinesses = (businesses || [])
                    .filter((b) => b.workspace === ws.id && b.isActive)
                    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

                  if (wsBusinesses.length === 0) return null;

                  return (
                    <div key={ws.id} className="space-y-2">
                      <h4 className="text-[10px] font-black tracking-wider uppercase opacity-60 flex items-center gap-1.5">
                        {ws.id === "garment" ? (
                          <Shirt className="w-3.5 h-3.5 text-accent" />
                        ) : ws.id === "jewelry" ? (
                          <Gem className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-accent" />
                        )}
                        <span>
                          {isEn
                            ? (ws.nameEn || ws.id)
                            : (ws.nameTe || ws.nameEn || ws.id)}
                        </span>
                      </h4>

                      <div
                        className={`grid gap-2.5 ${
                          wsBusinesses.length > 2
                            ? "grid-cols-2 sm:grid-cols-3"
                            : "grid-cols-2"
                        }`}
                      >
                        {wsBusinesses.map((biz) => {
                          const isSelected =
                            tempWorkspace === biz.workspace &&
                            (tempBusinessCategoryId === biz.id ||
                              (!tempBusinessCategoryId &&
                                (biz.workspace === "garment"
                                  ? tempGarmentGender === biz.genderTarget
                                  : tempJewelryGender === biz.genderTarget)));

                          return (
                            <button
                              key={biz.id}
                              type="button"
                              onClick={() => handleSelectBusinessCategory(biz)}
                              className={`p-2.5 rounded-xl flex items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? "nm-inset text-accent font-extrabold"
                                  : "nm-outset-sm hover:scale-[1.02] active:scale-[0.98] text-[var(--text-primary)]"
                              }`}
                            >
                              {biz.icon && (
                                <Icon
                                  icon={
                                    biz.icon.startsWith("lucide:")
                                      ? biz.icon
                                      : `lucide:${biz.icon.toLowerCase()}`
                                  }
                                  className="w-3.5 h-3.5 shrink-0 opacity-80"
                                />
                              )}
                              <span className="text-[11px] font-bold">
                                {isEn ? biz.nameEn : (biz.nameTe || biz.nameEn)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Select Item block - Dynamic from API + DB */}
              <div className="space-y-2.5 pt-1">
                <label className="text-[10px] font-black tracking-wider uppercase opacity-60 flex items-center gap-1">
                  {tempWorkspace === "garment" ? (
                    <Shirt className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <Gem className="w-3.5 h-3.5 text-accent" />
                  )}
                  {isEn ? "Select Item" : "వస్తువును ఎంచుకోండి"}
                </label>

                {/* Category / Wear Type Tabs - from DB wear_types table */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1 p-1.5 rounded-xl nm-inset-sm max-w-full">
                    {activeWearTypes.map((catItem) => {
                      const code = catItem.code || catItem.id;
                      const activeFilter =
                        tempWorkspace === "garment"
                          ? tempGarmentCategoryFilter
                          : tempJewelryCategoryFilter;
                      const isSelected = activeFilter === code;

                      return (
                        <button
                          key={catItem.id || code}
                          type="button"
                          onClick={() => {
                            if (tempWorkspace === "garment") {
                              handleSelectGarmentCategory(code);
                            } else {
                              handleSelectJewelryCategory(code);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all text-center uppercase tracking-tight cursor-pointer ${
                            isSelected
                              ? "bg-accent/10 text-accent font-black nm-outset-xs"
                              : "text-[var(--text-primary)] text-opacity-60 hover:text-opacity-90"
                          }`}
                        >
                          {isEn
                            ? (catItem.nameEn || code)
                            : (catItem.nameTe || catItem.nameEn || code)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Item Grid inside Select Business popup */}
                  <SingleRowSlider
                    items={activeCategoryItems.map((item) => item.id)}
                    selectedId={
                      tempWorkspace === "garment" ? tempGarmentType : tempJewelryType
                    }
                    onSelect={(id) => {
                      if (tempWorkspace === "garment") {
                        setTempGarmentType(id);
                      } else {
                        setTempJewelryType(id);
                      }
                    }}
                    getItemIcon={
                      tempWorkspace === "garment" ? getGarmentIcon : getJewelryIcon
                    }
                    t={t}
                    catalogItemsMap={catalogItemsMap}
                    lang={lang}
                  />
                </div>
              </div>

              {/* Confirm Button & Selection Summary */}
              <div className="pt-2 mt-auto space-y-2.5">
                {/* Active Selection Summary */}
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl nm-inset-sm text-[11px] bg-[var(--bg-secondary)]/50">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    {isEn ? "Selected" : "ఎంచుకున్నది"}:
                  </span>
                  <div className="flex items-center gap-1.5 font-black text-accent text-xs">
                    <span>
                      {(() => {
                        const wsRec = workspacesList.find((w) => w.id === tempWorkspace);
                        if (wsRec) {
                          return isEn ? wsRec.nameEn : (wsRec.nameTe || wsRec.nameEn);
                        }
                        return tempWorkspace === "garment"
                          ? (isEn ? "Garment" : "బట్టలు")
                          : (isEn ? "Jewelry" : "నగలు");
                      })()}
                    </span>
                    <span className="text-[var(--text-secondary)] opacity-40">•</span>
                    <span>
                      {(() => {
                        const currentGender =
                          tempWorkspace === "garment" ? tempGarmentGender : tempJewelryGender;
                        const bizRec =
                          businesses.find((b) => b.id === tempBusinessCategoryId) ||
                          businesses.find(
                            (b) =>
                              b.workspace === tempWorkspace &&
                              b.genderTarget === currentGender &&
                              b.isActive
                          );
                        if (bizRec) {
                          return isEn ? bizRec.nameEn : (bizRec.nameTe || bizRec.nameEn);
                        }
                        return currentGender === "female"
                          ? (isEn ? "Female" : "మహిళలు")
                          : (isEn ? "Male" : "పురుషులు");
                      })()}
                    </span>
                    <span className="text-[var(--text-secondary)] opacity-40">•</span>
                    <span className="uppercase">
                      {(() => {
                        const activeId =
                          tempWorkspace === "garment" ? tempGarmentType : tempJewelryType;
                        const activeItem = catalogItemsMap.get(activeId);
                        if (activeItem) {
                          return isEn ? activeItem.nameEn : (activeItem.nameTe || activeItem.nameEn);
                        }
                        return t[activeId] || activeId?.replace(/_/g, " ");
                      })()}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-confirm-business"
                  type="button"
                  onClick={() => {
                    const finalGender = tempWorkspace === "garment" ? tempGarmentGender : tempJewelryGender;
                    const finalItem = tempWorkspace === "garment" ? tempGarmentType : tempJewelryType;
                    onSelectBusiness(tempWorkspace, finalGender, finalItem);
                    if (tempWorkspace === "garment") {
                      setGarmentType(tempGarmentType);
                    } else if (tempWorkspace === "jewelry") {
                      setJewelryType(tempJewelryType);
                    }
                    setIsOpen(false);
                  }}
                  className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black tracking-wide neu-m3-btn-filled flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-neutral-950 animate-pulse" />
                  <span>{isEn ? "Confirm Selection" : "సెలక్షన్ నిర్ధారించండి"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* Pop-up Dialog for Settings */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 landscape:p-0.5 overflow-hidden">
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
              className={`relative bg-[var(--bg-primary)] rounded-[2rem] landscape:rounded-xl p-4 sm:p-6 md:p-8 landscape:p-1.5 landscape:py-1 w-[90vw] max-w-[90vw] ${
                isSignedOut ? "lg:max-w-4xl landscape:max-w-[98vw]" : "lg:max-w-xl landscape:max-w-[90vw]"
              } space-y-4 landscape:space-y-0 border border-neutral-300 dark:border-neutral-700 text-[var(--text-primary)] z-10 max-h-[90vh] landscape:max-h-[98vh] overflow-y-auto overflow-x-hidden custom-scrollbar landscape-no-scrollbar shadow-xl transition-all`}
            >
              {/* Header inside the popup card (hidden when signed out) */}
              {!isSignedOut && (
                <div className="flex items-start justify-between border-b border-white/5 pb-2 landscape:pb-0.5">
                  <div>
                    <h3 className="text-sm landscape:text-xs font-extrabold text-[var(--text-emphasis)] tracking-tight">
                      {t.settingsTitle}
                    </h3>
                    <p className="text-[10px] landscape:text-[8px] opacity-75 mt-0.5 leading-relaxed landscape:leading-none">
                      {t.settingsSubtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-7 h-7 landscape:w-5 landscape:h-5 rounded-full flex items-center justify-center nm-outset-sm hover:scale-105 active:scale-95 text-accent cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5 landscape:w-2.5 landscape:h-2.5" />
                  </button>
                </div>
              )}

              {/* Settings Workspace Component */}
              <div className="pt-2 landscape:pt-0">
                <Suspense
                  fallback={
                    <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                      <span className="text-xs font-bold text-accent">Loading Profile...</span>
                    </div>
                  }
                >
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
                </Suspense>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pop-up Dialog for Studio Wallet & Credits */}
      <AnimatePresence>
        {isWalletOpen && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              </div>
            }
          >
            <WalletModal
              isOpen={isWalletOpen}
              onClose={() => setIsWalletOpen(false)}
              currency={currency}
              walletBalance={activeWalletBalance}
              transactions={activeTransactions}
              onRecharge={handleWalletRecharge}
              onOpenHistory={() => setIsHistoryOpen(true)}
              lang={lang}
              usdToInrRate={usdToInrRate}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Pop-up Dialog for Combined Usage & Payment History */}
      <AnimatePresence>
        {isHistoryOpen && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              </div>
            }
          >
            <HistoryModal
              isOpen={isHistoryOpen}
              onClose={() => setIsHistoryOpen(false)}
              lang={lang}
              currency={currency}
              onOpenWallet={() => setIsWalletOpen(true)}
            />
          </Suspense>
        )}
      </AnimatePresence>

    </header>
  );
};
