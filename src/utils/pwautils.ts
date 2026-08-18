import { useEffect, useState, useCallback } from "react";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Global cached prompt reference so it persists across renders and navigation
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const LISTENERS = new Set<() => void>();

function notifyListeners() {
  LISTENERS.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("PWA listener error:", e);
    }
  });
}

// Check if running inside an iframe (browsers block PWA installation inside iframes)
export function isRunningInIframe(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

// Check if app is running in standalone mode (already installed & launched from homescreen/desktop)
export function isPWAInstalled(): boolean {
  if (typeof window === "undefined") return false;

  const isStandaloneMatch = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const isNavigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isLocalStorageMarked = localStorage.getItem("srushti_pwa_installed") === "true";

  return isStandaloneMatch || isNavigatorStandalone || isLocalStorageMarked;
}

// Get the current deferred install prompt
export function getDeferredPrompt(): BeforeInstallPromptEvent | null {
  return globalDeferredPrompt;
}

// Set deferred install prompt
export function setDeferredPrompt(e: BeforeInstallPromptEvent | null): void {
  globalDeferredPrompt = e;
  notifyListeners();
}

/**
 * Triggers the REAL native browser PWA installation.
 * No custom UI / popups.
 */
export async function triggerPWAInstall(): Promise<"accepted" | "dismissed" | "opened_tab" | "unsupported"> {
  if (isPWAInstalled()) {
    return "accepted";
  }

  // If inside an iframe (like AI Studio preview), opening in top tab enables native browser PWA prompt
  if (isRunningInIframe() && !globalDeferredPrompt) {
    window.open(window.location.href, "_blank");
    return "opened_tab";
  }

  // If browser has the native install prompt ready, execute it directly
  if (globalDeferredPrompt) {
    try {
      await globalDeferredPrompt.prompt();
      const choice = await globalDeferredPrompt.userChoice;
      if (choice && choice.outcome === "accepted") {
        localStorage.setItem("srushti_pwa_installed", "true");
        globalDeferredPrompt = null;
        notifyListeners();
        return "accepted";
      } else {
        return "dismissed";
      }
    } catch (err) {
      console.warn("Native PWA prompt execution error:", err);
    }
  }

  // If native prompt is not available yet, open standalone window or let browser handle
  if (isRunningInIframe()) {
    window.open(window.location.href, "_blank");
    return "opened_tab";
  }

  return "unsupported";
}

// Global initialization of PWA events
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null;
    localStorage.setItem("srushti_pwa_installed", "true");
    notifyListeners();
  });

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener?.("change", (evt) => {
      if (evt.matches) {
        localStorage.setItem("srushti_pwa_installed", "true");
        notifyListeners();
      }
    });
  }
}

/**
 * Custom React hook for PWA installation handling
 */
export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState<boolean>(() => !!globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => isPWAInstalled());

  useEffect(() => {
    const updateState = () => {
      setIsInstallable(!!globalDeferredPrompt);
      setIsInstalled(isPWAInstalled());
    };

    LISTENERS.add(updateState);
    updateState();

    return () => {
      LISTENERS.delete(updateState);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    return await triggerPWAInstall();
  }, []);

  return {
    isInstallable,
    isInstalled,
    deferredPrompt: globalDeferredPrompt,
    promptInstall,
  };
}
