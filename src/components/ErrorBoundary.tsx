/**
 * Error Boundary Component
 * Catches and handles errors throughout the application
 * Provides user-friendly error messages and recovery options
 */

import React, { ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to external service if needed
    if (window.location.hostname !== "localhost") {
      // Send to error tracking service (e.g., Sentry, LogRocket)
      console.warn("Production error:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="w-full max-w-md">
            <div className="bg-card border border-red-200 rounded-2xl p-8 space-y-6 shadow-lg">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="p-4 bg-red-100 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              {/* Error Message */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Oops! Something went wrong</h1>
                <p className="text-sm text-muted-foreground">
                  We encountered an unexpected error. Please try the options below.
                </p>
              </div>

              {/* Error Details (Dev Mode) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-xs font-mono text-destructive font-semibold">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer font-medium mb-2">Stack Trace</summary>
                      <pre className="overflow-auto max-h-40 text-xs whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <Link
                  to="/"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-input rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </div>

              {/* Help Text */}
              <p className="text-xs text-center text-muted-foreground">
                If the problem persists, please contact support or refresh the page.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
