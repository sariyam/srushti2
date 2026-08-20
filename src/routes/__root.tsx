import React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { PwaInstallButton } from "../components/PwaInstallButton";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased selection:bg-accent/20 selection:text-accent">
      <Outlet />
      <PwaInstallButton />
    </div>
  );
}
