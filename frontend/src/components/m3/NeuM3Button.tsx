import React from "react";

export type NeuM3ButtonVariant = "filled" | "tonal" | "outlined" | "fab";

export interface NeuM3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NeuM3ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const NeuM3Button: React.FC<NeuM3ButtonProps> = ({
  variant = "tonal",
  icon,
  iconPosition = "start",
  children,
  className = "",
  disabled,
  loading = false,
  ...props
}) => {
  const variantClass = {
    filled: "neu-m3-btn-filled",
    tonal: "neu-m3-btn-tonal",
    outlined: "neu-m3-btn-outlined",
    fab: "neu-m3-fab",
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`${variantClass} ${disabled || loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
      ) : (
        icon && iconPosition === "start" && <span className="shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === "end" && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
