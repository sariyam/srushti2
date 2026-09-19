import React, { useState } from "react";
import { motion } from "motion/react";
import { LOGOS_BASE64 } from "../assets/logoBase64";
import frontLogo from "../assets/front_logo.png";
import backLogo from "../assets/back_logo.png";

export interface LogoProps {
  theme?: "light" | "dark";
  invertTheme?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ theme, invertTheme, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  let effectiveTheme = theme;
  if (invertTheme) {
    if (theme) {
      effectiveTheme = theme === "light" ? "dark" : "light";
    } else if (typeof document !== "undefined") {
      effectiveTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    }
  }

  const themeClasses =
    effectiveTheme === "dark"
      ? "bg-[#353535] border border-white/10 shadow-[3px_3px_7px_var(--shadow-dark),-3px_-3px_7px_var(--shadow-light)]"
      : effectiveTheme === "light"
      ? "bg-[#e5e5e5] border border-black/10 shadow-[3px_3px_7px_var(--shadow-dark),-3px_-3px_7px_var(--shadow-light)]"
      : "nm-outset bg-[var(--bg-secondary)]";

  const backLogoSrc = LOGOS_BASE64.back || backLogo || "/assets/back_logo.png";
  const frontLogoSrc = LOGOS_BASE64.front || frontLogo || "/assets/front_logo.png";

  return (
    <div
      className={`relative w-9 h-9 rounded-2xl flex items-center justify-center select-none shrink-0 cursor-default transition-all ${themeClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Srushti AI Logo"
    >
      {/* 1. Back Logo Card (Bottom Layer) */}
      <motion.div
        className="absolute w-6 h-6 flex items-center justify-center overflow-hidden z-10"
        animate={{
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <img
          src={backLogoSrc}
          alt="Back Logo"
          className="w-full h-full object-contain opacity-[0.15]"
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

      {/* 2. Front Logo Card (Top Layer - Overlaid perfectly) */}
      <motion.div
        className="absolute w-6 h-6 flex items-center justify-center overflow-hidden z-20"
        animate={{
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
  );
};

