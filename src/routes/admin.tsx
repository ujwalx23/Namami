import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState } from "react";
import { Lock, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_PASSCODE = "vindhyavasini2026";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Namami Vindhyavasini" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Sandesh = { id: string; message: string; author: string; publish_date: string };
type EventRow = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  is_upcoming: boolean;
};

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");

  if (!authed) {
    return (
      <PageShell>
        <PageHero
          title="Admin Access"
          subtitle="Enter the passcode to manage Sandesh and Events."
        />
        <section className="container mx-auto px-6 py-16 max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pass === ADMIN_PASSCODE) setAuthed(true);
              else toast.error("Wrong passcode");
            }}
            className="p-8 rounded-2xl bg-card border border-border space-y-4"
          >
            <div className="flex items-center gap-2 text-maroon">
              <Lock size={18} /> <span className="font-medium">Passcode</span>
            </div>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Enter admin passcode"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button className="w-full px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold">
              Unlock
            </button>
          </form>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero title="Admin Panel" subtitle="Add or remove Sandesh quotes and Events." />
      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10">
        <SandeshAdmin />
        <EventAdmin />
      </section>
    </PageShell>
  );
}

function SandeshAdmin() {
  const [list, setList] = useState<Sandesh[]>([]);
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("Pujya Guru Ji");
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("sandesh")
      .select("*")
      .order("publish_date", { ascending: false });
    setList((data as Sandesh[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    const { error } = await supabase
      .from("sandesh")
      .insert({ message: message.trim(), author: author.trim() || "Pujya Guru Ji" });
    if (error) return toast.error(error.message);
    toast.success("Sandesh added");
    setMessage("");
    await load();
  }

  async function del(id: string) {
    const { error } = await supabase.from("sandesh").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await load();
  }

  return (
    <div>
      <h3 className="font-display text-2xl text-maroon mb-4">Sandesh / Quotes</h3>
      <form onSubmit={add} className="p-5 rounded-2xl bg-card border border-border space-y-3 mb-6">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Quote / sandesh message"
          className="w-full px-4 py-3 rounded-lg border border-input bg-background"
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="w-full px-4 py-3 rounded-lg border border-input bg-background"
        />
        <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-sacred text-cream text-sm">
          <Plus size={14} /> Add Sandesh
        </button>
      </form>
      <div className="space-y-3">
        {list.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-card border border-border flex justify-between gap-3"
          >
            <div>
              <div className="text-xs text-saffron uppercase tracking-wider">{s.publish_date}</div>
              <div className="text-sm">{s.message}</div>
            </div>
            <button onClick={() => del(s.id)} className="text-destructive p-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventAdmin() {
  const [list, setList] = useState<EventRow[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    is_upcoming: true,
  });
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const { data } = await supabase.from("events").select("*").order("event_date");
    setList((data as EventRow[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.event_date || !form.location || !form.description)
      return toast.error("All fields required");
    const { error } = await supabase.from("events").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Event added");
    setForm({ title: "", description: "", event_date: "", location: "", is_upcoming: true });
    await load();
  }

  async function del(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await load();
  }

  return (
    <div>
      <h3 className="font-display text-2xl text-maroon mb-4">Events</h3>
      <form onSubmit={add} className="p-5 rounded-2xl bg-card border border-border space-y-3 mb-6">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full px-4 py-2 rounded-lg border border-input bg-background"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          rows={2}
          className="w-full px-4 py-2 rounded-lg border border-input bg-background"
        />
        <input
          type="date"
          value={form.event_date}
          onChange={(e) => setForm({ ...form, event_date: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-input bg-background"
        />
        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Location"
          className="w-full px-4 py-2 rounded-lg border border-input bg-background"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_upcoming}
            onChange={(e) => setForm({ ...form, is_upcoming: e.target.checked })}
          />
          Upcoming
        </label>
        <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-sacred text-cream text-sm">
          <Plus size={14} /> Add Event
        </button>
      </form>
      <div className="space-y-3">
        {list.map((ev) => (
          <div
            key={ev.id}
            className="p-4 rounded-xl bg-card border border-border flex justify-between gap-3"
          >
            <div>
              <div className="text-xs text-saffron uppercase tracking-wider">
                {ev.event_date} · {ev.is_upcoming ? "Upcoming" : "Past"}
              </div>
              <div className="font-medium text-maroon">{ev.title}</div>
              <div className="text-sm text-muted-foreground">{ev.location}</div>
            </div>
            <button onClick={() => del(ev.id)} className="text-destructive p-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
