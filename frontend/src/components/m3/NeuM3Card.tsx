import React from "react";

export interface NeuM3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "well" | "interactive";
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const NeuM3Card: React.FC<NeuM3CardProps> = ({
  variant = "elevated",
  active = false,
  children,
  className = "",
  ...props
}) => {
  const variantClass = {
    elevated: "neu-m3-card",
    well: "neu-m3-card-well",
    interactive: `neu-m3-card-interactive ${active ? "active" : ""}`,
  }[variant];

  return (
    <div
      data-active={active}
      className={`${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
