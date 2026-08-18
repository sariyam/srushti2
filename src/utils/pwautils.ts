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

// Check if app is running in standalone mode (already installed & launched from homescreen/desktop)
export function isPWAInstalled(): boolean {
  if (typeof window === "undefined") return false;

  const isStandaloneMatch = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const isNavigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isLocalStorageMarked = localStorage.getItem("srushti_pwa_installed") === "true";

  return isStandaloneMatch || isNavigatorStandalone || isLocalStorageMarked;
}

// Check if running on iOS (iPhone / iPad / iPod)
export function isIOSSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isApple = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isNotStandalone = !isPWAInstalled();
  return isApple && isNotStandalone;
}

// Check if running on Android
export function isAndroidDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
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

// Trigger installation flow
export async function triggerPWAInstall(): Promise<{
  outcome: "accepted" | "dismissed" | "manual_instructions" | "already_installed";
  method: "native_prompt" | "manual_guide" | "none";
}> {
  if (isPWAInstalled()) {
    return { outcome: "already_installed", method: "none" };
  }

  if (globalDeferredPrompt) {
    try {
      await globalDeferredPrompt.prompt();
      const choice = await globalDeferredPrompt.userChoice;
      if (choice && choice.outcome === "accepted") {
        localStorage.setItem("srushti_pwa_installed", "true");
        globalDeferredPrompt = null;
        notifyListeners();
        return { outcome: "accepted", method: "native_prompt" };
      } else {
        return { outcome: "dismissed", method: "native_prompt" };
      }
    } catch (err) {
      console.error("Error triggering native PWA prompt:", err);
      return { outcome: "manual_instructions", method: "manual_guide" };
    }
  }

  // If no native prompt is available (e.g. Safari, iOS, Firefox, or already installed/denied)
  return { outcome: "manual_instructions", method: "manual_guide" };
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
  const [isIOS, setIsIOS] = useState<boolean>(() => isIOSSafari());
  const [isAndroid, setIsAndroid] = useState<boolean>(() => isAndroidDevice());

  useEffect(() => {
    const updateState = () => {
      setIsInstallable(!!globalDeferredPrompt);
      setIsInstalled(isPWAInstalled());
      setIsIOS(isIOSSafari());
      setIsAndroid(isAndroidDevice());
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
    isIOS,
    isAndroid,
    deferredPrompt: globalDeferredPrompt,
    promptInstall,
  };
}
