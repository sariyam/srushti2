import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../types";

export type InvalidGestureType = "pull-to-refresh" | "edge-back";

export interface InvalidOperationDetails {
  type: InvalidGestureType;
  timestamp: number;
}

interface InvalidOperationModalProps {
  details: InvalidOperationDetails | null;
  onClose: () => void;
  lang?: Language;
}

export const InvalidOperationModal: React.FC<InvalidOperationModalProps> = ({
  details,
  onClose,
  lang = "te",
}) => {
  const isEn = lang === "en";
  const [progress, setProgress] = useState(100);

  // Auto-dismiss after 3.8 seconds with progress bar
  useEffect(() => {
    if (!details) {
      setProgress(100);
      return;
    }

    const duration = 3800;
    const intervalTime = 40;
    const step = (intervalTime / duration) * 100;

    setProgress(100);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [details, onClose]);

  if (!details) return null;

  const isRefresh = details.type === "pull-to-refresh";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 select-none pointer-events-auto">
        {/* Backdrop Overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/45 dark:bg-black/65 backdrop-blur-sm"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          className="relative bg-[var(--bg-primary)] rounded-[2rem] p-5 sm:p-6 max-w-sm w-full border border-amber-500/30 dark:border-amber-500/40 text-[var(--text-primary)] z-10 shadow-2xl overflow-hidden nm-outset flex flex-col gap-4"
        >
          {/* Top Decorative Alert Bar with animated gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

          {/* Close button on top-right */}
          <button
            id="btn-close-invalid-op-x"
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center nm-outset-sm hover:scale-105 active:scale-95 text-[var(--text-primary)] opacity-70 hover:opacity-100 transition-all cursor-pointer"
            aria-label="Close"
          >
            <Icon icon="lucide:x" className="w-3.5 h-3.5" />
          </button>

          {/* Header Icon + Title */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center nm-inset-sm shrink-0 border border-amber-500/30">
              <Icon
                icon={isRefresh ? "lucide:refresh-cw-off" : "lucide:arrow-left-from-line"}
                className="w-5 h-5 animate-pulse"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/25">
                  Gesture Alert
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[var(--text-emphasis)] tracking-tight mt-0.5">
                [Invalid Operation]
              </h3>
            </div>
          </div>

          {/* Gesture Badge Card */}
          <div className="nm-inset rounded-2xl p-3 bg-black/5 dark:bg-black/25 flex items-center gap-3 border border-black/5 dark:border-white/5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <Icon
                icon={isRefresh ? "lucide:arrow-down" : "lucide:chevrons-right"}
                className="w-4 h-4"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider block">
                {isEn ? "Detected Gesture" : "గుర్తించిన సంజ్ఞ"}
              </span>
              <p className="text-xs font-black text-rose-500 truncate">
                {isRefresh
                  ? (isEn ? "Swiped down to refresh" : "రిఫ్రెష్ చేయడానికి క్రిందికి స్వైప్ చేసారు")
                  : (isEn ? "Edge swipe to back" : "వెనుకకు వెళ్లడానికి ఎడ్జ్ స్వైప్ చేసారు")}
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
              ✕
            </div>
          </div>

          {/* Explanation Text */}
          <div className="space-y-1.5 px-0.5">
            <p className="text-xs font-medium leading-relaxed opacity-90 text-[var(--text-primary)]">
              {isRefresh ? (
                isEn ? (
                  <>
                    <strong className="text-[var(--text-emphasis)]">Page refresh is prevented.</strong> Swiping down to refresh has been disabled so your unsaved photoshoot, model setups, and active studio credits are not lost.
                  </>
                ) : (
                  <>
                    <strong className="text-[var(--text-emphasis)]">పేజీ రీఫ్రెష్ నిలిపివేయబడింది.</strong> మీ ఫోటోషూట్ మార్పులు, అప్‌లోడ్ చేసిన ఫోటోలు మరియు స్టూడియో క్రెడిట్స్ భద్రంగా ఉండటానికి స్వైప్ డౌన్ అనుమతించబడదు.
                  </>
                )
              ) : (
                isEn ? (
                  <>
                    <strong className="text-[var(--text-emphasis)]">Back gesture is prevented.</strong> Swiping from the edge to go back is disabled to keep your studio workspace active. Please use in-app buttons to navigate.
                  </>
                ) : (
                  <>
                    <strong className="text-[var(--text-emphasis)]">వెనుకకు వెళ్లే సంజ్ఞ నిలిపివేయబడింది.</strong> స్టూడియో వర్క్‌స్పేస్ నుండి అనుకోకుండా బయటకు వెళ్లకుండా ఉండటానికి ఎడ్జ్ స్వైప్ అనుమతించబడదు.
                  </>
                )
              )}
            </p>
          </div>

          {/* Action Button & Auto-dismiss countdown bar */}
          <div className="pt-1 flex flex-col gap-2">
            <button
              id="btn-dismiss-invalid-op"
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-black tracking-wide nm-outset flex items-center justify-center gap-2 text-[var(--text-emphasis)] hover:text-accent bg-[var(--bg-secondary)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer transition-all"
            >
              <Icon icon="lucide:check" className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isEn ? "Understood (Dismiss)" : "సరే, అర్థమైంది"}</span>
            </button>

            {/* Visual timer countdown indicator */}
            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500/70 transition-all duration-75 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
