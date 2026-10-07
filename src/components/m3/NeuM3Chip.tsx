import React from "react";

export interface NeuM3ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const NeuM3Chip: React.FC<NeuM3ChipProps> = ({
  active = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`neu-m3-chip ${active ? "active" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
