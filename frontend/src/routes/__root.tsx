import React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { PWAInstallButton } from "../components/PWAInstallButton";
import { StudioConfigProvider } from "../context/StudioConfigContext";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <StudioConfigProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased selection:bg-accent/20 selection:text-accent">
        <Outlet />
        <PWAInstallButton />
      </div>
    </StudioConfigProvider>
  );
}

