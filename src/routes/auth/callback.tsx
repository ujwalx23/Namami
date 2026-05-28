/**
 * Auth Callback Route
 * Handles OAuth redirects from Supabase authentication providers
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL params
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          setStatus("error");
          setMessage("No authentication code received. Please try again.");
          setTimeout(() => navigate({ to: "/" }), 3000);
          return;
        }

        // Exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code,
        );

        if (error) {
          console.error("Auth exchange failed:", error);
          setStatus("error");
          setMessage(
            error.message || "Authentication failed. Please try again.",
          );
          setTimeout(() => navigate({ to: "/" }), 3000);
          return;
        }

        if (!data.session) {
          setStatus("error");
          setMessage("No session created. Please try again.");
          setTimeout(() => navigate({ to: "/" }), 3000);
          return;
        }

        setStatus("success");
        setMessage("Authentication successful! Redirecting...");

        // Redirect to home after a short delay
        setTimeout(() => navigate({ to: "/" }), 1500);
      } catch (error) {
        console.error("Unexpected error during auth callback:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        );
        setTimeout(() => navigate({ to: "/" }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {status === "loading" && (
          <>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Authenticating...
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we complete your sign-in.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 rounded-full">
                <span className="text-2xl">✓</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Success!
            </h1>
            <p className="text-sm text-muted-foreground">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <span className="text-2xl">✕</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-600">
              Authentication Failed
            </h1>
            <p className="text-sm text-muted-foreground">{message}</p>
            <p className="text-xs text-muted-foreground">
              Redirecting to home page...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
