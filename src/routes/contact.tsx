import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState } from "react";
import { Phone, Mail, MapPin, CalendarPlus, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useLang } from "@/i18n/LangProvider";
import type { TKey } from "@/i18n/translations";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Appointment — Namami Vindhyavasini Sansthan" },
      { name: "description", content: "Get in touch with Namami Vindhyavasini Sansthan, or book a personal appointment with Pujya Guru Ji at Vindhyachal Dham." },
      { property: "og:title", content: "Contact Namami Vindhyavasini Sansthan" },
      { property: "og:description", content: "Reach us by phone, email or book an appointment with Guru Ji." },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(3).max(2000),
});

const apptSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  appointment_date: z.string().min(1),
  time_slot: z.string().min(1),
  purpose: z.string().trim().min(1).max(1000),
});

const SLOT_KEYS: TKey[] = ["ct.slot.morning", "ct.slot.late", "ct.slot.noon", "ct.slot.evening"];

function ContactPage() {
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  return (
    <PageShell>
      <PageHero
        sanskrit={t("ct.sanskrit")}
        title={t("ct.title")}
        subtitle={t("ct.subtitle")}
      />

      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="space-y-5 mb-10">
            {[
              { icon: MapPin, label: t("ct.visit"), value: t("ct.address"), href: "" },
              { icon: Phone, label: t("ct.call"), value: "+91 93343 39505", href: "tel:+919334339505" },
              { icon: Mail, label: t("ct.email"), value: "info@namamivindhyavasini.org", href: "mailto:info@namamivindhyavasini.org" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
                <div className="w-11 h-11 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream shrink-0">
                  <c.icon size={18} />
                </div>
                <div>
                  <div className={`text-xs uppercase tracking-[0.2em] text-saffron ${dev}`}>{c.label}</div>
                  <div className={`font-medium text-maroon mt-0.5 ${dev}`}>
                    {c.href ? <a href={c.href} className="hover:text-saffron">{c.value}</a> : c.value}
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

        <div className="space-y-8">
          <ContactForm />
          <AppointmentForm />
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

      // Open a blank window synchronously inside the user gesture to avoid popup blockers
      console.log("[ContactForm] Opening blank window for WhatsApp to prevent popup blocker...");
      const whatsappWindow = window.open("", "_blank");

      setBusy(true);
      console.log("[ContactForm] Inserting message into Supabase 'contacts' table...");

      const { error } = await supabase.from("contacts").insert(parsed.data);
      setBusy(false);

      if (error) {
        console.error("[ContactForm] Supabase insert failed:", error);
        if (whatsappWindow) {
          console.log("[ContactForm] Closing WhatsApp blank window due to insert failure.");
          whatsappWindow.close();
        }
        return toast.error(error.message);
      }

      console.log("[ContactForm] Supabase insert succeeded. Redirecting to WhatsApp...");
      
      const name = parsed.data.name;
      const email = parsed.data.email;
      const phone = parsed.data.phone || "N/A";
      const message = parsed.data.message;

      const messageText = `Hello, I contacted you from the website.

Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`;

      const whatsappUrl = `https://wa.me/917977339435?text=${encodeURIComponent(messageText)}`;

      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
        console.log("[ContactForm] Successfully redirected window to WhatsApp:", whatsappUrl);
      } else {
        console.warn("[ContactForm] WhatsApp window was not created beforehand, trying window.open now...");
        window.open(whatsappUrl, "_blank");
      }

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
            text: telegramText
          })
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
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-8 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-2 mb-5">
        <Send size={18} className="text-saffron" />
        <h2 className={`font-display text-2xl text-maroon ${dev}`}>{t("ct.send.title")}</h2>
      </div>
      {sent ? (
        <div className="p-6 rounded-xl bg-gradient-divine border border-gold/40 text-center">
          <div className="font-devanagari text-saffron mb-1">{t("ct.f.thanksH")}</div>
          <div className={`font-display text-xl text-maroon ${dev}`}>{t("ct.f.thanks")}</div>
        </div>
      ) : (
        <div className="space-y-3">
          <input name="name" required placeholder={t("ct.f.name")} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
          <input name="email" required type="email" placeholder={t("ct.f.email")} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
          <input name="phone" placeholder={t("ct.f.phone")} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
          <textarea name="message" required rows={4} placeholder={t("ct.f.msg")} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold resize-none" />
          <button disabled={busy} type="submit" className={`w-full px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 transition disabled:opacity-60 ${dev}`}>
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
  const today = new Date().toISOString().split("T")[0];

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
          text: telegramText
        })
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
    <form onSubmit={onSubmit} className="p-8 rounded-2xl bg-gradient-divine border-2 border-gold/40">
      <div className="flex items-center gap-2 mb-5">
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
        <div className="space-y-3">
          <input name="name" required placeholder={t("ct.f.name")} className="w-full px-4 py-3 rounded-lg border border-input bg-background" />
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="phone" required placeholder={t("ct.appt.phone")} className="w-full px-4 py-3 rounded-lg border border-input bg-background" />
            <input name="email" type="email" placeholder={t("ct.appt.email")} className="w-full px-4 py-3 rounded-lg border border-input bg-background" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="appointment_date" required type="date" min={today} className="w-full px-4 py-3 rounded-lg border border-input bg-background" />
            <select name="time_slot" required defaultValue="" className="w-full px-4 py-3 rounded-lg border border-input bg-background">
              <option value="" disabled>{t("ct.appt.slot")}</option>
              {SLOT_KEYS.map((k) => <option key={k} value={t(k)}>{t(k)}</option>)}
            </select>
          </div>
          <textarea name="purpose" required rows={3} placeholder={t("ct.appt.purpose")} className="w-full px-4 py-3 rounded-lg border border-input bg-background resize-none" />
          <button disabled={busy} type="submit" className={`w-full px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold disabled:opacity-60 ${dev}`}>
            {busy ? t("ct.appt.submitting") : t("ct.appt.submit")}
          </button>
        </div>
      )}
    </form>
  );
}
