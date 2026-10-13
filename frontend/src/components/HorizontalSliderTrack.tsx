import React from "react";

interface HorizontalSliderTrackProps {
  children: React.ReactNode;
  className?: string;
}

export const HorizontalSliderTrack: React.FC<HorizontalSliderTrackProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 py-1 px-0.5 w-full ${className}`}>
      {children}
    </div>
  );
};

