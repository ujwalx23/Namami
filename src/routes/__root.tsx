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

  // Track page views
  useEffect(() => {
    const path = location.pathname;
    const isAdmin = path.startsWith("/admin");

    // Skip analytics for admin pages
    if (isAdmin) return;

    // Page View Tracking
    const trackPageView = async () => {
      try {
        await supabase
          .from("page_views" as any)
          .insert({ page_path: path } as any)
          .catch((err) => {
            console.warn("Failed to track page view:", err?.message || err);
          });
      } catch (err) {
        console.warn("Page view tracking error:", err instanceof Error ? err.message : "Unknown error");
      }
    };

    // Debounce tracking to avoid duplicate requests
    const timer = setTimeout(() => {
      void trackPageView();
    }, 500);

    return () => clearTimeout(timer);
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
