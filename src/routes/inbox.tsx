import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useLang } from "@/i18n/LangProvider";
import { useInbox, groupMessagesByDay } from "@/lib/InboxContext";
import { CheckCheck, MessageSquare, ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { JsonLd } from "@/components/JsonLd";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Message Inbox & Announcements | Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Read all messages, announcements, and updates from Namami Vindhyavasini Sansthan.",
      },
      {
        name: "keywords",
        content:
          "Vindhyavasini announcements, temple notifications, Namami Vindhyavasini updates, Sansthan messaging, messages, inbox, विंध्यवासिनी घोषणाएं, मंदिर सूचनाएं",
      },
      {
        property: "og:title",
        content: "Message Inbox & Announcements | Namami Vindhyavasini Sansthan",
      },
      {
        property: "og:description",
        content:
          "Read all messages, announcements, and updates from Namami Vindhyavasini Sansthan.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/inbox" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Message Inbox & Announcements" },
      {
        name: "twitter:description",
        content:
          "Read all messages, announcements, and updates from Namami Vindhyavasini Sansthan.",
      },
      {
        name: "twitter:image",
        content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.namamivindhyavasini.in/inbox" }],
  }),
  component: InboxPage,
});

function InboxPage() {
  const { t, lang } = useLang();
  const { messages, loading, isUnread, markRead, markAllRead } = useInbox();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const hi = lang === "hi";

  const containerRef = useRef<HTMLDivElement>(null);

  // Group messages by calendar day
  const grouped = groupMessagesByDay(messages, lang);

  // Parse location hash to scroll to specific message
  useEffect(() => {
    if (loading || messages.length === 0) return;

    const hash = window.location.hash; // e.g. #msg-UUID
    if (hash && hash.startsWith("#msg-")) {
      const msgId = hash.slice(5);
      const element = document.getElementById(`msg-card-${msgId}`);
      if (element) {
        // Mark as read when focused
        markRead(msgId);
        // Scroll into view
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add a temporary highlight class
          element.classList.add("ring-2", "ring-saffron", "bg-saffron/5");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-saffron", "bg-saffron/5");
          }, 3000);
        }, 100);
      }
    }
  }, [loading, messages, markRead]);

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/inbox#webpage",
    url: "https://www.namamivindhyavasini.in/inbox",
    name: "Message Inbox & Announcements | Namami Vindhyavasini Sansthan",
    description:
      "Read all messages, announcements, and updates from Namami Vindhyavasini Sansthan.",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://www.namamivindhyavasini.in/#website",
      url: "https://www.namamivindhyavasini.in",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.namamivindhyavasini.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Inbox",
        item: "https://www.namamivindhyavasini.in/inbox",
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        sanskrit="॥ शुभ संदेश कल्याणम् ॥"
        title={hi ? "संदेश इनबॉक्स" : "Message Inbox"}
        subtitle={
          hi
            ? "संगठन से महत्वपूर्ण सूचनाएँ और अपडेट"
            : "Updates and notifications from the Sansthan"
        }
      />

      <section className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm text-maroon hover:text-saffron font-medium transition ${dev}`}
          >
            <ArrowLeft size={16} /> {hi ? "मुख्य पृष्ठ" : "Back to Home"}
          </Link>

          {!loading && messages.length > 0 && (
            <button
              onClick={markAllRead}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-maroon/30 text-maroon text-xs font-semibold hover:bg-maroon hover:text-cream transition ${dev}`}
            >
              <CheckCheck size={14} /> {hi ? "सभी पढ़े हुए अंकित करें" : "Mark all as read"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className={dev}>{hi ? "लोड हो रहा है…" : "Loading inbox messages…"}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center border border-border rounded-2xl bg-card">
            <MessageSquare size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className={`text-lg font-medium text-maroon ${dev}`}>
              {hi ? "कोई संदेश नहीं" : "No messages yet"}
            </h3>
            <p className={`text-sm text-muted-foreground mt-1 ${dev}`}>
              {hi
                ? "अभी आपके इनबॉक्स में कोई सूचना उपलब्ध नहीं है।"
                : "Updates from the Sansthan will appear here."}
            </p>
          </div>
        ) : (
          <div ref={containerRef} className="space-y-8">
            {[...grouped.entries()].map(([dayLabel, dayMessages]) => (
              <div key={dayLabel} className="space-y-4">
                <div
                  className={`text-xs font-bold uppercase tracking-wider text-saffron border-b border-border/80 pb-1.5 ${dev}`}
                >
                  {dayLabel}
                </div>
                <div className="space-y-4">
                  {dayMessages.map((msg) => {
                    const unread = isUnread(msg.id);
                    return (
                      <div
                        key={msg.id}
                        id={`msg-card-${msg.id}`}
                        className={`p-6 rounded-2xl border transition duration-300 ${
                          unread
                            ? "bg-saffron/15 border-saffron/60 shadow-sm"
                            : "bg-card border-border hover:border-gold/30"
                        }`}
                        onClick={() => {
                          if (unread) markRead(msg.id);
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 w-full">
                            <div className="flex items-center gap-2">
                              {unread && (
                                <span className="w-2.5 h-2.5 rounded-full bg-saffron shrink-0" />
                              )}
                              <h4 className={`font-display text-lg text-maroon ${dev}`}>
                                {msg.title}
                              </h4>
                            </div>
                            <p
                              className={`text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap ${dev}`}
                            >
                              {msg.body}
                            </p>
                            <div className="flex items-center justify-between pt-2">
                              <time className="text-xs text-muted-foreground">
                                {new Date(msg.created_at).toLocaleTimeString(
                                  hi ? "hi-IN" : "en-IN",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
