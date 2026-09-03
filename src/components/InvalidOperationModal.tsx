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

  // Auto-dismiss after 2.8 seconds
  useEffect(() => {
    if (!details) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [details, onClose]);

  if (!details) return null;

  const isRefresh = details.type === "pull-to-refresh";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 select-none pointer-events-auto">
        {/* Soft Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/35 dark:bg-black/55 backdrop-blur-xs"
        />

        {/* Simple Neumorphic Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative bg-[var(--bg-primary)] rounded-3xl p-5 sm:p-6 max-w-[300px] w-full text-center nm-outset flex flex-col items-center gap-3.5 z-10 border border-white/20 dark:border-white/5 shadow-xl"
        >
          {/* Neumorphic Icon Container */}
          <div className="w-12 h-12 rounded-2xl nm-inset-sm flex items-center justify-center text-amber-500 bg-[var(--bg-secondary)]">
            <Icon
              icon={isRefresh ? "lucide:refresh-cw-off" : "lucide:arrow-left-from-line"}
              className="w-5 h-5"
            />
          </div>

          {/* Simple Text Content */}
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-black text-[var(--text-emphasis)] tracking-tight">
              [Invalid Operation]
            </h3>
            <p className="text-xs font-medium text-[var(--text-primary)] opacity-75 leading-relaxed">
              {isRefresh
                ? (isEn ? "Swipe down to refresh is not allowed." : "స్వైప్ డౌన్ రీఫ్రెష్ అనుమతించబడదు.")
                : (isEn ? "Edge swipe to back is not allowed." : "ఎడ్జ్ స్వైప్ అనుమతించబడదు.")}
            </p>
          </div>

          {/* Simple Neumorphic Button */}
          <button
            id="btn-dismiss-invalid-op"
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide nm-outset hover:scale-[1.01] active:nm-inset-sm text-[var(--text-emphasis)] hover:text-accent bg-[var(--bg-secondary)] transition-all cursor-pointer"
          >
            {isEn ? "OK" : "సరే"}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
