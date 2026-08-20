import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isCurrentlyStandalone, setIsCurrentlyStandalone] = useState<boolean>(false);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if CURRENTLY running inside standalone / installed app window
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsCurrentlyStandalone(true);
      setIsAppInstalled(true);
      localStorage.setItem("srushti_pwa_installed", "true");
      return;
    }

    // 2. Check if previously recorded as installed in browser
    if (localStorage.getItem("srushti_pwa_installed") === "true") {
      setIsAppInstalled(true);
    }

    // 3. Query navigator.getInstalledRelatedApps if supported by modern browsers
    if ("getInstalledRelatedApps" in navigator) {
      (navigator as any)
        .getInstalledRelatedApps()
        .then((relatedApps: any[]) => {
          if (relatedApps && relatedApps.length > 0) {
            setIsAppInstalled(true);
            localStorage.setItem("srushti_pwa_installed", "true");
          }
        })
        .catch(() => {
          // graceful fallback
        });
    }

    // 4. Detect iOS / iPadOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    setIsIos(isIosDevice);

    // 5. Listen for native browser beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 6. Listen for app installed event
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      localStorage.setItem("srushti_pwa_installed", "true");
      setDeferredPrompt(null);
      setShowIosGuide(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Action on button click
  const handleButtonClick = async () => {
    if (isAppInstalled) {
      // Direct action to launch / open the installed PWA Studio
      // Opening the start_url (/studio) in modern browser triggers the installed PWA WebAPK/Standalone container
      try {
        const appWindow = window.open("/studio", "_blank");
        if (!appWindow || appWindow.closed || typeof appWindow.closed === "undefined") {
          window.location.href = "/studio";
        }
      } catch {
        window.location.href = "/studio";
      }
      return;
    }

    // Not yet installed: Trigger native browser install prompt dialog
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setIsAppInstalled(true);
          localStorage.setItem("srushti_pwa_installed", "true");
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.log("Install prompt error:", err);
      }
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      setShowIosGuide(true);
    }
  };

  // If already currently inside standalone mode or dismissed by user in this session, do not render
  if (isCurrentlyStandalone || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom-Right Overlay */}
      <div
        id="pwa-floating-install-container"
        className="fixed bottom-5 right-5 z-[999] flex flex-col items-end pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative flex items-center group"
        >
          {/* Main Floating Action Button (Open App vs Install App) */}
          <button
            id="pwa-floating-install-btn"
            onClick={handleButtonClick}
            aria-label={isAppInstalled ? "Open Srushti AI App" : "Install Srushti AI PWA App"}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[var(--bg-secondary)] border-2 border-accent/50 hover:border-accent text-[var(--text-emphasis)] shadow-2xl hover:shadow-[0_0_20px_rgba(50,207,17,0.35)] dark:hover:shadow-[0_0_25px_rgba(57,255,20,0.4)] nm-outset hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md"
          >
            {/* Animated Icon Badge */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-bold">
              {isAppInstalled ? (
                <Icon icon="lucide:arrow-up-right" className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <Icon icon="lucide:download" className="w-4 h-4 animate-bounce" />
              )}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent" />
            </div>

            {/* Button Label */}
            <div className="flex flex-col items-start text-left pr-1">
              <span className="text-xs font-black tracking-tight leading-none text-[var(--text-emphasis)] flex items-center gap-1.5">
                {isAppInstalled ? "Open App" : "Install App"}
                <span className="inline-block px-1 py-0.5 text-[8.5px] font-extrabold uppercase rounded bg-accent/20 text-accent leading-none">
                  PWA
                </span>
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] opacity-80 leading-none mt-1">
                {isAppInstalled ? "Launch Studio" : "Fast & Full Screen"}
              </span>
            </div>
          </button>

          {/* Dismiss ("X") Small Quick Close Button */}
          <button
            id="pwa-dismiss-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            title="Dismiss"
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-[var(--bg-primary)] border border-[var(--text-secondary)]/20 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent flex items-center justify-center shadow-md text-xs cursor-pointer transition-all hover:scale-110 active:scale-95"
          >
            <Icon icon="lucide:x" className="w-3 h-3" />
          </button>
        </motion.div>
      </div>

      {/* Manual Install Instruction Modal (For iOS Safari or Browsers without direct deferredPrompt) */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIosGuide(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative bg-[var(--bg-primary)] rounded-3xl p-6 max-w-sm w-full border border-accent/30 text-[var(--text-primary)] z-10 shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0 shadow-inner">
                    <Icon icon="lucide:smartphone" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[var(--text-emphasis)] leading-tight">
                      Install Srushti AI
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] opacity-80 mt-0.5">
                      Add to your home screen for full-screen studio
                    </p>
                  </div>
                </div>

                <button
                  id="pwa-close-guide-btn"
                  onClick={() => setShowIosGuide(false)}
                  className="w-8 h-8 rounded-full nm-outset-sm hover:scale-105 active:scale-95 flex items-center justify-center text-[var(--text-primary)] opacity-70 hover:opacity-100 cursor-pointer"
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                </button>
              </div>

              {/* Step by Step Guide */}
              <div className="space-y-3 pt-1">
                {isIos ? (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-black/5 dark:border-white/5">
                      <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 text-xs font-black">
                        1
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                        Tap the <strong className="text-accent font-bold">Share button</strong>{" "}
                        <Icon icon="lucide:share" className="inline w-3.5 h-3.5 mx-1" /> in Safari's bottom toolbar.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-black/5 dark:border-white/5">
                      <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 text-xs font-black">
                        2
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                        Scroll down and select{" "}
                        <strong className="text-accent font-bold">"Add to Home Screen"</strong>{" "}
                        <Icon icon="lucide:plus-square" className="inline w-3.5 h-3.5 mx-1" />.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-black/5 dark:border-white/5">
                      <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 text-xs font-black">
                        3
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                        Tap <strong className="text-accent font-bold">Add</strong> at the top right to install!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-black/5 dark:border-white/5">
                      <div className="w-7 h-7 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0 text-xs font-black">
                        1
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                        Look for the <strong className="text-accent font-bold">Install icon</strong>{" "}
                        <Icon icon="lucide:download" className="inline w-3.5 h-3.5 mx-1" /> in your browser address bar (top right on Chrome/Edge).
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-black/5 dark:border-white/5">
                      <div className="w-7 h-7 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0 text-xs font-black">
                        2
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                        Or open your browser menu <strong className="font-bold">⋮</strong> and click{" "}
                        <strong className="text-accent font-bold">"Install Srushti AI"</strong>.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Got It Action Button */}
              <button
                id="pwa-got-it-btn"
                onClick={() => setShowIosGuide(false)}
                className="w-full py-3 rounded-2xl bg-accent text-black font-extrabold text-xs shadow-lg hover:brightness-105 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Icon icon="lucide:check" className="w-4 h-4" />
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

