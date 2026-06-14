import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState } from "react";
import { Phone, Mail, MapPin, CalendarPlus, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useLang } from "@/i18n/LangProvider";
import type { TKey } from "@/i18n/translations";
import { JsonLd } from "@/components/JsonLd";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Namami Vindhyavasini Sansthan | Address & Location Map" },
      {
        name: "description",
        content:
          "Get in touch with Namami Vindhyavasini Sansthan. Find office address, contact number, email, and Google Map location for visiting Vindhyachal Dham.",
      },
      {
        name: "keywords",
        content:
          "Vindhyavasini contact details, contact number, temple address, booking appointment with Gurudev, Vindhyachal Dham office, संपर्क",
      },
      { property: "og:title", content: "Contact Namami Vindhyavasini Sansthan | Address & Location Map" },
      {
        property: "og:description",
        content:
          "Get in touch with Namami Vindhyavasini Sansthan. Find office address, contact number, email, and Google Map location for visiting Vindhyachal Dham.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/contact" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact Namami Vindhyavasini Sansthan" },
      {
        name: "twitter:description",
        content:
          "Get in touch with Namami Vindhyavasini Sansthan. Find address, contact, and map locations.",
      },
      { name: "twitter:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.namamivindhyavasini.in/contact" }
    ]
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5, "Please enter a valid phone number").max(30),
  message: z.string().trim().min(3).max(2000),
});

const apptSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(30),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  appointment_date: z.string().min(1),
  time_slot: z.string().min(1),
  purpose: z.string().trim().min(1).max(1000),
});

const SLOT_KEYS: TKey[] = ["ct.slot.morning", "ct.slot.late", "ct.slot.noon", "ct.slot.evening"];

function ContactPage() {
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/contact#webpage",
    "url": "https://www.namamivindhyavasini.in/contact",
    "name": "Contact Namami Vindhyavasini Sansthan | Address & Location Map",
    "description": "Get in touch with Namami Vindhyavasini Sansthan. Find office address, contact number, email, and Google Map location for visiting Vindhyachal Dham.",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://www.namamivindhyavasini.in/#website",
      "url": "https://www.namamivindhyavasini.in"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.namamivindhyavasini.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact",
        "item": "https://www.namamivindhyavasini.in/contact"
      }
    ]
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <PageHero sanskrit={t("ct.sanskrit")} title={t("ct.title")} subtitle={t("ct.subtitle")} />

      <section className="w-full py-16 px-4 xs:px-6 flex justify-center">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-start justify-items-center">
          <div className="w-full max-w-md">
            <div className="space-y-5 mb-10">
              {[
                { icon: MapPin, label: t("ct.visit"), value: t("ct.address"), href: "" },
                {
                  icon: Phone,
                  label: t("ct.call"),
                  value: "+91 93343 39505",
                  href: "tel:+919334339505",
                },
                {
                  icon: Mail,
                  label: t("ct.email"),
                  value: "contact@namamivindhyavasini.in",
                  href: "mailto:contact@namamivindhyavasini.in",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-gold/30 transition shadow-sm w-full"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream mb-2.5">
                    <c.icon size={18} />
                  </div>
                  <div>
                    <div className={`text-xs uppercase tracking-[0.2em] text-saffron ${dev}`}>
                      {c.label}
                    </div>
                    <div className={`font-medium text-maroon mt-1.5 ${dev}`}>
                      {c.href ? (
                        <a href={c.href} className="hover:text-saffron">
                          {c.value}
                        </a>
                      ) : (
                        c.value
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden border-2 border-gold/40 shadow-gold">
              <iframe
                title="Vindhyachal Dham"
                src="https://www.google.com/maps?q=Maa+Vindhyavasini+Temple,Vindhyachal&ll=25.1643346,82.5060022&z=18&t=k&output=embed"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <div className="space-y-8 w-full max-w-md">
            <ContactForm />
            <AppointmentForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ContactForm() {
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("[ContactForm] Form submit triggered.");

    try {
      const fd = new FormData(e.currentTarget);
      const data = {
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || "") || undefined,
        message: String(fd.get("message") || ""),
      };

      console.log("[ContactForm] Form data collected:", data);

      const parsed = contactSchema.safeParse(data);
      if (!parsed.success) {
        console.warn("[ContactForm] Validation failed:", parsed.error);
        return toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      }

      setBusy(true);
      console.log("[ContactForm] Inserting message into Supabase 'contacts' table...");

      const { error } = await supabase.from("contacts").insert(parsed.data);
      setBusy(false);

      if (error) {
        console.error("[ContactForm] Supabase insert failed:", error);
        return toast.error(error.message);
      }

      console.log("[ContactForm] Supabase insert succeeded.");
      setSent(true);
      toast.success(t("ct.f.toast"));

      // Send Telegram notification
      try {
        const telegramToken = "8613225182:AAGGEGLpjlicL-rE_vzIfIMCt757_Umpn_U";
        const telegramChatId = "5835649452";
        const telegramText = `🔔 New Contact Form Submission\n\nName: ${parsed.data.name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone || "N/A"}\nMessage: ${parsed.data.message}`;

        console.log("[ContactForm] Sending Telegram notification...");
        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramText,
          }),
        });

        if (!response.ok) {
          throw new Error(`Telegram API responded with status ${response.status}`);
        }
        const resData = await response.json();
        console.log("[ContactForm] Telegram notification sent successfully:", resData);
      } catch (telegramErr) {
        console.error("[ContactForm] Failed to send Telegram notification:", telegramErr);
      }
    } catch (err) {
      console.error("[ContactForm] Unexpected error during submit:", err);
      setBusy(false);
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-5 xs:p-6 sm:p-8 rounded-2xl bg-card border border-border">
      <div className="flex flex-col items-center justify-center gap-2 mb-5 text-center">
        <Send size={18} className="text-saffron" />
        <h2 className={`font-display text-2xl text-maroon ${dev}`}>{t("ct.send.title")}</h2>
      </div>
      {sent ? (
        <div className="p-6 rounded-xl bg-gradient-divine border border-gold/40 text-center">
          <div className="font-devanagari text-saffron mb-1">{t("ct.f.thanksH")}</div>
          <div className={`font-display text-xl text-maroon ${dev}`}>{t("ct.f.thanks")}</div>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          <input
            name="name"
            required
            placeholder={t("ct.f.name")}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring"
          />
          <input
            name="email"
            required
            type="email"
            placeholder={t("ct.f.email")}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring"
          />
          <input
            name="phone"
            required
            placeholder={t("ct.f.phone")}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring"
          />
          <textarea
            name="message"
            required
            rows={4}
            placeholder={t("ct.f.msg")}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring resize-none"
          />
          <button
            disabled={busy}
            type="submit"
            className={`w-full px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-60 cursor-pointer ${dev}`}
          >
            {busy ? t("ct.f.sending") : t("ct.f.send")}
          </button>
        </div>
      )}
    </form>
  );
}

