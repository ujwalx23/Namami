import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState, useEffect } from "react";
import { Lock, Trash2, Plus, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const ADMIN_PASSCODE = "23rsnamamiweb&omi!";

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
type Video = {
  id: string;
  title: string;
  embed: string;
  type: "video" | "short";
  created_at?: string;
};

function AdminPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_authed") === "true";
    }
    return false;
  });
  const [pass, setPass] = useState("");
  const [activeTab, setActiveTab] = useState<
    "sandesh" | "events" | "reviews" | "appointments" | "contacts" | "videos" | "notifications"
  >("sandesh");

  const [counts, setCounts] = useState({ reviews: 0, appointments: 0, contacts: 0 });

  async function loadCounts() {
    try {
      const [rRes, aRes, cRes] = await Promise.all([
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contacts").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        reviews: rRes.count || 0,
        appointments: aRes.count || 0,
        contacts: cRes.count || 0,
      });
    } catch (e) {
      console.warn("Failed to load counts", e);
    }
  }

  useEffect(() => {
    if (authed) {
      loadCounts();
    }
  }, [authed]);

  if (!authed) {
    return (
      <PageShell>
        <PageHero title="Admin Access" subtitle="Enter the passcode to manage the website." />
        <section className="container mx-auto px-6 py-16 max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pass === ADMIN_PASSCODE) {
                setAuthed(true);
                sessionStorage.setItem("admin_authed", "true");
              } else {
                toast.error("Wrong passcode");
              }
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
    { id: "notifications", label: "Push Notification" },
  ];

  const getBadge = (tabId: typeof activeTab) => {
    return null;
  };

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
              className={`px-5 py-2.5 rounded-lg font-medium transition flex items-center ${
                activeTab === tab.id
                  ? "bg-gradient-sacred text-cream shadow-gold"
                  : "text-muted-foreground hover:bg-card"
              }`}
            >
              {tab.label}
              {getBadge(tab.id)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "sandesh" && <SandeshAdmin />}
          {activeTab === "events" && <EventAdmin />}
          {activeTab === "reviews" && <ReviewAdmin onUpdate={loadCounts} />}
          {activeTab === "appointments" && <AppointmentAdmin onUpdate={loadCounts} />}
          {activeTab === "contacts" && <ContactAdmin onUpdate={loadCounts} />}
          {activeTab === "videos" && <VideoAdmin />}
          {activeTab === "notifications" && <NotificationAdmin />}
        </div>
      </section>
    </PageShell>
  );
}

function AdminTabLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading data from database...</p>
    </div>
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
  if (!loaded) return <AdminTabLoader />;

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
  });
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const { data } = await supabase.from("events").select("*").order("event_date");
    setList((data as EventRow[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();
  if (!loaded) return <AdminTabLoader />;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.event_date || !form.location || !form.description)
      return toast.error("All fields required");
      
    const todayIso = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("events").insert({
      title: form.title,
      description: form.description,
      event_date: form.event_date,
      location: form.location,
      is_upcoming: form.event_date >= todayIso,
    });
    if (error) return toast.error(error.message);
    toast.success("Event added");
    setForm({ title: "", description: "", event_date: "", location: "" });
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
        <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-sacred text-cream text-sm">
          <Plus size={14} /> Add Event
        </button>
      </form>
      <div className="space-y-3">
        {list.map((ev) => {
          const todayIso = new Date().toISOString().slice(0, 10);
          const isUpcoming = ev.event_date >= todayIso;
          return (
            <div
              key={ev.id}
              className="p-4 rounded-xl bg-card border border-border flex justify-between gap-3"
            >
              <div>
                <div className="text-xs text-saffron uppercase tracking-wider">
                  {ev.event_date} · {isUpcoming ? "Upcoming" : "Past"}
                </div>
                <div className="font-medium text-maroon">{ev.title}</div>
                <div className="text-sm text-muted-foreground">{ev.location}</div>
              </div>
              <button onClick={() => del(ev.id)} className="text-destructive p-2">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewAdmin({ onUpdate }: { onUpdate?: () => void }) {
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
    if (onUpdate) onUpdate();
  }
  if (!loaded) return <AdminTabLoader />;

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
              </div>
              <button onClick={() => del(r.id)} className="text-destructive p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AppointmentAdmin({ onUpdate }: { onUpdate?: () => void }) {
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
    toast.success("Appointment request deleted");
    await load();
    if (onUpdate) onUpdate();
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const nextStatus = currentStatus === "approved" ? "pending" : "approved";
    console.log("[toggleStatus] Updating", id, "status to", nextStatus);
    const { data, error } = await supabase
      .from("appointments")
      .update({ status: nextStatus })
      .eq("id", id)
      .select();
    
    if (error) {
      console.error("[toggleStatus] Error:", error);
      return toast.error(error.message);
    }
    
    if (!data || data.length === 0) {
      console.warn("[toggleStatus] No rows updated. This is likely due to missing Supabase RLS UPDATE policy.");
      return toast.error("Update failed. Please run the SQL migration query in your Supabase dashboard to enable UPDATE permissions.");
    }
    
    toast.success(`Status updated to ${nextStatus}`);
    await load();
    if (onUpdate) onUpdate();
  }
  if (!loaded) return <AdminTabLoader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-2xl text-maroon">Appointment Requests</h3>
      </div>

      {list.length === 0 ? (
        <div className="p-10 rounded-2xl bg-card border border-border text-center text-muted-foreground">
          No appointments requested yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((a) => (
            <div
              key={a.id}
              className="p-6 rounded-2xl bg-card border border-border hover:border-gold/50 shadow-sm transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-maroon">{a.name}</h4>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={a.email || ""}>
                      {a.email || "No email provided"}
                    </p>
                    <p className="text-xs text-muted-foreground">{a.phone}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => toggleStatus(a.id, a.status)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                        a.status === "approved"
                          ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                          : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                      }`}
                    >
                      {a.status === "approved" ? "Approved" : "Pending"}
                    </button>
                    <button
                      onClick={() => del(a.id)}
                      className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition"
                      title="Delete request"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-border/60 my-3 pt-3 space-y-2 text-sm text-foreground/85">
                  <div className="flex flex-wrap gap-2 items-center text-xs bg-saffron/10 text-maroon px-2 py-1 rounded w-fit">
                    <span className="font-semibold">Date:</span>
                    <span>{a.appointment_date}</span>
                    <span className="text-gold/60">|</span>
                    <span className="font-semibold">Time:</span>
                    <span>{a.time_slot}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Purpose:</div>
                    <p className="text-sm bg-background/50 p-2.5 rounded-lg border border-border/40 italic whitespace-pre-wrap">
                      "{a.purpose}"
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-4 text-right">
                Requested: {new Date(a.created_at).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactAdmin({ onUpdate }: { onUpdate?: () => void }) {
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
    toast.success("Contact message deleted");
    await load();
    if (onUpdate) onUpdate();
  }
  if (!loaded) return <AdminTabLoader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-2xl text-maroon">Contact Messages</h3>
      </div>

      {list.length === 0 ? (
        <div className="p-10 rounded-2xl bg-card border border-border text-center text-muted-foreground">
          No contact messages received yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-card border border-border hover:border-gold/50 shadow-sm transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-maroon">{c.name}</h4>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={c.email}>
                      {c.email}
                    </p>
                    {c.phone && <p className="text-xs text-muted-foreground">{c.phone}</p>}
                  </div>
                  <button
                    onClick={() => del(c.id)}
                    className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition shrink-0"
                    title="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="border-t border-border/60 my-3 pt-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Message:</div>
                  <p className="text-sm bg-background/50 p-3 rounded-lg border border-border/40 text-foreground/90 whitespace-pre-wrap">
                    {c.message}
                  </p>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-4 text-right">
                Received: {new Date(c.created_at).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function extractYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  const clean = url.trim();
  if (clean.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }
  return null;
}

function VideoAdmin() {
  const [list, setList] = useState<Video[]>([]);
  const [form, setForm] = useState({ title: "", embed: "" });
  const [videoTab, setVideoTab] = useState<"video" | "short">("video");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    embed: "",
    type: "video" as "video" | "short",
  });
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("youtube_videos")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data as Video[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();
  if (!loaded) return <AdminTabLoader />;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.embed.trim())
      return toast.error("Title and video link/ID required");

    const youtubeId = extractYoutubeId(form.embed);
    if (!youtubeId) {
      return toast.error("Invalid YouTube URL or Video ID. Please enter a valid YouTube link or 11-char ID.");
    }
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;

    const { error } = await supabase.from("youtube_videos").insert({
      id: youtubeId,
      title: form.title.trim(),
      embed: embedUrl,
      type: videoTab,
    });
    if (error) return toast.error(error.message);
    toast.success(`${videoTab === "short" ? "Short" : "Video"} added successfully`);
    setForm({ title: "", embed: "" });
    await load();
  }

  async function update(id: string) {
    if (!editForm.title.trim() || !editForm.embed.trim())
      return toast.error("Title and video link/ID required");

    const youtubeId = extractYoutubeId(editForm.embed);
    if (!youtubeId) {
      return toast.error("Invalid YouTube URL or Video ID. Please enter a valid YouTube link or 11-char ID.");
    }
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;

    if (youtubeId !== id) {
      const { error: delError } = await supabase.from("youtube_videos").delete().eq("id", id);
      if (delError) return toast.error(delError.message);
      
      const { error: insError } = await supabase.from("youtube_videos").insert({
        id: youtubeId,
        title: editForm.title.trim(),
        embed: embedUrl,
        type: editForm.type,
      });
      if (insError) {
        toast.error("Failed to insert updated item: " + insError.message);
        await load();
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("youtube_videos")
        .update({
          title: editForm.title.trim(),
          embed: embedUrl,
          type: editForm.type,
        })
        .eq("id", id)
        .select();
      if (error) return toast.error(error.message);
      if (!data || data.length === 0) {
        return toast.error("Update failed. Row not found or RLS policy blocked it.");
      }
    }

    toast.success("Updated successfully");
    setEditingId(null);
    await load();
  }

  async function del(id: string) {
    const { error } = await supabase.from("youtube_videos").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted successfully");
    await load();
  }

  const filteredList = list.filter((v) => v.type === videoTab);

  return (
    <div>
      {/* Sub-Tabs for Videos and Shorts */}
      <div className="flex gap-4 border-b border-border pb-3 mb-6">
        <button
          onClick={() => {
            setVideoTab("video");
            setEditingId(null);
          }}
          className={`pb-2 px-1 font-medium border-b-2 transition ${
            videoTab === "video"
              ? "border-maroon text-maroon font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          🎥 Videos
        </button>
        <button
          onClick={() => {
            setVideoTab("short");
            setEditingId(null);
          }}
          className={`pb-2 px-1 font-medium border-b-2 transition ${
            videoTab === "short"
              ? "border-maroon text-maroon font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          📱 Shorts
        </button>
      </div>

      {/* Creation form */}
      <form onSubmit={add} className="p-5 rounded-2xl bg-card border border-border space-y-3 mb-6">
        <h4 className="font-semibold text-maroon text-sm">
          Add New {videoTab === "short" ? "Short" : "Video"}
        </h4>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder={`${videoTab === "short" ? "Short" : "Video"} title`}
          className="w-full px-4 py-2 rounded-lg border border-input bg-background"
        />
        <input
          value={form.embed}
          onChange={(e) => setForm({ ...form, embed: e.target.value })}
          placeholder={`YouTube Link or Video ID (e.g. ${
            videoTab === "short"
              ? "https://youtube.com/shorts/A8Vv3V-d7rg"
              : "https://www.youtube.com/watch?v=i3W9AOFhJAI"
          })`}
          className="w-full px-4 py-2 rounded-lg border border-input bg-background text-xs"
        />
        <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-sacred text-cream text-sm">
          <Plus size={14} /> Add {videoTab === "short" ? "Short" : "Video"}
        </button>
      </form>

      {/* Grid of items */}
      {filteredList.length === 0 ? (
        <p className="text-muted-foreground">No {videoTab === "short" ? "shorts" : "videos"} yet.</p>
      ) : (
        <div
          className={
            videoTab === "short"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          }
        >
          {filteredList.map((v) =>
            editingId === v.id ? (
              <div key={v.id} className="p-4 rounded-xl bg-card border border-border space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-maroon">Editing {v.type === "short" ? "Short" : "Video"}</div>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-sm"
                  />
                  <input
                    value={editForm.embed}
                    onChange={(e) => setEditForm({ ...editForm, embed: e.target.value })}
                    placeholder="YouTube Link or Video ID"
                    className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs"
                  />
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="radio"
                        value="video"
                        checked={editForm.type === "video"}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value as "video" | "short" })
                        }
                      />
                      Video
                    </label>
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="radio"
                        value="short"
                        checked={editForm.type === "short"}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value as "video" | "short" })
                        }
                      />
                      Short
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => update(v.id)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-700 hover:bg-green-500/30 transition text-xs font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-muted/50 text-foreground hover:bg-muted transition text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div key={v.id} className="p-4 rounded-xl bg-card border border-border space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-maroon truncate text-sm" title={v.title}>
                        {v.title}
                      </div>
                      <div className="text-[9px] text-muted-foreground truncate" title={v.embed}>
                        {v.embed}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(v.id);
                          setEditForm({
                            title: v.title,
                            embed: v.embed,
                            type: v.type as "video" | "short",
                          });
                        }}
                        className="px-2 py-1 rounded bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 transition text-[10px] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => del(v.id)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    v.type === "short" ? "aspect-[9/16] w-full" : "aspect-video w-full"
                  } bg-black rounded-lg overflow-hidden border border-border shadow-sm`}
                >
                  <iframe
                    className="w-full h-full"
                    src={v.embed}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}



function NotificationAdmin() {
  const [form, setForm] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      return toast.error("Title and message body are required");
    }
    setLoading(true);
    
    const titleText = form.title.trim();
    const bodyText = form.body.trim();

    try {
      // 1. Broadcast in Realtime (Non-blocking, runs in background to prevent websocket connection hangs)
      const channel = supabase.channel("site-notifications");
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.send({
            type: "broadcast",
            event: "notification",
            payload: {
              title: titleText,
              body: bodyText,
              url: "/",
            },
          }).then(() => {
            void supabase.removeChannel(channel);
          }).catch((err) => {
            console.error("Realtime broadcast send error:", err);
          });
        }
      });

      // 2. Invoke push-notifier edge function (for offline PWA push notifications)
      try {
        await supabase.functions.invoke("push-notifier", {
          body: {
            type: "MANUAL",
            title: titleText,
            body: bodyText,
            url: "/",
          },
        });
      } catch (pushErr) {
        console.warn("Push notification edge function failed/timed out:", pushErr);
      }

      toast.success("Notification broadcasted successfully!");
      setForm({ title: "", body: "" });
    } catch (err: any) {
      toast.error("Failed to broadcast: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-2xl text-maroon">Push Notifications</h3>
      </div>

      <form onSubmit={send} className="p-6 rounded-2xl bg-card border border-border space-y-4 max-w-2xl">
        <h4 className="font-semibold text-maroon text-sm">Send Broadcast Message</h4>
        <p className="text-xs text-muted-foreground">
          This message will be instantly sent as a popup to active website users and as a push notification to PWA installations.
        </p>
        
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Notification Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. आज का संदेश (Daily Sandesh)"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Message Body</label>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Write your push notification message details..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold disabled:opacity-50 transition"
        >
          {loading ? "Sending..." : "Broadcast Notification"}
        </button>
      </form>
    </div>
  );
}
