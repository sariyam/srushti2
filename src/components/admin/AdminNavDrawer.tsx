import React from "react";
import { Icon } from "@iconify/react";

export type AdminTabKey =
  | "business"
  | "fidelity"
  | "gateway"
  | "pricing"
  | "users"
  | "catalog"
  | "faces"
  | "poses"
  | "backgrounds"
  | "presentations"
  | "lookups";

export interface NavItemConfig {
  key: AdminTabKey;
  labelEn: string;
  labelTe: string;
  descriptionEn: string;
  icon: string;
  badge?: string;
  category: "core" | "studio" | "system";
}

export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
  // Studio Catalog & Categories
  {
    key: "business",
    labelEn: "Business Verticals",
    labelTe: "బిజినెస్ కేటగిరీలు",
    descriptionEn: "4 Categories (Garments & Jewelry)",
    icon: "lucide:briefcase",
    category: "studio",
  },
  {
    key: "catalog",
    labelEn: "Catalog Items",
    labelTe: "వస్తువుల కేటలాగ్",
    descriptionEn: "Garment & Jewelry items with prompt directives",
    icon: "lucide:shirt",
    category: "studio",
  },
  {
    key: "lookups",
    labelEn: "System Lookups",
    labelTe: "సిస్టమ్ లక్అప్స్",
    descriptionEn: "Backgrounds, Genders, Garment & Jewelry categories",
    icon: "lucide:layers",
    category: "studio",
  },
  {
    key: "faces",
    labelEn: "Model Faces & CDN",
    labelTe: "మోడల్ ముఖాలు & స్టోరేజ్",
    descriptionEn: "Supabase storage 'model-faces' bucket",
    icon: "lucide:smile",
    badge: "Bucket",
    category: "studio",
  },
  {
    key: "poses",
    labelEn: "Studio Poses",
    labelTe: "స్టూడియో భంగిమలు",
    descriptionEn: "Camera framing, angles & pose prompts",
    icon: "lucide:person-standing",
    category: "studio",
  },
  {
    key: "backgrounds",
    labelEn: "Backgrounds & Envs",
    labelTe: "బ్యాక్‌గ్రౌండ్ పరిసరాలు",
    descriptionEn: "Indoor & outdoor lighting environments",
    icon: "lucide:image",
    category: "studio",
  },
  {
    key: "presentations",
    labelEn: "Presentation Modes",
    labelTe: "ప్రెజెంటేషన్ మోడ్‌లు",
    descriptionEn: "Model, Mannequin, Flat lay, Ghost, Hanger",
    icon: "lucide:layout-grid",
    category: "studio",
  },

  // Core Operations & Billing
  {
    key: "pricing",
    labelEn: "Pricing & Margins",
    labelTe: "ధరలు & మార్జిన్లు",
    descriptionEn: "Razorpay recharge rates & generation costs",
    icon: "lucide:coins",
    category: "core",
  },
  {
    key: "users",
    labelEn: "Users & Credit Audit",
    labelTe: "వినియోగదారులు & క్రెడిట్స్",
    descriptionEn: "Wallet balances, top-up & generation audit log",
    icon: "lucide:users",
    category: "core",
  },

  // System & Infrastructure
  {
    key: "fidelity",
    labelEn: "Fidelity & Directives",
    labelTe: "ఫిడిలిటీ & ప్రాంప్ట్ నియమాలు",
    descriptionEn: "Jewelry brilliance, fabric weave & negatives",
    icon: "lucide:sparkles",
    category: "system",
  },
  {
    key: "gateway",
    labelEn: "AI Gateways & Models",
    labelTe: "ఏఐ గేట్‌వేలు & మోడల్స్",
    descriptionEn: "OpenAI GPT-Image-2.5-Sunburst defaults",
    icon: "lucide:cpu",
    category: "system",
  },
];

interface AdminNavDrawerProps {
  activeTab: AdminTabKey;
  onSelectTab: (tab: AdminTabKey) => void;
  lang: "en" | "te";
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminNavDrawer: React.FC<AdminNavDrawerProps> = ({
  activeTab,
  onSelectTab,
  lang,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const isEn = lang === "en";

  const renderNavGroup = (
    category: "studio" | "core" | "system",
    titleEn: string,
    titleTe: string
  ) => {
    const items = ADMIN_NAV_ITEMS.filter((i) => i.category === category);
    return (
      <div>
        <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-[var(--md-outline)] flex items-center justify-between">
          <span>{isEn ? titleEn : titleTe}</span>
          <span className="text-[9px] font-mono opacity-60">({items.length})</span>
        </div>
        <div className="space-y-1">
          {items.map((item) => {
            const isSelected = activeTab === item.key;
            return (
              <button
                key={item.key}
                id={`admin-nav-${item.key}`}
                type="button"
                onClick={() => {
                  onSelectTab(item.key);
                  onCloseMobile?.();
                }}
                className={`m3-nav-item group w-full flex items-center justify-between text-left cursor-pointer transition-all duration-150 rounded-xl py-2.5 px-3 border-l-4 ${
                  isSelected
                    ? "m3-nav-item-active active bg-accent/15 dark:bg-accent/20 text-accent font-extrabold border-accent shadow-xs"
                    : "text-[var(--md-on-surface-variant)] hover:bg-[var(--md-surface-variant)]/60 hover:text-[var(--md-on-surface)] border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    icon={item.icon}
                    className={`w-5 h-5 shrink-0 transition-transform duration-150 ${
                      isSelected
                        ? "text-accent scale-110 drop-shadow-xs"
                        : "text-[var(--md-outline)] group-hover:text-[var(--md-on-surface)]"
                    }`}
                  />
                  <div className="min-w-0 truncate">
                    <span
                      className={`block text-xs leading-tight truncate ${
                        isSelected
                          ? "font-black text-accent"
                          : "font-bold text-[var(--md-on-surface)]"
                      }`}
                    >
                      {isEn ? item.labelEn : item.labelTe}
                    </span>
                    <span
                      className={`block text-[10px] truncate ${
                        isSelected
                          ? "text-accent/80 font-medium"
                          : "opacity-70 font-normal text-[var(--md-on-surface-variant)]"
                      }`}
                    >
                      {item.descriptionEn}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`m3-badge text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold shrink-0 transition-colors ${
                        isSelected
                          ? "bg-accent text-black font-black shadow-xs"
                          : "bg-[var(--md-surface-variant)] text-[var(--md-on-surface-variant)] font-semibold"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isSelected && !item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Navigation Drawer Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[65px] h-screen lg:h-[calc(100vh-65px)] w-72 m3-nav-drawer z-40 overflow-y-auto transition-transform duration-200 ease-in-out shrink-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Studio Catalog Group */}
          {renderNavGroup("studio", "Studio Catalog & Presets", "స్టూడియో కేటలాగ్ & ప్రీసెట్లు")}

          {/* Core Operations Group */}
          {renderNavGroup("core", "Operations & Wallets", "ఆపరేషన్స్ & వ్యాలెట్లు")}

          {/* System & API Group */}
          {renderNavGroup("system", "System & API Governance", "సిస్టమ్ & ఏపీఐ పాలన")}
        </div>
      </aside>
    </>
  );
};
