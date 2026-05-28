/**
 * Network Error Handler Utility
 * 
 * Provides consistent error handling for network requests, database queries,
 * and API calls throughout the application.
 * 
 * Usage:
 * ```tsx
 * import { handleError, isNetworkError, isServerError } from "@/lib/errorHandler";
 * 
 * try {
 *   const { data, error } = await supabase.from('table').select();
 *   if (error) {
 *     handleError(error, "Failed to fetch data");
 *   }
 * } catch (err) {
 *   handleError(err, "Unexpected error");
 * }
 * ```
 */

import { toast } from "sonner";

export interface ErrorContext {
  operation?: string;
  context?: string;
  userId?: string;
  timestamp?: string;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;

  const message = error.message?.toLowerCase() || "";
  const code = error.code?.toString().toLowerCase() || "";

  return (
    message.includes("network") ||
    message.includes("offline") ||
    message.includes("connection") ||
    code.includes("econnrefused") ||
    code.includes("enotfound") ||
    error.status === 0 ||
    (error.response?.status === 0)
  );
}

/**
 * Check if error is a server error (5xx)
 */
export function isServerError(error: any): boolean {
  const status = error.status || error.response?.status;
  return status >= 500 && status < 600;
}

/**
 * Check if error is a client error (4xx)
 */
export function isClientError(error: any): boolean {
  const status = error.status || error.response?.status;
  return status >= 400 && status < 500;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  const message = error.message?.toLowerCase() || "";
  const status = error.status || error.response?.status;

  return (
    status === 401 ||
    status === 403 ||
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    message.includes("authentication") ||
    message.includes("not authenticated")
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: any): string {
  if (!error) {
    return "An unexpected error occurred";
  }

  // Network errors
  if (isNetworkError(error)) {
    return "Network connection error. Please check your internet and try again.";
  }

  // Server errors
  if (isServerError(error)) {
    return "Server error. Please try again in a moment.";
  }

  // Auth errors
  if (isAuthError(error)) {
    return "Authentication failed. Please log in again.";
  }

  // Specific Supabase errors
  if (error.code === "PGRST116") {
    return "No records found.";
  }

  if (error.code === "23505") {
    return "This record already exists.";
  }

  if (error.code === "23503") {
    return "Cannot delete this record as it's referenced elsewhere.";
  }

  // Use provided message if available
  if (error.message && typeof error.message === "string") {
    return error.message;
  }

  // Fallback
  return "Something went wrong. Please try again.";
}

/**
 * Log error with context (for debugging)
 */
export function logError(
  error: any,
  context: ErrorContext = {},
) {
  const errorData = {
    message: error?.message || "Unknown error",
    code: error?.code,
    status: error?.status,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (process.env.NODE_ENV === "development") {
    console.error("[ErrorHandler]", errorData);
  }

  // In production, you might send to an error tracking service
  // Example: Sentry.captureException(error);
}

/**
 * Handle error with automatic toast notification
 */
export function handleError(
  error: any,
  userMessage?: string,
  context?: ErrorContext,
) {
  // Log the error
  logError(error, context);

  // Get message to show user
  const message = userMessage || getUserFriendlyMessage(error);

  // Show toast
  if (isNetworkError(error)) {
    toast.error(message, {
      description: "Please check your connection",
    });
  } else if (isServerError(error)) {
    toast.error(message, {
      description: "Our servers are experiencing issues",
    });
  } else if (isAuthError(error)) {
    toast.error(message, {
      description: "Please log in again",
    });
  } else {
    toast.error(message);
  }
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 1000,
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry client errors (4xx) except 408 and 429
      const status = (error as any).status;
      if (isClientError(error) && status !== 408 && status !== 429) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = initialDelayMs * Math.pow(2, i);

      if (i < maxRetries - 1) {
        console.warn(
          `Request failed, retrying in ${delay}ms...`,
          error instanceof Error ? error.message : error,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string,
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorMessage);
      throw error;
    }
  }) as T;
}

export default {
  handleError,
  logError,
  isNetworkError,
  isServerError,
  isClientError,
  isAuthError,
  getUserFriendlyMessage,
  retryWithBackoff,
  withErrorHandling,
};
