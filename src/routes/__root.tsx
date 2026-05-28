import { Outlet, Link, createRootRoute, useLocation } from "@tanstack/react-router";
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

  useEffect(() => {
    document.title = "Namami Vindhyavasini Sansthan";
  }, []);

  // Track page views and live visitors via heartbeat table
  useEffect(() => {
    const path = location.pathname;
    const isAdmin = path.startsWith("/admin");

    // 1. Page view tracking — skip admin to keep stats clean
    if (!isAdmin) {
      void supabase.from("page_views" as any).insert({ page_path: path } as any);
    }

    // 2. Heartbeat — upsert a row every 30s so admin can count
    //    sessions active in last 2 min. Works everywhere, no Realtime needed.
    let sessionId = "";
    try {
      sessionId = localStorage.getItem("__vis_sid") ?? "";
      if (!sessionId) {
        sessionId =
          Math.random().toString(36).substring(2) +
          Date.now().toString(36);
        localStorage.setItem("__vis_sid", sessionId);
      }
    } catch {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    const beat = () =>
      void supabase.from("visitor_heartbeats" as any).upsert(
        { session_id: sessionId, last_seen: new Date().toISOString(), page_path: path } as any,
        { onConflict: "session_id" }
      );

    beat(); // immediate on navigation
    const iv = setInterval(beat, 30_000); // keep-alive every 30 s

    return () => clearInterval(iv);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <LangProvider>
        <InboxProvider>
          <AudioProvider>
            <Outlet />
            <FloatingPlayer />
            <Toaster richColors position="top-center" />
          </AudioProvider>
        </InboxProvider>
      </LangProvider>
    </ErrorBoundary>
  );
}
