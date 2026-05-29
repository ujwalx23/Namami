import { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col mandala-bg overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1 animate-fade-in">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  title,
  subtitle,
  sanskrit,
}: {
  title: string;
  subtitle?: string;
  sanskrit?: string;
}) {
  return (
    <section className="relative bg-gradient-divine border-b border-border/60 overflow-hidden">
      <div className="absolute inset-0 mandala-bg opacity-60" />
      
      {/* Rotating Background Mandala Watermarks */}
      <svg
        className="absolute -left-16 -top-16 md:-left-24 md:-top-24 w-64 h-64 md:w-96 md:h-96 opacity-10 text-gold/30 animate-spin-reverse-slow pointer-events-none select-none"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      >
        <circle cx="60" cy="60" r="54" />
        <circle cx="60" cy="60" r="48" strokeDasharray="3 3" />
        <circle cx="60" cy="60" r="36" />
        <circle cx="60" cy="60" r="24" />
        <circle cx="60" cy="60" r="12" />
        <path d="M60 6 L60 114 M6 60 L114 60" />
        <path d="M21.8 21.8 L98.2 98.2 M21.8 98.2 L98.2 21.8" />
        <path d="M60 6 L65 24 L60 20 L55 24 Z" />
        <path d="M60 114 L65 96 L60 100 L55 96 Z" />
        <path d="M6 60 L24 65 L20 60 L24 55 Z" />
        <path d="M114 60 L96 65 L100 60 L96 55 Z" />
        <circle cx="60" cy="15" r="3" fill="currentColor" />
        <circle cx="60" cy="105" r="3" fill="currentColor" />
        <circle cx="15" cy="60" r="3" fill="currentColor" />
        <circle cx="105" cy="60" r="3" fill="currentColor" />
      </svg>
      
      <svg
        className="absolute -right-16 -bottom-16 md:-right-24 md:-bottom-24 w-64 h-64 md:w-96 md:h-96 opacity-15 text-gold/40 animate-spin-slow pointer-events-none select-none"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      >
        <circle cx="60" cy="60" r="54" />
        <circle cx="60" cy="60" r="48" strokeDasharray="3 3" />
        <circle cx="60" cy="60" r="36" />
        <circle cx="60" cy="60" r="24" />
        <circle cx="60" cy="60" r="12" />
        <path d="M60 6 L60 114 M6 60 L114 60" />
        <path d="M21.8 21.8 L98.2 98.2 M21.8 98.2 L98.2 21.8" />
        <path d="M60 6 L65 24 L60 20 L55 24 Z" />
        <path d="M60 114 L65 96 L60 100 L55 96 Z" />
        <path d="M6 60 L24 65 L20 60 L24 55 Z" />
        <path d="M114 60 L96 65 L100 60 L96 55 Z" />
        <circle cx="60" cy="15" r="3" fill="currentColor" />
        <circle cx="60" cy="105" r="3" fill="currentColor" />
        <circle cx="15" cy="60" r="3" fill="currentColor" />
        <circle cx="105" cy="60" r="3" fill="currentColor" />
      </svg>

      <div className="container mx-auto px-6 py-20 relative text-center">
        {sanskrit && <div className="font-devanagari text-saffron text-base md:text-lg mb-3 break-words leading-relaxed">{sanskrit}</div>}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-maroon mb-4 break-words leading-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg break-words leading-relaxed">{subtitle}</p>}
        <div className="mx-auto mt-6 w-24 h-[2px] bg-gradient-sacred rounded-full" />
      </div>
    </section>
  );
}
