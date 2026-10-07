import React from "react";

export interface NeuM3TabItem<T = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface NeuM3TabsProps<T = string> {
  tabs: NeuM3TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
}

export function NeuM3Tabs<T = string>({
  tabs,
  activeTab,
  onChange,
  className = "",
}: NeuM3TabsProps<T>) {
  return (
    <div className={`neu-m3-tabs-track ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={String(tab.id)}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`neu-m3-tab-item ${isActive ? "active" : ""}`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && <span className="shrink-0">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
