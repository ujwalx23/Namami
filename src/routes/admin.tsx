import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState } from "react";
import { Lock, Trash2, Plus, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

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

type Sandesh = Tables<"sandesh">;
type EventRow = Tables<"events">;
type Review = Tables<"reviews">;
type Appointment = Tables<"appointments">;
type Contact = Tables<"contacts">;
type Video = Tables<"videos"> | { id: string; title: string; embed: string; type: "video" | "short" };

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [activeTab, setActiveTab] = useState<
    "sandesh" | "events" | "reviews" | "appointments" | "contacts" | "videos"
  >("sandesh");

  if (!authed) {
    return (
      <PageShell>
        <PageHero
          title="Admin Access"
          subtitle="Enter the passcode to manage the website."
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

  const tabs: Array<{ id: typeof activeTab; label: string }> = [
    { id: "sandesh", label: "Sandesh" },
    { id: "events", label: "Events" },
    { id: "reviews", label: "Reviews" },
    { id: "appointments", label: "Appointments" },
    { id: "contacts", label: "Contacts" },
    { id: "videos", label: "Videos & Shorts" },
  ];

  return (
    <PageShell>
      <PageHero title="Admin Panel" subtitle="Manage all website content." />
      <section className="container mx-auto px-6 py-10">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? "bg-gradient-sacred text-cream shadow-gold"
                  : "text-muted-foreground hover:bg-card"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "sandesh" && <SandeshAdmin />}
          {activeTab === "events" && <EventAdmin />}
          {activeTab === "reviews" && <ReviewAdmin />}
          {activeTab === "appointments" && <AppointmentAdmin />}
          {activeTab === "contacts" && <ContactAdmin />}
          {activeTab === "videos" && <VideoAdmin />}
        </div>
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

function ReviewAdmin() {
  const [list, setList] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data as Review[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function del(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Review deleted");
    await load();
  }

  async function toggleApprove(id: string, current: boolean) {
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: !current })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(!current ? "Approved" : "Unapproved");
    await load();
  }

  return (
    <div>
      <h3 className="font-display text-2xl text-maroon mb-4">Reviews</h3>
      {list.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl bg-card border border-border flex justify-between gap-3"
            >
              <div className="flex-1">
                <div className="text-xs text-saffron uppercase tracking-wider">
                  {r.name} · {new Date(r.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm mt-1">{r.comment}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Status: {r.is_approved ? "Approved ✓" : "Pending"}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleApprove(r.id, r.is_approved)}
                  className={`p-2 rounded-lg transition ${
                    r.is_approved
                      ? "bg-green-500/20 text-green-700"
                      : "bg-yellow-500/20 text-yellow-700 hover:bg-green-500/20"
                  }`}
                  title={r.is_approved ? "Click to unapprove" : "Click to approve"}
                >
                  <Check size={16} />
                </button>
                <button onClick={() => del(r.id)} className="text-destructive p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AppointmentAdmin() {
  const [list, setList] = useState<Appointment[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false });
    setList((data as Appointment[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function del(id: string) {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Appointment deleted");
    await load();
  }

  return (
    <div>
      <h3 className="font-display text-2xl text-maroon mb-4">Appointments</h3>
      {list.length === 0 ? (
        <p className="text-muted-foreground">No appointments yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-xl bg-card border border-border flex justify-between gap-3"
            >
              <div className="flex-1">
                <div className="text-xs text-saffron uppercase tracking-wider">
                  {a.appointment_date} at {a.time_slot}
                </div>
                <div className="font-medium text-maroon">{a.name}</div>
                <div className="text-sm text-muted-foreground">
                  {a.email && `${a.email} · `}
                  {a.phone}
                </div>
                <div className="text-sm mt-2">{a.purpose}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Status: {a.status || "pending"}
                </div>
              </div>
              <button onClick={() => del(a.id)} className="text-destructive p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactAdmin() {
  const [list, setList] = useState<Contact[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data as Contact[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function del(id: string) {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Contact deleted");
    await load();
  }

  return (
    <div>
      <h3 className="font-display text-2xl text-maroon mb-4">Contact Messages</h3>
      {list.length === 0 ? (
        <p className="text-muted-foreground">No contact messages yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-card border border-border flex justify-between gap-3"
            >
              <div className="flex-1">
                <div className="text-xs text-saffron uppercase tracking-wider">
                  {c.name} · {new Date(c.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {c.email}
                  {c.phone && ` · ${c.phone}`}
                </div>
                <div className="text-sm mt-2">{c.message}</div>
              </div>
              <button onClick={() => del(c.id)} className="text-destructive p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VideoAdmin() {
  const [list, setList] = useState<Video[]>([]);
  const [form, setForm] = useState({ title: "", embed: "", type: "video" as "video" | "short" });
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data as Video[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.embed.trim())
      return toast.error("Title and embed URL required");
    const { error } = await supabase.from("videos").insert({
      title: form.title.trim(),
      embed: form.embed.trim(),
      type: form.type,
    });
    if (error) return toast.error(error.message);
    toast.success("Video added");
    setForm({ title: "", embed: "", type: "video" });
    await load();
  }

  async function del(id: string) {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Video deleted");
    await load();
  }

  return (
    <div>
      <h3 className="font-display text-2xl text-maroon mb-4">Videos & Shorts</h3>
      <form onSubmit={add} className="p-5 rounded-2xl bg-card border border-border space-y-3 mb-6">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Video title"
          className="w-full px-4 py-2 rounded-lg border border-input bg-background"
        />
        <input
          value={form.embed}
          onChange={(e) => setForm({ ...form, embed: e.target.value })}
          placeholder="YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)"
          className="w-full px-4 py-2 rounded-lg border border-input bg-background text-xs"
        />
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="video"
              checked={form.type === "video"}
              onChange={(e) => setForm({ ...form, type: e.target.value as "video" | "short" })}
            />
            Video
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="short"
              checked={form.type === "short"}
              onChange={(e) => setForm({ ...form, type: e.target.value as "video" | "short" })}
            />
            Short
          </label>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-sacred text-cream text-sm">
          <Plus size={14} /> Add Video
        </button>
      </form>
      {list.length === 0 ? (
        <p className="text-muted-foreground">No videos yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-xl bg-card border border-border flex justify-between gap-3"
            >
              <div>
                <div className="text-xs text-saffron uppercase tracking-wider">
                  {v.type === "short" ? "📱 Short" : "🎥 Video"}
                </div>
                <div className="font-medium text-maroon">{v.title}</div>
                <div className="text-xs text-muted-foreground mt-1 break-all">{v.embed}</div>
              </div>
              <button onClick={() => del(v.id)} className="text-destructive p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
