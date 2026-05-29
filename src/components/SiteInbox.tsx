import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Inbox, CheckCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLang } from "@/i18n/LangProvider";
import { groupMessagesByDay, useInbox } from "@/lib/InboxContext";

export function SiteInbox() {
  const { lang } = useLang();
  const router = useRouter();
  const { messages, unreadCount, loading, isUnread, markRead, markAllRead } = useInbox();
  const [open, setOpen] = useState(false);
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";

  const displayedMessages = messages.slice(0, 3);
  const grouped = groupMessagesByDay(displayedMessages, lang);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center justify-center w-11 h-11 lg:w-10 lg:h-10 rounded-full border border-maroon/30 text-maroon hover:bg-maroon hover:text-cream transition active:scale-95 duration-200"
          aria-label={hi ? "इनबॉक्स" : "Inbox"}
        >
          <Inbox size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-saffron text-cream text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(100vw-2rem,380px)] p-0 border-gold/30">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-gradient-divine">
          <div>
            <h3 className={`font-display text-lg text-maroon ${dev}`}>
              {hi ? "संदेश इनबॉक्स" : "Message Inbox"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {hi ? "संगठन से महत्वपूर्ण सूचनाएँ" : "Updates from the Sansthan"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-[10px] text-maroon border border-maroon/20 bg-maroon/5 hover:bg-maroon hover:text-cream px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold transition"
              title={hi ? "सभी पढ़े हुए" : "Mark all read"}
            >
              <CheckCheck size={12} />
              <span>{hi ? "सभी पढ़ें" : "Read all"}</span>
            </button>
          )}
        </div>

        <div className="max-h-[min(70vh,420px)] overflow-y-auto">
          {loading && (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {hi ? "लोड हो रहा है…" : "Loading…"}
            </p>
          )}
          {!loading && messages.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {hi ? "अभी कोई संदेश नहीं" : "No messages yet"}
            </p>
          )}
          {[...grouped.entries()].map(([dayLabel, dayMessages]) => (
            <div key={dayLabel}>
              <div
                className={`sticky top-0 z-10 px-4 py-1.5 text-[10px] uppercase tracking-wider bg-cream/95 text-saffron border-b border-border/60 ${dev}`}
              >
                {dayLabel}
              </div>
              <ul>
                {dayMessages.map((msg) => {
                  const unread = isUnread(msg.id);
                  return (
                    <li key={msg.id}>
                      <button
                        type="button"
                        className={`w-full text-left px-4 py-3 border-b border-border/40 hover:bg-cream/40 transition ${unread ? "bg-saffron/15" : ""}`}
                        onClick={() => {
                          markRead(msg.id);
                          setOpen(false);
                          void router.navigate({ to: `/inbox`, hash: `msg-${msg.id}` });
                        }}
                      >
                        <div className="flex items-start gap-2">
                          {unread && (
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-saffron shrink-0" />
                          )}
                          <div className={unread ? "" : "pl-4"}>
                            <div className={`font-medium text-sm text-maroon ${dev}`}>
                              {msg.title}
                            </div>
                            <p
                              className={`text-xs text-muted-foreground mt-0.5 line-clamp-2 ${dev}`}
                            >
                              {msg.body}
                            </p>
                            <time className="text-[10px] text-muted-foreground/80 mt-1 block">
                              {new Date(msg.created_at).toLocaleTimeString(hi ? "hi-IN" : "en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </time>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {messages.length > 0 && (
          <div className="p-3 border-t border-border bg-cream/30 text-center">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void router.navigate({ to: "/inbox" });
              }}
              className={`text-xs uppercase tracking-wider text-maroon hover:text-saffron font-bold transition ${dev}`}
            >
              {hi ? "सभी संदेश देखें" : "View All Messages"}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