function AppointmentForm() {
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("[AppointmentForm] Form submit triggered.");

    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || "") || undefined,
      appointment_date: String(fd.get("appointment_date") || ""),
      time_slot: String(fd.get("time_slot") || ""),
      purpose: String(fd.get("purpose") || ""),
    };

    console.log("[AppointmentForm] Form data collected:", data);

    const parsed = apptSchema.safeParse(data);
    if (!parsed.success) {
      console.warn("[AppointmentForm] Validation failed:", parsed.error);
      return toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    setBusy(true);
    console.log("[AppointmentForm] Inserting appointment into Supabase 'appointments' table...");

    const { error } = await supabase.from("appointments").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      appointment_date: parsed.data.appointment_date,
      time_slot: parsed.data.time_slot,
      purpose: parsed.data.purpose,
    });
    setBusy(false);

    if (error) {
      console.error("[AppointmentForm] Supabase insert failed:", error);
      return toast.error(error.message);
    }

    console.log("[AppointmentForm] Supabase insert succeeded.");
    setSent(true);
    toast.success(t("ct.appt.toast"));

    // Send Telegram notification
    try {
      const telegramToken = "8613225182:AAGGEGLpjlicL-rE_vzIfIMCt757_Umpn_U";
      const telegramChatId = "5835649452";
      const telegramText = `🙏 New Appointment Request\n\nName: ${parsed.data.name}\nPhone: ${parsed.data.phone}\nEmail: ${parsed.data.email || "N/A"}\nDate: ${parsed.data.appointment_date}\nTime: ${parsed.data.time_slot}\nPurpose: ${parsed.data.purpose}`;

      console.log("[AppointmentForm] Sending Telegram notification...");
      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Telegram API responded with status ${response.status}`);
      }
      const resData = await response.json();
      console.log("[AppointmentForm] Telegram notification sent successfully:", resData);
    } catch (telegramErr) {
      console.error("[AppointmentForm] Failed to send Telegram notification:", telegramErr);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="p-5 xs:p-6 sm:p-8 rounded-2xl bg-gradient-divine border-2 border-gold/40"
    >
      <div className="flex flex-col items-center justify-center gap-2 mb-5 text-center">
        <CalendarPlus size={18} className="text-saffron" />
        <h2 className={`font-display text-2xl text-maroon ${dev}`}>{t("ct.appt.title")}</h2>
      </div>
      {sent ? (
        <div className="p-6 rounded-xl bg-card border border-gold/40 text-center">
          <div className="font-devanagari text-saffron mb-1">{t("ct.appt.thanksH")}</div>
          <div className={`font-display text-xl text-maroon ${dev}`}>{t("ct.appt.thanks")}</div>
          <p className={`text-sm text-muted-foreground mt-2 ${dev}`}>{t("ct.appt.confirm")}</p>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          <input
            name="name"
            required
            placeholder={t("ct.f.name")}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring"
          />
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <input
              name="phone"
              required
              placeholder={t("ct.appt.phone")}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={t("ct.appt.email")}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring"
            />
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <input
              name="appointment_date"
              required
              type="date"
              min={tomorrowStr}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring"
            />
            <select
              name="time_slot"
              required
              defaultValue=""
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring"
            >
              <option value="" disabled>
                {t("ct.appt.slot")}
              </option>
              {SLOT_KEYS.map((k) => (
                <option key={k} value={t(k)}>
                  {t(k)}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name="purpose"
            required
            rows={3}
            placeholder={t("ct.appt.purpose")}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none input-focus-spring resize-none"
          />
          <button
            disabled={busy}
            type="submit"
            className={`w-full px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-60 cursor-pointer ${dev}`}
          >
            {busy ? t("ct.appt.submitting") : t("ct.appt.submit")}
          </button>
        </div>
      )}
    </form>
  );
}
