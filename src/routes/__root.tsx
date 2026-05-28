import { Outlet, Link, createRootRoute, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { LangProvider } from "@/i18n/LangProvider";
import { AudioProvider } from "@/lib/AudioContext";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import { InboxProvider } from "@/lib/InboxContext";
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
    
    // Don't track admin pages for visitor counts/page views to avoid clutter
    if (path.startsWith("/admin")) return;

    // 1. Page View Tracking
    const trackPageView = async () => {
      const { error } = await supabase.from("page_views" as any).insert({ page_path: path } as any);
      if (error) {
        console.error("Failed to track page view:", error);
      }
    };
    void trackPageView();

    // 2. Live Presence Tracking
    const channel = supabase.channel("live_visitors", {
      config: {
        presence: {
          key: Math.random().toString(36).substring(2, 15), // Unique session key
        },
      },
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          online_at: new Date().toISOString(),
          page: path,
        });
      }
    });

    return () => {
      void channel.unsubscribe();
    };
  }, [location.pathname]);

  return (
    <LangProvider>
      <InboxProvider>
        <AudioProvider>
          <Outlet />
          <FloatingPlayer />
          <Toaster richColors position="top-center" />
        </AudioProvider>
      </InboxProvider>
    </LangProvider>
  );
}
