import { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col mandala-bg">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ title, subtitle, sanskrit }: { title: string; subtitle?: string; sanskrit?: string }) {
  return (
    <section className="relative bg-gradient-divine border-b border-border/60 overflow-hidden">
      <div className="absolute inset-0 mandala-bg opacity-60" />
      <div className="container mx-auto px-6 py-20 relative text-center">
        {sanskrit && <div className="font-devanagari text-saffron text-lg mb-3">{sanskrit}</div>}
        <h1 className="font-display text-5xl md:text-6xl text-maroon mb-4">{title}</h1>
        {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{subtitle}</p>}
        <div className="mx-auto mt-6 w-24 h-[2px] bg-gradient-sacred rounded-full" />
      </div>
    </section>
  );
}
