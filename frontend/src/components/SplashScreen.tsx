import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LOGOS_BASE64 } from "../assets/logoBase64";
import frontLogo from "../assets/front_logo.png";
import backLogo from "../assets/back_logo.png";

interface SplashScreenProps {
  onComplete: () => void;
  theme: "light" | "dark";
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, theme }) => {
  const [phase, setPhase] = useState<"initial" | "fadeBack" | "exit">("initial");

  const backLogoSrc = LOGOS_BASE64.back || backLogo || "/assets/back_logo.png";
  const frontLogoSrc = LOGOS_BASE64.front || frontLogo || "/assets/front_logo.png";

  useEffect(() => {
    // Phase 1: Wait 1 second with both logos fully visible, then trigger blur and fade out of back logo
    const timer1 = setTimeout(() => {
      setPhase("fadeBack");
    }, 1000);

    // Phase 2: Wait another 1.2 seconds (total 2.2s) to show the final front logo, then transition out
    const timer2 = setTimeout(() => {
      setPhase("exit");
    }, 2200);

    // Phase 3: Total duration of 2.6 seconds, trigger onComplete
    const timer3 = setTimeout(() => {
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 dark:bg-neutral-950 transition-colors duration-500"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Main glowing ambient backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Logo container wrapper with elegant card styling */}
          <motion.div
            className="relative flex flex-col items-center space-y-6 px-12 py-16 rounded-3xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md shadow-2xl max-w-sm w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {/* The circular background behind the logos */}
            <div className="relative w-24 h-24 rounded-full bg-neutral-850 dark:bg-neutral-800 flex items-center justify-center shadow-inner overflow-hidden border border-neutral-700/30">
              {/* Back Logo (Bottom Layer) */}
              <motion.div
                className="absolute w-16 h-16 flex items-center justify-center pointer-events-none z-10"
                initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                animate={{
                  opacity: phase === "initial" ? 1 : 0,
                  filter: phase === "initial" ? "blur(0px)" : "blur(12px)",
                  scale: phase === "initial" ? 1 : 0.8,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <img
                  src={backLogoSrc}
                  alt="Back Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.dataset.failed) {
                      target.dataset.failed = "1";
                      target.src = backLogo || "/assets/back_logo.png";
                    } else if (target.dataset.failed === "1") {
                      target.dataset.failed = "2";
                      target.src = "/back_logo.png";
                    }
                  }}
                />
              </motion.div>

              {/* Front Logo (Top Layer) */}
              <motion.div
                className="absolute w-16 h-16 flex items-center justify-center pointer-events-none z-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
              >
                <img
                  src={frontLogoSrc}
                  alt="Front Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.dataset.failed) {
                      target.dataset.failed = "1";
                      target.src = frontLogo || "/assets/front_logo.png";
                    } else if (target.dataset.failed === "1") {
                      target.dataset.failed = "2";
                      target.src = "/front_logo.png";
                    }
                  }}
                />
              </motion.div>
            </div>

            {/* App Branding Text */}
            <div className="text-center space-y-2 select-none">
              <motion.h2
                className="text-xl font-bold tracking-wider text-neutral-100 font-sans"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Srushti AI
              </motion.h2>
              <motion.p
                className="text-xs text-neutral-400 font-medium tracking-widest uppercase font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Business to Brand
              </motion.p>
            </div>

            {/* Micro loading progress line */}
            <div className="w-32 h-0.5 bg-neutral-800 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 bottom-0 left-0 bg-accent rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
