import React from "react";
import { Language } from "../types";

export type InvalidGestureType = "pull-to-refresh" | "edge-back";

export interface InvalidOperationDetails {
  type: InvalidGestureType;
  timestamp: number;
}

interface InvalidOperationModalProps {
  details?: InvalidOperationDetails | null;
  onClose?: () => void;
  lang?: Language;
}

/**
 * InvalidOperationModal: UI pop-up is disabled per user request,
 * while underlying gesture prevention logic operates silently.
 */
export const InvalidOperationModal: React.FC<InvalidOperationModalProps> = () => {
  return null;
};

