import React from "react";
import { Icon } from "@iconify/react";

export interface NavArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const NavArrowButton: React.FC<NavArrowButtonProps> = ({
  direction,
  onClick,
  disabled = false,
  ariaLabel,
  size = "md",
  className = "",
}) => {
  const isLeft = direction === "left";
  const defaultLabel = isLeft ? "Previous" : "Next";

  const sizeClasses = {
    sm: "w-6.5 h-6.5",
    md: "w-7 h-7",
    lg: "w-8 h-8",
  }[size];

  const iconSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-4.5 h-4.5",
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || defaultLabel}
      className={`rounded-full flex items-center justify-center shrink-0 transition-all select-none !bg-[var(--color-accent)] ${sizeClasses} ${
        disabled
          ? "opacity-30 cursor-not-allowed shadow-none"
          : "opacity-100 hover:scale-110 active:scale-95 cursor-pointer shadow-md hover:shadow-lg"
      } ${className}`}
    >
      <Icon
        icon={isLeft ? "lucide:chevron-left" : "lucide:chevron-right"}
        className={`${iconSizeClasses} !text-black stroke-[2.5]`}
      />
    </button>
  );
};

export const LeftArrowButton: React.FC<Omit<NavArrowButtonProps, "direction">> = (props) => (
  <NavArrowButton direction="left" {...props} />
);

export const RightArrowButton: React.FC<Omit<NavArrowButtonProps, "direction">> = (props) => (
  <NavArrowButton direction="right" {...props} />
);
