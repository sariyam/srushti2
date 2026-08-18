import React from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { TermsAndConditionsPage } from "../components/TermsAndConditionsPage";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsRouteComponent,
});

function TermsRouteComponent() {
  return <TermsAndConditionsPage />;
}
