import React from "react";

export interface PresentationOption<T extends string> {
  id: T;
  label: string;
  icon: React.ReactNode;
}

interface PresentationSliderProps<T extends string> {
  items: PresentationOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
}

export const PresentationSlider = <T extends string>({
  items,
  selectedId,
  onSelect,
}: PresentationSliderProps<T>) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-1 px-0.5 w-full max-w-full min-w-0">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              id={`btn-presentation-${item.id}`}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl text-[10px] sm:text-[11px] font-extrabold flex flex-row items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 max-w-full ${
                isSelected
                  ? "nm-inset-sm text-accent scale-[0.98] ring-1 ring-accent/30 font-black"
                  : "nm-outset-sm hover:scale-[1.02]"
              }`}
            >
              <span className="flex items-center justify-center shrink-0">
                {item.icon}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-left leading-tight truncate max-w-[150px] sm:max-w-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

