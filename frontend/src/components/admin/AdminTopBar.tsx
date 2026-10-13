import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";

interface AdminTopBarProps {
  adminPhone: string;
  lang: "en" | "te";
  setLang: (lang: "en" | "te") => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  onLogout: () => void;
  activeTabTitle: string;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  adminPhone,
  lang,
  setLang,
  theme,
  setTheme,
  onLogout,
  activeTabTitle,
}) => {
  return (
    <header className="m3-top-app-bar w-full px-4 sm:px-6 py-3 flex items-center justify-between z-30 transition-colors">
      {/* Left: Brand Identity & Active Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--md-primary)] text-[var(--md-on-primary)] flex items-center justify-center shadow-sm">
          <Icon icon="lucide:shield-check" className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black tracking-tight text-[var(--md-on-surface)]">
              Srushti AI <span className="text-[var(--md-primary)] font-extrabold">• Admin</span>
            </h1>
            <span className="m3-badge px-2 py-0.5 text-[9px] uppercase tracking-wider font-extrabold bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)]">
              admin
            </span>
          </div>
          <p className="text-[11px] text-[var(--md-on-surface-variant)] flex items-center gap-1.5 font-medium">
            <span>{activeTabTitle}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Backend Live</span>
          </p>
        </div>
      </div>

      {/* Right: Quick Controls, Language, Theme, Phone & Exit */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switch */}
        <div className="flex items-center p-0.5 rounded-full bg-[var(--md-surface-container-high)] border border-[var(--md-outline-variant)]">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              lang === "en"
                ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-xs"
                : "text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("te")}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              lang === "te"
                ? "bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-xs"
                : "text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]"
            }`}
          >
            తె
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="w-9 h-9 rounded-full bg-[var(--md-surface-container-high)] border border-[var(--md-outline-variant)] flex items-center justify-center text-[var(--md-on-surface)] hover:bg-[var(--md-surface-variant)] transition-colors cursor-pointer"
        >
          {theme === "dark" ? (
            <Icon icon="lucide:sun" className="w-4 h-4 text-amber-400" />
          ) : (
            <Icon icon="lucide:moon" className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {/* Admin Phone Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] text-xs font-mono font-bold text-[var(--md-on-surface)]">
          <Icon icon="lucide:phone" className="w-3.5 h-3.5 text-[var(--md-primary)]" />
          <span>{adminPhone || "+919059108434"}</span>
        </div>

        {/* Studio Link */}
        <Link
          to="/studio"
          className="m3-btn-outlined px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Icon icon="lucide:camera" className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Open Studio</span>
        </Link>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onLogout}
          title="Sign Out of Admin Console"
          className="m3-btn-tonal px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 text-[var(--md-error)] hover:bg-[var(--md-error-container)] transition-colors cursor-pointer"
        >
          <Icon icon="lucide:log-out" className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
