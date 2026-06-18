import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { showSiteNotification } from "@/lib/notifications";

export type InboxMessage = {
  id: string;
  title: string;
  body: string;
  url: string;
  created_at: string;
};

const READ_STORAGE_KEY = "inbox_read_message_ids";

function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids]));
}

type InboxContextValue = {
  messages: InboxMessage[];
  unreadCount: number;
  loading: boolean;
  isUnread: (id: string) => boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
  refresh: () => Promise<void>;
};

const InboxContext = createContext<InboxContextValue | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(loadReadIds);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("inbox_messages")
      .select("id, title, body, url, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setMessages(data as InboxMessage[]);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  useEffect(() => {
    const channel = supabase
      .channel("inbox-messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "inbox_messages" },
        (payload) => {
          const row = payload.new as InboxMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [row, ...prev];
          });

          showSiteNotification(
            { title: row.title, body: row.body, url: `/inbox#msg-${row.id}` },
            router,
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      for (const m of messages) next.add(m.id);
      saveReadIds(next);
      return next;
    });
  }, [messages]);

  const unreadCount = useMemo(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return messages.filter((m) => {
      if (readIds.has(m.id)) return false;
      const createdTime = new Date(m.created_at).getTime();
      return createdTime > cutoff;
    }).length;
  }, [messages, readIds]);

  const isUnread = useCallback(
    (id: string) => {
      if (readIds.has(id)) return false;
      const msg = messages.find((m) => m.id === id);
      if (!msg) return false;
      const createdTime = new Date(msg.created_at).getTime();
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      return createdTime > cutoff;
    },
    [messages, readIds],
  );

  const value = useMemo(
    () => ({
      messages,
      unreadCount,
      loading,
      isUnread,
      markRead,
      markAllRead,
      refresh,
    }),
    [messages, unreadCount, loading, isUnread, markRead, markAllRead, refresh],
  );

  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>;
}

export function useInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error("useInbox must be used within InboxProvider");
  return ctx;
}

/** Group inbox messages by calendar day label */
export function groupMessagesByDay(messages: InboxMessage[], lang: "en" | "hi") {
  const groups = new Map<string, InboxMessage[]>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const msg of messages) {
    const d = new Date(msg.created_at);
    d.setHours(0, 0, 0, 0);
    let label: string;
    if (d.getTime() === today.getTime()) {
      label = lang === "hi" ? "आज" : "Today";
    } else if (d.getTime() === yesterday.getTime()) {
      label = lang === "hi" ? "कल" : "Yesterday";
    } else {
      label = d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    const list = groups.get(label) ?? [];
    list.push(msg);
    groups.set(label, list);
  }
  return groups;
}
