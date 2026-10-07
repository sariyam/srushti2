import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NeuM3IconButton } from "./NeuM3IconButton";

export interface NeuM3DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const NeuM3Dialog: React.FC<NeuM3DialogProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md",
  className = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const maxWClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWClasses} neu-m3-dialog p-5 sm:p-6 z-10 flex flex-col max-h-[90vh] overflow-hidden ${className}`}
          >
            {/* Header */}
            {(title || subtitle) && (
              <div className="flex items-start justify-between pb-4 border-b border-black/5 dark:border-white/5 mb-4 shrink-0">
                <div>
                  {title && (
                    <h2 className="text-lg sm:text-xl font-black text-[var(--md-on-surface)] tracking-tight">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5 font-medium">
                      {subtitle}
                    </p>
                  )}
                </div>
                <NeuM3IconButton size="sm" onClick={onClose} aria-label="Close">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </NeuM3IconButton>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
