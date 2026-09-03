import { useState, useEffect, useCallback, useRef } from "react";
import { InvalidGestureType, InvalidOperationDetails } from "../components/InvalidOperationModal";

export function useGestureProtection() {
  const [invalidOperation, setInvalidOperation] = useState<InvalidOperationDetails | null>(null);
  const lastTriggerTimeRef = useRef<number>(0);

  const triggerInvalidOperation = useCallback((type: InvalidGestureType) => {
    const now = Date.now();
    // Debounce triggers by 1200ms
    if (now - lastTriggerTimeRef.current < 1200) {
      return;
    }
    lastTriggerTimeRef.current = now;
    setInvalidOperation({
      type,
      timestamp: now,
    });
  }, []);

  const dismissInvalidOperation = useCallback(() => {
    setInvalidOperation(null);
  }, []);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isAtTop = false;
    let isLeftEdge = false;
    let isRightEdge = false;
    let pendingGesture: InvalidGestureType | null = null;

    const EDGE_ZONE_PX = 38; // Screen edge trigger threshold
    const MIN_SWIPE_PX = 50;

    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      
      // Check if page or body scroll is at top
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      isAtTop = scrollY <= 15;

      // Check if touch starts within left or right edge boundaries
      isLeftEdge = startX <= EDGE_ZONE_PX;
      isRightEdge = startX >= window.innerWidth - EDGE_ZONE_PX;
      pendingGesture = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // Check for swipe down to refresh (pulling down when at the top)
      if (isAtTop && deltaY > MIN_SWIPE_PX && deltaY > Math.abs(deltaX) * 1.25) {
        pendingGesture = "pull-to-refresh";
        if (e.cancelable) {
          e.preventDefault();
        }
      }

      // Check for edge swipe to back (swiping inward from screen edges)
      if (isLeftEdge && deltaX > MIN_SWIPE_PX && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        pendingGesture = "edge-back";
        if (e.cancelable) {
          e.preventDefault();
        }
      } else if (isRightEdge && deltaX < -MIN_SWIPE_PX && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        pendingGesture = "edge-back";
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      if (pendingGesture) {
        triggerInvalidOperation(pendingGesture);
        pendingGesture = null;
      }
      isAtTop = false;
      isLeftEdge = false;
      isRightEdge = false;
    };

    // Push dummy history entry to trap hardware/gesture back navigation
    try {
      window.history.pushState({ srushtiGuard: true }, "", window.location.href);
    } catch {
      // Ignore if iframe restricts history
    }

    const handlePopState = () => {
      // User performed browser back (e.g. edge swipe back or back button)
      try {
        window.history.pushState({ srushtiGuard: true }, "", window.location.href);
      } catch {
        // Ignore
      }
      triggerInvalidOperation("edge-back");
    };

    // Custom test/developer event listener
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ type: InvalidGestureType }>;
      if (customEvent.detail?.type) {
        triggerInvalidOperation(customEvent.detail.type);
      }
    };

    // Trackpad / mouse wheel upward pull at top of page (desktop pull-to-refresh attempt)
    let accumulatedWheelUp = 0;
    let wheelResetTimer: ReturnType<typeof setTimeout> | null = null;
    const handleWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollY <= 0 && e.deltaY < -15) {
        accumulatedWheelUp += Math.abs(e.deltaY);
        if (wheelResetTimer) clearTimeout(wheelResetTimer);
        wheelResetTimer = setTimeout(() => {
          accumulatedWheelUp = 0;
        }, 350);

        if (accumulatedWheelUp > 130) {
          accumulatedWheelUp = 0;
          triggerInvalidOperation("pull-to-refresh");
        }
      } else if (scrollY > 5) {
        accumulatedWheelUp = 0;
      }
    };

    // Keyboard back navigation shortcut (Alt+LeftArrow)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        triggerInvalidOperation("edge-back");
      }
    };

    // Attach listeners with { passive: false } so preventDefault works to block native refresh/nav
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("srushti:trigger-invalid-gesture", handleCustomEvent);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("srushti:trigger-invalid-gesture", handleCustomEvent);
      if (wheelResetTimer) clearTimeout(wheelResetTimer);
    };
  }, [triggerInvalidOperation]);

  return {
    invalidOperation,
    triggerInvalidOperation,
    dismissInvalidOperation,
  };
}
