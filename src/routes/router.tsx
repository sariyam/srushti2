import { createRouter, createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Route as indexRoute } from "./index";
import { Route as studioRoute } from "./studio";
import { Route as appRoute } from "./app";
import { Route as termsRoute } from "./terms";
import { Route as privacyRoute } from "./privacy";
import { TermsAndConditionsPage } from "../components/TermsAndConditionsPage";
import { PrivacyPolicyPage } from "../components/PrivacyPolicyPage";

const termsAndConditionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/termsandconditions",
  component: TermsAndConditionsPage,
});

const termsAndConditionsHyphenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms-and-conditions",
  component: TermsAndConditionsPage,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacypolicy",
  component: PrivacyPolicyPage,
});

const privacyPolicyHyphenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});

// Assemble the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  studioRoute,
  appRoute,
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
