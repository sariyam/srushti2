import React, { Suspense, lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

const PrivacyPolicyPage = lazy(() =>
  import("../components/PrivacyPolicyPage").then((m) => ({ default: m.PrivacyPolicyPage }))
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyRouteComponent,
});

function PrivacyRouteComponent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <PrivacyPolicyPage />
    </Suspense>
  );
}

