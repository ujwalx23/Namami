import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanHtmlContent(content: string | null | undefined): string {
  if (!content) return "";
  let cleaned = content.trim();
  // Remove starting ```html or ```
  cleaned = cleaned.replace(/^```html\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/, "");
  // Remove ending ```
  cleaned = cleaned.replace(/\s*```$/, "");
  return cleaned.trim();
}
