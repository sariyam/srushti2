import React, { Suspense, lazy } from "react";
import { createRouter, createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Route as indexRoute } from "./index";
import { Route as studioRoute } from "./studio";
import { Route as termsRoute } from "./terms";
import { Route as privacyRoute } from "./privacy";

const LazyAdminDashboard = lazy(() =>
  import("./admin-dashboard").then((m) => ({ default: m.AdminDashboardPage }))
);

const TermsAndConditionsPage = lazy(() =>
  import("../components/TermsAndConditionsPage").then((m) => ({ default: m.TermsAndConditionsPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import("../components/PrivacyPolicyPage").then((m) => ({ default: m.PrivacyPolicyPage }))
);

const LazyTerms = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    }
  >
    <TermsAndConditionsPage />
  </Suspense>
);

const LazyPrivacy = () => (
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

const LazyAdmin = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-[var(--md-surface)] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-3 border-accent border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-[var(--md-on-surface-variant)]">Loading Admin Dashboard...</p>
      </div>
    }
  >
    <LazyAdminDashboard />
  </Suspense>
);

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-dashboard",
  component: LazyAdmin,
});

const termsAndConditionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/termsandconditions",
  component: LazyTerms,
});

const termsAndConditionsHyphenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms-and-conditions",
  component: LazyTerms,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacypolicy",
  component: LazyPrivacy,
});

const privacyPolicyHyphenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: LazyPrivacy,
});

// Assemble the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  studioRoute,
  adminDashboardRoute,
  termsRoute,
  privacyRoute,
  termsAndConditionsRoute,
  termsAndConditionsHyphenRoute,
  privacyPolicyRoute,
  privacyPolicyHyphenRoute,
]);

// Create TanStack Router instance
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultErrorComponent: ({ error }) => (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-extrabold border border-red-500/20">
        Navigation Error
      </div>
      <p className="text-xs text-[var(--text-secondary)] max-w-md">
        {(error as any)?.message || "An error occurred while loading this view."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-xl nm-outset text-xs font-bold text-accent hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      >
        Reload View
      </button>
    </div>
  ),
});

// Register router instance for type-safety across TanStack Link and hooks
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
