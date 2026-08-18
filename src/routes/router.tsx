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

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacypolicy",
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
  privacyPolicyRoute,
]);

// Create TanStack Router instance
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register router instance for type-safety across TanStack Link and hooks
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

