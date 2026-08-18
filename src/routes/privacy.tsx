import React from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { PrivacyPolicyPage } from "../components/PrivacyPolicyPage";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyRouteComponent,
});

function PrivacyRouteComponent() {
  return <PrivacyPolicyPage />;
}
