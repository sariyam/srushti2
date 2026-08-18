import React from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import App from "../App";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio",
  component: StudioRouteComponent,
});

function StudioRouteComponent() {
  return <App />;
}
