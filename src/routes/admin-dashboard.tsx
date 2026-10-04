import React, { useState, useEffect } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Icon } from "@iconify/react";

import {
  getStoredAuthUser,
  getAuthToken,
  removeAuthData,
  AuthUser,
} from "../utils/api";

import { AdminTopBar } from "../components/admin/AdminTopBar";
import { AdminNavDrawer, AdminTabKey, ADMIN_NAV_ITEMS } from "../components/admin/AdminNavDrawer";
import { AdminAuthShield } from "../components/admin/AdminAuthShield";

import { BusinessVerticalsTab } from "../components/admin/BusinessVerticalsTab";
import { CatalogItemsTab } from "../components/admin/CatalogItemsTab";
import { ModelFacesTab } from "../components/admin/ModelFacesTab";
import { PosesFramingTab } from "../components/admin/PosesFramingTab";
import { BackgroundsTab } from "../components/admin/BackgroundsTab";
import { PresentationModesTab } from "../components/admin/PresentationModesTab";
import { PricingMarginsTab } from "../components/admin/PricingMarginsTab";
import { UsersAuditTab } from "../components/admin/UsersAuditTab";
import { FidelitySettingsTab } from "../components/admin/FidelitySettingsTab";
import { SystemLookupsTab } from "../components/admin/SystemLookupsTab";
import { AiGatewaysTab } from "../components/admin/AiGatewaysTab";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-dashboard",
  component: AdminDashboardPage,
});

export function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const user = getStoredAuthUser();
    const token = getAuthToken();
    return !!(user && token && user.role === "admin");
  });

  const [activeTab, setActiveTab] = useState<AdminTabKey>("business");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("srushti_theme");
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  // Language state
  const [lang, setLang] = useState<"en" | "te">(() => {
    const saved = localStorage.getItem("srushti_lang");
    return saved === "te" ? "te" : "en";
  });

  // Apply theme to document element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("srushti_theme", theme);
  }, [theme]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem("srushti_lang", lang);
  }, [lang]);

  // Listen to auth change events
  useEffect(() => {
    const handleAuthChange = () => {
      const u = getStoredAuthUser();
      const token = getAuthToken();
      setCurrentUser(u);
      setIsAuthenticated(!!(u && token && u.role === "admin"));
    };

    window.addEventListener("srushti:auth-changed", handleAuthChange);
    return () => window.removeEventListener("srushti:auth-changed", handleAuthChange);
  }, []);

  const handleLogout = () => {
    removeAuthData();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const handleAuthenticated = (user: AuthUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  // If not authenticated as admin, render M3 Auth Shield
  if (!isAuthenticated || !currentUser || currentUser.role !== "admin") {
    return <AdminAuthShield onAuthenticated={handleAuthenticated} lang={lang} />;
  }

  const currentTabConfig = ADMIN_NAV_ITEMS.find((i) => i.key === activeTab) || ADMIN_NAV_ITEMS[0];
  const activeTabTitle = lang === "en" ? currentTabConfig.labelEn : currentTabConfig.labelTe;

  return (
    <div className="min-h-screen bg-[var(--md-surface)] text-[var(--md-on-surface)] flex flex-col font-sans transition-colors duration-200">
      {/* M3 Top App Bar */}
      <AdminTopBar
        adminPhone={currentUser.phone}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        onLogout={handleLogout}
        activeTabTitle={activeTabTitle}
      />

      {/* Main Layout: Left Navigation Drawer + Content Stage */}
      <div className="flex-1 flex flex-row relative max-w-[1600px] w-full mx-auto">
        {/* Navigation Drawer */}
        <AdminNavDrawer
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          lang={lang}
          isMobileOpen={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Mobile Drawer Trigger Pill */}
          <div className="lg:hidden mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="m3-btn-tonal px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Icon icon="lucide:menu" className="w-4 h-4" />
              <span>Menu: {activeTabTitle}</span>
            </button>
          </div>

          {/* Active Tab View Rendering */}
          <div className="animate-fadeIn">
            {activeTab === "business" && <BusinessVerticalsTab lang={lang} />}
            {activeTab === "catalog" && <CatalogItemsTab lang={lang} />}
            {activeTab === "lookups" && <SystemLookupsTab lang={lang} />}
            {activeTab === "faces" && <ModelFacesTab lang={lang} />}
            {activeTab === "poses" && <PosesFramingTab lang={lang} />}
            {activeTab === "backgrounds" && <BackgroundsTab lang={lang} />}
            {activeTab === "presentations" && <PresentationModesTab lang={lang} />}
            {activeTab === "pricing" && <PricingMarginsTab lang={lang} />}
            {activeTab === "users" && <UsersAuditTab lang={lang} />}
            {activeTab === "fidelity" && <FidelitySettingsTab lang={lang} />}
            {activeTab === "gateway" && <AiGatewaysTab lang={lang} />}
          </div>
        </main>
      </div>
    </div>
  );
}
