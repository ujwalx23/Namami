import { Outlet, Link, createRootRoute, useLocation, HeadContent } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { LangProvider } from "@/i18n/LangProvider";
import { AudioProvider } from "@/lib/AudioContext";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import { InboxProvider } from "@/lib/InboxContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const location = useLocation();

  // Track live visitors via heartbeat table with instant cleanup on tab close
  useEffect(() => {
    const path = location.pathname;

    let sessionId = "";
    try {
      sessionId = sessionStorage.getItem("__vis_sid") ?? "";
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("__vis_sid", sessionId);
      }
    } catch {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    const beat = () => {
      console.log("[Heartbeat] Sending session:", sessionId, "path:", path);
      void supabase
        .from("visitor_heartbeats" as any)
        .upsert(
          { session_id: sessionId, last_seen: new Date().toISOString(), page_path: path } as any,
          { onConflict: "session_id" },
        )
        .then(({ error }) => {
          if (error) {
            console.error("[Heartbeat] Upsert failed:", error);
          } else {
            console.log("[Heartbeat] Upsert succeeded");
          }
        });
    };

    const cleanUpSession = () => {
      console.log("[Heartbeat] Performing instant cleanup for session:", sessionId);
      const baseUrl = (supabase as any).supabaseUrl || "https://avmemxowlunhlyfntiqu.supabase.co";
      const key =
        (supabase as any).supabaseKey ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bWVteG93bHVuaGx5Zm50aXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTIyOTMsImV4cCI6MjA5NTI2ODI5M30.R5DwGPSWZH_PXmsEnUntYu7WyHK6VHXsEUkq8zISRkw";
      const url = `${baseUrl}/rest/v1/visitor_heartbeats?session_id=eq.${sessionId}`;
      void fetch(url, {
        method: "DELETE",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        keepalive: true,
      });
    };

    beat(); // immediate on navigation
    const iv = setInterval(beat, 30_000); // keep-alive every 30 s

    // Send heartbeat when tab visibility changes back to visible
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        console.log("[Heartbeat] Tab became visible, sending beat");
        beat();
      }
    };

    window.addEventListener("beforeunload", cleanUpSession);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      console.log("[Heartbeat] Cleaning up interval & listeners for path:", path);
      clearInterval(iv);
      window.removeEventListener("beforeunload", cleanUpSession);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <LangProvider>
        <InboxProvider>
          <AudioProvider>
            <HeadContent />
            <Outlet />
            <FloatingPlayer />
            <Toaster richColors position="top-center" />
          </AudioProvider>
        </InboxProvider>
      </LangProvider>
    </ErrorBoundary>
  );
}
