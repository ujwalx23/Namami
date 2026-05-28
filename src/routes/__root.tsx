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

  // Track page views and presence for live visitor count
  useEffect(() => {
    const path = location.pathname;
    const isAdmin = path.startsWith("/admin");

    // 1. Page View Tracking — skip admin to keep analytics clean
    if (!isAdmin) {
      const trackPageView = async () => {
        try {
          const { error } = await supabase.from("page_views" as any).insert({ page_path: path } as any);
          if (error) {
            console.warn("Failed to track page view:", error.message);
          }
        } catch (err) {
          console.warn("Page view tracking error:", err instanceof Error ? err.message : "Unknown error");
        }
      };
      void trackPageView();
    }

    // 2. Live Presence Tracking — always track ALL pages including admin
    //    so the admin shows up in the live visitor count too
    let sessionKey = Math.random().toString(36).substring(2, 15);
    let channel: any = null;
    let unsubscribeTimeout: NodeJS.Timeout;

    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const stored = sessionStorage.getItem("visitor_presence_key");
        if (stored) {
          sessionKey = stored;
        } else {
          sessionStorage.setItem("visitor_presence_key", sessionKey);
        }
      }
    } catch (e) {
      console.warn("sessionStorage not accessible:", e instanceof Error ? e.message : "Unknown error");
    }

    try {
      channel = supabase.channel("live_visitors", {
        config: {
          presence: {
            key: sessionKey,
          },
        },
      });

      channel.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          try {
            await channel.track({
              online_at: new Date().toISOString(),
              page: path,
            });
          } catch (err) {
            console.warn("Failed to track presence:", err instanceof Error ? err.message : "Unknown error");
          }
        }
      });
    } catch (err) {
      console.warn("Presence channel initialization error:", err instanceof Error ? err.message : "Unknown error");
    }

    return () => {
      if (channel) {
        try {
          void channel.unsubscribe();
        } catch (err) {
          console.warn("Error unsubscribing from channel:", err instanceof Error ? err.message : "Unknown error");
        }
      }
      if (unsubscribeTimeout) clearTimeout(unsubscribeTimeout);
    };
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
