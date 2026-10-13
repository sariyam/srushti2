import React from "react";

export interface NeuM3TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const NeuM3TextField: React.FC<NeuM3TextFieldProps> = ({
  label,
  helperText,
  error,
  startIcon,
  endIcon,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-[var(--md-on-surface-variant)] tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {startIcon && (
          <span className="absolute left-3.5 text-[var(--md-outline)] pointer-events-none">
            {startIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`neu-m3-input ${startIcon ? "pl-10" : ""} ${endIcon ? "pr-10" : ""} ${
            error ? "border-[var(--md-error)] focus:border-[var(--md-error)]" : ""
          } ${className}`}
          {...props}
        />
        {endIcon && (
          <span className="absolute right-3.5 text-[var(--md-outline)]">
            {endIcon}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <p
          className={`text-[11px] font-medium ${
            error ? "text-[var(--md-error)]" : "text-[var(--md-on-surface-variant)]"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};
