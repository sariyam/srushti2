import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share2, PlusSquare, Smartphone, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isStandalone, canPrompt, isIOS, triggerInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If the user is already inside the installed PWA (standalone mode), DO NOT render
  if (isStandalone || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (canPrompt) {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
        setTimeout(() => setIsDismissed(true), 3000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowHelpTooltip((prev) => !prev);
    }
  };

  return (
    <>
      {/* Floating Download Button on Bottom Right */}
      <motion.aside
        id="pwa-floating-install-container"
        aria-label="Install App"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 drop-shadow-2xl"
      >
        <div className="relative group">
          {/* Main Action Pill */}
          <button
            id="pwa-floating-download-btn"
            onClick={handleInstallClick}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1e1d1c] hover:bg-[#2b2927] text-white border border-[#3e3b38] shadow-lg shadow-black/25 transition-all duration-200 active:scale-95 group-hover:border-amber-500/50 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              {installedSuccess ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold tracking-wide text-neutral-100 flex items-center gap-1.5 whitespace-nowrap">
                {installedSuccess ? 'App Installed!' : 'Install Srushti AI'}
                {!installedSuccess && (
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                )}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap">
                Fast offline-ready studio
              </span>
            </div>
          </button>

          {/* Desktop/Generic Help Tooltip if native prompt hasn't captured yet */}
          <AnimatePresence>
            {showHelpTooltip && !canPrompt && !isIOS && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-3 w-72 p-3.5 rounded-2xl bg-[#1e1d1c] text-white border border-[#3e3b38] shadow-2xl text-xs space-y-2"
              >
                <div className="flex items-center justify-between font-semibold text-neutral-200">
                  <span>How to Install</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHelpTooltip(false);
                    }}
                    className="text-neutral-400 hover:text-white p-1 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-neutral-300 leading-relaxed text-[11px]">
                  Click the <strong>Install / Download</strong> icon (
                  <Download className="inline w-3 h-3 text-amber-400 mx-0.5" />) on the right side of your browser’s URL search bar or in the browser menu (⋮).
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dismiss Button */}
        <button
          id="pwa-dismiss-btn"
          onClick={() => setIsDismissed(true)}
          title="Dismiss install banner"
          aria-label="Dismiss install banner"
          className="w-8 h-8 rounded-full bg-[#1e1d1c]/90 hover:bg-[#2b2927] text-neutral-400 hover:text-white border border-[#3e3b38] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.aside>

      {/* iOS Safari Installation Modal Instructions */}
      <AnimatePresence>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#1e1d1c] text-white border border-[#3e3b38] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-100">
                    Install on iOS Safari
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                Follow these simple steps to add Srushti AI to your iPhone or iPad home screen:
              </p>

              <div className="space-y-3 bg-[#141312] p-3.5 rounded-2xl border border-neutral-800">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-[11px]">
                    1
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    Tap the <strong>Share</strong> button (
                    <Share2 className="w-3.5 h-3.5 text-amber-400 inline" />) in Safari bar.
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-[11px]">
                    2
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    Scroll down &amp; tap <strong>Add to Home Screen</strong> (
                    <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" />).
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-[11px]">
                    3
                  </div>
                  <div className="text-neutral-200">
                    Tap <strong>Add</strong> in the top-right corner to finish.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
