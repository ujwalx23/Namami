import { Outlet, Link, createRootRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { LangProvider } from "@/i18n/LangProvider";
import { AudioProvider } from "@/lib/AudioContext";
import { FloatingPlayer } from "@/components/FloatingPlayer";
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
  const router = useRouter();

  // SPA: set the document title once on mount. Per-route titles can override.
  useEffect(() => {
    document.title = "Namami Vindhyavasini Sansthan";
  }, []);

  // Listen for global site push notification broadcasts
  useEffect(() => {
    const channel = supabase.channel("site-notifications");

    channel
      .on("broadcast", { event: "notification" }, ({ payload }) => {
        console.log("[Realtime Notification] Received broadcast:", payload);
        toast.info(payload.title, {
          description: payload.body,
          duration: 8000,
          action: payload.url ? {
            label: "View",
            onClick: () => {
              void router.navigate({ to: payload.url });
            },
          } : undefined,
        });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return (
    <LangProvider>
      <AudioProvider>
        <Outlet />
        <FloatingPlayer />
        <Toaster richColors position="top-center" />
      </AudioProvider>
    </LangProvider>
  );
}
