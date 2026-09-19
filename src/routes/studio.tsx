import React, { Suspense, lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

const App = lazy(() => import("../App"));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio",
  component: StudioRouteComponent,
});

function StudioRouteComponent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <div className="text-xs font-bold text-accent tracking-wider uppercase animate-pulse">
            Loading Studio...
          </div>
        </div>
      }
    >
      <App />
    </Suspense>
  );
}

