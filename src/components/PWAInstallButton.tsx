import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, PlusSquare, Smartphone, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isStandalone, canPrompt, isIOS, triggerInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // Language state automatically synced with landing page header (srushti_lang in localStorage)
  const [lang, setLang] = useState<'en' | 'te'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('srushti_lang');
      if (stored === 'te' || stored === 'en') return stored;
    }
    return 'en';
  });

  useEffect(() => {
    const checkLang = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('srushti_lang');
        if (stored === 'te' || stored === 'en') {
          setLang(stored);
        }
      }
    };

    window.addEventListener('storage', checkLang);
    const interval = setInterval(checkLang, 400);

    return () => {
      window.removeEventListener('storage', checkLang);
      clearInterval(interval);
    };
  }, []);

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

  const texts = {
    en: {
      buttonTitle: 'Download App',
      buttonSubtitle: 'Install app to your device',
      installed: 'App Installed!',
      helpTitle: 'How to Use the App',
      helpBody: 'Search & Open the App from Your Installed Apps.',
      iosTitle: 'Install on iOS Safari',
      iosIntro: 'Follow these simple steps to add Srushti AI to your iPhone or iPad home screen:',
      iosStep1: 'Tap the Share button',
      iosStep1Sub: 'in Safari bottom bar.',
      iosStep2: 'Scroll down & tap Add to Home Screen',
      iosStep3: 'Tap Add in the top-right corner to finish.',
      gotIt: 'Got It',
    },
    te: {
      buttonTitle: 'యాప్ డౌన్‌లోడ్ చేసుకోండి',
      buttonSubtitle: 'మీ మొబైల్/డివైస్‌లో ఇన్‌స్టాల్ చేయండి',
      installed: 'యాప్ ఇన్‌స్టాల్ అయ్యింది!',
      helpTitle: 'యాప్‌ను ఎలా ఉపయోగించాలి',
      helpBody: 'మీ ఫోన్‌లోని ఇన్‌స్టాల్ చేసిన యాప్‌ల నుండి శోధించి ఓపెన్ చేయండి.',
      iosTitle: 'iOS Safari లో ఇన్‌స్టాల్ చేసుకోండి',
      iosIntro: 'మీ iPhone లేదా iPad హోమ్ స్క్రీన్‌కు సృష్టి ఏఐ యాప్‌ను సులభంగా జోడించండి:',
      iosStep1: 'సఫారీ బార్‌లో Share బటన్‌ను నొక్కండి',
      iosStep1Sub: '',
      iosStep2: 'క్రిందికి స్క్రోల్ చేసి Add to Home Screen పై ట్యాప్ చేయండి',
      iosStep3: 'పూర్తి చేయడానికి కుడి వైపు పైభాగంలో ఉన్న Add పై క్లిక్ చేయండి.',
      gotIt: 'అర్థమైంది',
    },
  };

  const t = texts[lang];

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
            <div className="w-8 h-8 rounded-full bg-[#141312] border border-amber-500/30 overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
              {installedSuccess ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <img
                  src="/pwa-192x192.png"
                  alt="Srushti AI App Icon"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold tracking-wide text-neutral-100 flex items-center gap-1.5 whitespace-nowrap">
                {installedSuccess ? t.installed : t.buttonTitle}
                {!installedSuccess && (
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                )}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap">
                {t.buttonSubtitle}
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
                  <span>{t.helpTitle}</span>
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
                  {t.helpBody}
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
                    {t.iosTitle}
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
                {t.iosIntro}
              </p>

              <div className="space-y-3 bg-[#141312] p-3.5 rounded-2xl border border-neutral-800">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-[11px]">
                    1
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    {lang === 'te' ? (
                      <>
                        సఫారీ బార్‌లో <strong>Share</strong> (
                        <Share2 className="w-3.5 h-3.5 text-amber-400 inline" />) బటన్‌ను నొక్కండి.
                      </>
                    ) : (
                      <>
                        Tap the <strong>Share</strong> button (
                        <Share2 className="w-3.5 h-3.5 text-amber-400 inline" />) in Safari bar.
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-[11px]">
                    2
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    {lang === 'te' ? (
                      <>
                        క్రిందికి స్క్రోల్ చేసి <strong>Add to Home Screen</strong> (
                        <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" />) ఎంచుకోండి.
                      </>
                    ) : (
                      <>
                        Scroll down &amp; tap <strong>Add to Home Screen</strong> (
                        <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" />).
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-[11px]">
                    3
                  </div>
                  <div className="text-neutral-200">
                    {t.iosStep3}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                {t.gotIt}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

