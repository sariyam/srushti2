import React from "react";

export interface NeuM3IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "standard" | "filled" | "tonal";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const NeuM3IconButton: React.FC<NeuM3IconButtonProps> = ({
  children,
  variant = "standard",
  className = "",
  size = "md",
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-xs",
    md: "w-10 h-10 rounded-xl text-sm",
    lg: "w-12 h-12 rounded-2xl text-base",
  }[size];

  const variantClasses = {
    standard: "neu-m3-icon-btn",
    filled: "neu-m3-icon-btn bg-accent text-neutral-950 hover:bg-accent/90",
    tonal: "neu-m3-icon-btn bg-[var(--md-surface-container-high)] text-[var(--color-accent)]",
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`${sizeClasses} ${variantClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
