import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

import { subscribeToNotifications } from "./lib/push";

// Service Worker & PWA Install Registration
if (typeof window !== "undefined") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[Service Worker] Registered successfully:", reg.scope);
          void subscribeToNotifications();
        })
        .catch((err) => console.error("[Service Worker] Registration failed:", err));
    });
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent default mini-infobar prompt
    e.preventDefault();
    // Store event globally
    (window as any).deferredPrompt = e;
    // Notify components
    window.dispatchEvent(new CustomEvent("pwa-install-available"));
    console.log("[PWA] Install prompt is available and captured.");
  });

  window.addEventListener("appinstalled", () => {
    // Clear deferred prompt reference
    (window as any).deferredPrompt = null;
    console.log("[PWA] App was successfully installed.");
  });
}

const router = getRouter();

const rootEl = document.getElementById("root")!;
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
