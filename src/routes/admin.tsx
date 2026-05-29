import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState, useEffect } from "react";
import {
  Lock,
  Trash2,
  Plus,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  Video,
  Inbox,
  Image,
  Edit3,
  Eye,
  EyeOff,
  Activity,
  RotateCw,
  MapPin,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

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
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<
    | "sandesh"
    | "events"
    | "reviews"
    | "appointments"
    | "contacts"
    | "videos"
    | "notifications"
    | "gallery"
    | "analytics"
  >("sandesh");

  const [counts, setCounts] = useState({ reviews: 0, appointments: 0, contacts: 0 });

  async function loadCounts() {
    try {
      const [rRes, aRes, cRes] = await Promise.all([
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadCounts();
    }
  }, [session]);

  if (loadingSession) {
    return (
      <PageShell>
        <PageHero title="Admin Access" subtitle="Verifying authentication session..." />
        <div className="container mx-auto px-6 py-20 flex justify-center">
          <AdminTabLoader />
        </div>
      </PageShell>
    );
  }

  if (!session) {
    async function handleLogin(e: React.FormEvent) {
      e.preventDefault();
      if (!email.trim() || !password.trim()) {
        return toast.error("Please enter email and password");
      }
      setLoggingIn(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      setLoggingIn(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back, Administrator!");
      }
    }

    return (
      <PageShell>
        <PageHero title="Admin Login" subtitle="Sign in to manage the website content." />
        <section className="container mx-auto px-6 py-16 max-w-md">
          <form
            onSubmit={handleLogin}
            className="p-8 rounded-2xl bg-card border border-border space-y-4 shadow-sacred animate-fade-in"
          >
            <div className="flex items-center gap-2 text-maroon mb-2 justify-center">
              <Lock size={20} className="text-saffron animate-pulse" />
              <h3 className="font-display text-2xl font-semibold">Admin Credentials</h3>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@namamivindhyavasini.org"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-11 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1.5 rounded-md hover:bg-muted/15 text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              disabled={loggingIn}
              className="w-full px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loggingIn ? "Signing In..." : "Sign In"}
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
    { id: "notifications", label: "Inbox Broadcast" },
    { id: "gallery", label: "Gallery Manager" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <PageShell>
      <PageHero title="Admin Panel" subtitle="Manage all website content." />
      <section className="container mx-auto px-6 py-10">
        {/* Admin Meta Header with Session details and Sign Out */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 mb-8 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider truncate">
              Session active &middot; {session?.user?.email || "Administrator"}
            </span>
          </div>
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                toast.error(error.message);
              } else {
                toast.success("Signed out successfully");
              }
            }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold border border-destructive/30 text-destructive bg-destructive/5 hover:bg-destructive/10 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-auto shrink-0 animate-fade-in"
          >
            Sign Out
          </button>
        </div>

        {/* Tab Navigation (3-Column Grid on Mobile, Flex Wrap on Desktop) */}
        <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-wrap mb-8 border-b border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full lg:w-auto px-2 py-2 lg:px-5 lg:py-2.5 rounded-lg font-medium text-[11px] sm:text-xs lg:text-sm transition flex items-center justify-center text-center leading-tight shrink-0 lg:shrink cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gradient-sacred text-cream shadow-gold font-semibold"
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
          {activeTab === "reviews" && <ReviewAdmin onUpdate={loadCounts} />}
          {activeTab === "appointments" && <AppointmentAdmin onUpdate={loadCounts} />}
          {activeTab === "contacts" && <ContactAdmin onUpdate={loadCounts} />}
          {activeTab === "videos" && <VideoAdmin />}
          {activeTab === "notifications" && <NotificationAdmin />}
          {activeTab === "gallery" && <GalleryAdmin />}
          {activeTab === "analytics" && <AnalyticsAdmin />}
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("sandesh")
      .select("*")
      .order("publish_date", { ascending: false });
    setList((data as Sandesh[]) ?? []);
    setLoaded(true);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setTimeout(() => setRefreshing(false), 600);
  }

  if (!loaded) load();
  if (!loaded) return <AdminTabLoader />;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    if (editingId) {
      const { data, error } = await supabase
        .from("sandesh")
        .update({ message: message.trim(), author: author.trim() || "Pujya Guru Ji" })
        .eq("id", editingId)
        .select();
      if (error) return toast.error(error.message);
      if (!data || data.length === 0) {
        return toast.error(
          "Update failed. Row not found or RLS policy blocked the update. Run migration/SQL query in Supabase dashboard to enable UPDATE permissions.",
        );
      }
      toast.success("Sandesh updated");
      setEditingId(null);
    } else {
      const { error } = await supabase
        .from("sandesh")
        .insert({ message: message.trim(), author: author.trim() || "Pujya Guru Ji" });
      if (error) return toast.error(error.message);
      toast.success("Sandesh added");
    }
    setMessage("");
    setAuthor("Pujya Guru Ji");
    await load();
  }

  async function del(id: string) {
    const { error } = await supabase.from("sandesh").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    if (editingId === id) {
      setEditingId(null);
      setMessage("");
      setAuthor("Pujya Guru Ji");
    }
    await load();
  }

  function startEdit(item: Sandesh) {
    setEditingId(item.id);
    setMessage(item.message);
    setAuthor(item.author);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-2xl text-maroon mb-0">
          {editingId ? "Edit Sandesh / Quote" : "Sandesh / Quotes"}
        </h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-1.5 rounded-full border border-gold/45 text-maroon text-xs font-medium hover:bg-cream/50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 active:scale-95"
        >
          <RotateCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>
      <form onSubmit={save} className="p-5 rounded-2xl bg-card border border-border space-y-3 mb-6">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Quote / sandesh message"
          className="w-full px-4 py-3 rounded-lg border border-input bg-background"
          required
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="w-full px-4 py-3 rounded-lg border border-input bg-background"
        />
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-sacred text-cream text-sm font-medium transition">
            {editingId ? "Update Sandesh" : "Add Sandesh"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setMessage("");
                setAuthor("Pujya Guru Ji");
              }}
              className="px-5 py-2 rounded-full border border-border text-muted-foreground text-sm font-medium transition hover:bg-muted/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="space-y-3">
        {list.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-card border border-border flex justify-between items-center gap-3"
          >
            <div>
              <div className="text-xs text-saffron uppercase tracking-wider mb-1">
                {s.publish_date} &middot; {s.author}
              </div>
              <div className="text-sm">{s.message}</div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => startEdit(s)}
                className="text-saffron p-2 hover:bg-saffron/5 rounded transition"
                aria-label="Edit sandesh"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => del(s.id)}
                className="text-destructive p-2 hover:bg-destructive/5 rounded transition"
                aria-label="Delete sandesh"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventAdmin() {
  const [list, setList] = useState<EventRow[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate local today date string
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayIso = `${year}-${month}-${day}`;

  async function load() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    setList((data as EventRow[]) ?? []);
    setLoaded(true);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setTimeout(() => setRefreshing(false), 600);
  }

  if (!loaded) load();
  if (!loaded) return <AdminTabLoader />;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !eventDate.trim() || !location.trim() || !description.trim()) {
      return toast.error("All fields are required");
    }
    const payload = {
      title: title.trim(),
      description: description.trim(),
      event_date: eventDate.trim(),
      location: location.trim(),
      is_upcoming: eventDate.trim() >= todayIso,
    };
    if (editingId) {
      const { data, error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", editingId)
        .select();
      if (error) return toast.error(error.message);
      if (!data || data.length === 0) {
        return toast.error(
          "Update failed. Row not found or RLS policy blocked the update. Run migration/SQL query in Supabase dashboard to enable UPDATE permissions.",
        );
      }
      toast.success("Event updated");
      setEditingId(null);
    } else {
      const { error } = await supabase.from("events").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Event added");
    }
    setTitle("");
    setDescription("");
    setEventDate("");
    setLocation("");
    await load();
  }

  async function del(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setDescription("");
      setEventDate("");
      setLocation("");
    }
    await load();
  }

  function startEdit(ev: EventRow) {
    setEditingId(ev.id);
    setTitle(ev.title);
    setDescription(ev.description);
    setEventDate(ev.event_date);
    setLocation(ev.location);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-2xl text-maroon mb-0">
          {editingId ? "Edit Event" : "Events Manager"}
        </h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-1.5 rounded-full border border-gold/45 text-maroon text-xs font-medium hover:bg-cream/50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 active:scale-95"
        >
          <RotateCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <form onSubmit={save} className="p-5 rounded-2xl bg-card border border-border space-y-3 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          className="w-full px-4 py-2.5 rounded-lg border border-input bg-background"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={2}
          className="w-full px-4 py-2.5 rounded-lg border border-input bg-background"
          required
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background"
            required
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background"
            required
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-sacred text-cream text-sm font-medium transition shadow-gold hover:opacity-95 cursor-pointer">
            {editingId ? "Update Event" : "Add Event"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setDescription("");
                setEventDate("");
                setLocation("");
              }}
              className="px-5 py-2 rounded-full border border-border text-muted-foreground text-sm font-medium transition hover:bg-muted/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {list.map((ev) => {
          const isLive = ev.event_date === todayIso;
          const isFuture = ev.event_date > todayIso;

          return (
            <div
              key={ev.id}
              className="p-4 rounded-xl bg-card border border-border flex justify-between items-center gap-3"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-semibold text-saffron bg-saffron/10 px-2 py-0.5 rounded">
                    {ev.event_date}
                  </span>

                  {isLive ? (
                    <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-600 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                      </span>
                      LIVE
                    </span>
                  ) : isFuture ? (
                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Upcoming
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-muted/40 text-muted-foreground border border-border px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Past
                    </span>
                  )}
                </div>
                <div className="font-semibold text-maroon text-sm">{ev.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <MapPin size={10} className="text-gold" /> {ev.location}
                </div>
                <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{ev.description}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => startEdit(ev)}
                  className="text-saffron p-2 hover:bg-saffron/5 rounded transition"
                  aria-label="Edit event"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => del(ev.id)}
                  className="text-destructive p-2 hover:bg-destructive/5 rounded transition"
                  aria-label="Delete event"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data as Review[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setTimeout(() => setRefreshing(false), 600);
  }

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
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-2xl text-maroon mb-0">Reviews</h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-1.5 rounded-full border border-gold/45 text-maroon text-xs font-medium hover:bg-cream/50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 active:scale-95"
        >
          <RotateCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>
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
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false });
    setList((data as Appointment[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setTimeout(() => setRefreshing(false), 600);
  }

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
      console.warn(
        "[toggleStatus] No rows updated. This is likely due to missing Supabase RLS UPDATE policy.",
      );
      return toast.error(
        "Update failed. Please run the SQL migration query in your Supabase dashboard to enable UPDATE permissions.",
      );
    }

    toast.success(`Status updated to ${nextStatus}`);
    await load();
    if (onUpdate) onUpdate();
  }
  if (!loaded) return <AdminTabLoader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-2xl text-maroon mb-0">Appointment Requests</h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-1.5 rounded-full border border-gold/45 text-maroon text-xs font-medium hover:bg-cream/50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 active:scale-95"
        >
          <RotateCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
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
                    <p
                      className="text-xs text-muted-foreground truncate max-w-[200px]"
                      title={a.email || ""}
                    >
                      {a.email || "No email provided"}
                    </p>
                    <p className="text-xs text-muted-foreground">{a.phone}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
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
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                      Purpose:
                    </div>
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
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data as Contact[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setTimeout(() => setRefreshing(false), 600);
  }

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
        <h3 className="font-display text-2xl text-maroon mb-0">Contact Messages</h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-1.5 rounded-full border border-gold/45 text-maroon text-xs font-medium hover:bg-cream/50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 active:scale-95"
        >
          <RotateCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
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
                    <p
                      className="text-xs text-muted-foreground truncate max-w-[200px]"
                      title={c.email}
                    >
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
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Message:
                  </div>
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
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("youtube_videos")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data as Video[]) ?? []);
    setLoaded(true);
  }
  if (!loaded) load();

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setTimeout(() => setRefreshing(false), 600);
  }
  if (!loaded) return <AdminTabLoader />;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.embed.trim())
      return toast.error("Title and video link/ID required");

    const isShortsLink = form.embed.toLowerCase().includes("shorts");
    if (videoTab === "short" && !isShortsLink) {
      return toast.error(
        "Only YouTube Shorts links (containing 'shorts') are allowed in this section.",
      );
    }
    if (videoTab === "video" && isShortsLink) {
      return toast.error(
        "YouTube Shorts links must be added under the Shorts tab, not the Videos section.",
      );
    }

    const youtubeId = extractYoutubeId(form.embed);
    if (!youtubeId) {
      return toast.error(
        "Invalid YouTube URL or Video ID. Please enter a valid YouTube link or 11-char ID.",
      );
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

    const isShortsLink = editForm.embed.toLowerCase().includes("shorts");
    if (editForm.type === "short" && !isShortsLink) {
      return toast.error(
        "Only YouTube Shorts links (containing 'shorts') are allowed in this section.",
      );
    }
    if (editForm.type === "video" && isShortsLink) {
      return toast.error(
        "YouTube Shorts links must be added under the Shorts tab, not the Videos section.",
      );
    }

    const youtubeId = extractYoutubeId(editForm.embed);
    if (!youtubeId) {
      return toast.error(
        "Invalid YouTube URL or Video ID. Please enter a valid YouTube link or 11-char ID.",
      );
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
      <div className="flex justify-between items-center border-b border-border pb-3 mb-6">
        <div className="flex gap-4">
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
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-1.5 rounded-full border border-gold/45 text-maroon text-xs font-medium hover:bg-cream/50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 active:scale-95"
        >
          <RotateCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
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
        <p className="text-muted-foreground">
          No {videoTab === "short" ? "shorts" : "videos"} yet.
        </p>
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
              <div
                key={v.id}
                className="p-4 rounded-xl bg-card border border-border space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-maroon">
                    Editing {v.type === "short" ? "Short" : "Video"}
                  </div>
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
              <div
                key={v.id}
                className="p-4 rounded-xl bg-card border border-border space-y-3 flex flex-col justify-between"
              >
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

type InboxRow = {
  id: string;
  title: string;
  body: string;
  url: string;
  created_at: string;
};

function NotificationAdmin() {
  const [form, setForm] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<InboxRow[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadHistory() {
    const { data, error } = await supabase
      .from("inbox_messages")
      .select("id, title, body, url, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    if (!error && data) setHistory(data as InboxRow[]);
    setHistoryLoaded(true);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadHistory();
    setTimeout(() => setRefreshing(false), 600);
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      return toast.error("Title and message body are required");
    }
    setLoading(true);

    const titleText = form.title.trim();
    const bodyText = form.body.trim();

    try {
      if (editingId) {
        const { data, error: updateError } = await supabase
          .from("inbox_messages")
          .update({
            title: titleText,
            body: bodyText,
          })
          .eq("id", editingId)
          .select();

        if (updateError) {
          toast.error("Could not update: " + updateError.message);
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          toast.error(
            "Update failed. Row not found or RLS policy blocked the update. Run migration/SQL query in Supabase dashboard to enable UPDATE permissions.",
          );
          setLoading(false);
          return;
        }

        toast.success("Message updated!");
        setEditingId(null);
      } else {
        const { error: insertError } = await supabase.from("inbox_messages").insert({
          title: titleText,
          body: bodyText,
          url: "/",
        });

        if (insertError) {
          toast.error(
            "Could not send: " +
              insertError.message +
              ". Run migration 20260528200000_inbox_messages.sql in Supabase SQL Editor.",
          );
          setLoading(false);
          return;
        }

        toast.success("Message sent!");
      }
      setForm({ title: "", body: "" });
      await loadHistory();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to save: " + message);
    } finally {
      setLoading(false);
    }
  }

  async function delMessage(id: string) {
    const { error } = await supabase.from("inbox_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Message removed from inbox");
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: "", body: "" });
    }
    await loadHistory();
  }

  function startEdit(item: InboxRow) {
    setEditingId(item.id);
    setForm({ title: item.title, body: item.body });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const historyByDay = new Map<string, InboxRow[]>();
  for (const row of history) {
    const day = new Date(row.created_at).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const list = historyByDay.get(day) ?? [];
    list.push(row);
    historyByDay.set(day, list);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-2xl text-maroon flex items-center gap-2 mb-0">
          <Inbox size={22} /> Site Inbox Broadcast
        </h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-1.5 rounded-full border border-gold/45 text-maroon text-xs font-medium hover:bg-cream/50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 active:scale-95"
        >
          <RotateCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <form
        onSubmit={send}
        className="p-6 rounded-2xl bg-card border border-border space-y-4 max-w-2xl"
      >
        <h4 className="font-semibold text-maroon text-sm">
          {editingId ? "Edit inbox message" : "New inbox message"}
        </h4>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            Notification Title
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. आज का संदेश (Daily Sandesh)"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            Message Body
          </label>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Write your push notification message details..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : editingId ? "Update message" : "Send to inbox"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ title: "", body: "" });
              }}
              className="px-6 py-3 rounded-full border border-border text-muted-foreground font-medium transition hover:bg-muted/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h4 className="font-semibold text-maroon mb-4">Sent messages (by day)</h4>
        {!historyLoaded ? (
          <AdminTabLoader />
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inbox messages yet.</p>
        ) : (
          <div className="space-y-6 max-w-2xl">
            {[...historyByDay.entries()].map(([day, rows]) => (
              <div key={day}>
                <div className="text-xs uppercase tracking-wider text-saffron mb-2">{day}</div>
                <div className="space-y-2">
                  {rows.map((row) => (
                    <div
                      key={row.id}
                      className="p-4 rounded-xl bg-card border border-border flex justify-between gap-3"
                    >
                      <div>
                        <div className="font-medium text-maroon">{row.title}</div>
                        <p className="text-sm text-muted-foreground mt-1">{row.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(row.created_at).toLocaleTimeString("en-IN")}
                        </p>
                      </div>
                      <div className="flex gap-1 items-start">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="text-saffron p-2 hover:bg-saffron/5 rounded transition"
                          aria-label="Edit message"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void delMessage(row.id)}
                          className="text-destructive p-2 hover:bg-destructive/5 rounded transition"
                          aria-label="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type DayActivity = {
  date: string;
  label: string;
  reviews: number;
  contacts: number;
  appointments: number;
  sandesh: number;
  videos: number;
  shorts: number;
  events: number;
  inbox: number;
};

type AnalyticsSnapshot = {
  sandesh: number;
  eventsTotal: number;
  eventsUpcoming: number;
  reviews: number;
  appointmentsTotal: number;
  appointmentsPending: number;
  contacts: number;
  videos: number;
  shorts: number;
  gallery: number;
  inboxTotal: number;
  dailyActivity: DayActivity[];
};

function buildDailyActivity(
  reviews: { created_at: string }[],
  contacts: { created_at: string }[],
  appointments: { created_at: string }[],
  sandesh: { created_at: string }[],
  videos: { created_at: string; type: string }[],
  events: { created_at: string }[],
  inbox: { created_at: string }[],
): DayActivity[] {
  const days: DayActivity[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const iso = d.toISOString().slice(0, 10);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const inDay = (ts: string) => {
      const t = new Date(ts).getTime();
      return t >= d.getTime() && t < next.getTime();
    };
    days.push({
      date: iso,
      label: d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      reviews: reviews.filter((r) => inDay(r.created_at)).length,
      contacts: contacts.filter((c) => inDay(c.created_at)).length,
      appointments: appointments.filter((a) => inDay(a.created_at)).length,
      sandesh: sandesh.filter((s) => inDay(s.created_at)).length,
      videos: videos.filter((v) => v.type === "video" && inDay(v.created_at)).length,
      shorts: videos.filter((v) => v.type === "short" && inDay(v.created_at)).length,
      events: events.filter((e) => inDay(e.created_at)).length,
      inbox: inbox.filter((inb) => inDay(inb.created_at)).length,
    });
  }
  return days;
}

function formatAnalyticsCount(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  if (num < 1000000) {
    const val = num / 1000;
    let str = val < 10 ? val.toFixed(2) : val.toFixed(1);
    if (str.includes(".")) {
      str = str.replace(/0+$/, "").replace(/\.$/, "");
    }
    return str + "k";
  }
  const val = num / 1000000;
  let str = val < 10 ? val.toFixed(2) : val.toFixed(1);
  if (str.includes(".")) {
    str = str.replace(/0+$/, "").replace(/\.$/, "");
  }
  return str + "M";
}

function AnalyticsAdmin() {
  const [data, setData] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setTimeout(() => setRefreshing(false), 600);
  }

  // Realtime updates for live visitors and page views
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const { count, error } = await supabase
          .from("visitor_heartbeats" as any)
          .select("session_id", { count: "exact", head: true })
          .gte("last_seen", twoMinAgo);
        if (error) {
          console.error("[Live Visitors] Fetch failed:", error);
        } else if (count !== null) {
          console.log("[Live Visitors] Fetched count:", count);
          setLiveCount(count);
        }
      } catch (err) {
        console.error("[Live Visitors] Fetch exception:", err);
      }
    };

    void fetchLive();

    console.log("[Realtime] Setting up subscriptions...");

    // Subscribe to postgres changes for visitor_heartbeats (live count updates)
    const heartbeatChannel = supabase
      .channel("admin-heartbeats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "visitor_heartbeats" },
        (payload) => {
          console.log("[Realtime] Heartbeat change detected:", payload);
          void fetchLive();
        },
      )
      .subscribe((status) => {
        console.log("[Realtime] Heartbeat channel status:", status);
      });

    // Fallback interval check to prune expired sessions (every 15 seconds)
    const iv = setInterval(() => {
      console.log("[Fallback] Polling live visitors...");
      void fetchLive();
    }, 15_000);

    return () => {
      console.log("[Realtime] Unsubscribing channels...");
      void heartbeatChannel.unsubscribe();
      clearInterval(iv);
    };
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    const today = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const [
        sandeshRes,
        eventsTotalRes,
        eventsUpcomingRes,
        reviewsRes,
        appointmentsTotalRes,
        appointmentsPendingRes,
        contactsRes,
        videosRes,
        shortsRes,
        galleryRes,
        inboxTotalRes,
        reviewsDailyRes,
        contactsDailyRes,
        appointmentsDailyRes,
        sandeshDailyRes,
        videosDailyRes,
        eventsDailyRes,
        inboxDailyRes,
      ] = await Promise.all([
        supabase.from("sandesh").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase
          .from("events")
          .select("id", { count: "exact", head: true })
          .gte("event_date", today),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }),
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("contacts").select("id", { count: "exact", head: true }),
        supabase
          .from("youtube_videos")
          .select("id", { count: "exact", head: true })
          .eq("type", "video"),
        supabase
          .from("youtube_videos")
          .select("id", { count: "exact", head: true })
          .eq("type", "short"),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase.from("inbox_messages").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("created_at").gte("created_at", sevenDaysAgo),
        supabase.from("contacts").select("created_at").gte("created_at", sevenDaysAgo),
        supabase.from("appointments").select("created_at").gte("created_at", sevenDaysAgo),
        supabase.from("sandesh").select("created_at").gte("created_at", sevenDaysAgo),
        supabase.from("youtube_videos").select("created_at, type").gte("created_at", sevenDaysAgo),
        supabase.from("events").select("created_at").gte("created_at", sevenDaysAgo),
        supabase.from("inbox_messages").select("created_at").gte("created_at", sevenDaysAgo),
      ]);

      const firstError =
        sandeshRes.error ||
        eventsTotalRes.error ||
        reviewsRes.error ||
        appointmentsTotalRes.error ||
        contactsRes.error ||
        videosRes.error ||
        shortsRes.error;

      if (firstError) {
        throw new Error(firstError.message);
      }

      const dailyActivity = buildDailyActivity(
        reviewsDailyRes.data ?? [],
        contactsDailyRes.data ?? [],
        appointmentsDailyRes.data ?? [],
        sandeshDailyRes.data ?? [],
        (videosDailyRes.data as { created_at: string; type: string }[]) ?? [],
        eventsDailyRes.data ?? [],
        inboxDailyRes.data ?? [],
      );

      setData({
        sandesh: sandeshRes.count ?? 0,
        eventsTotal: eventsTotalRes.count ?? 0,
        eventsUpcoming: eventsUpcomingRes.count ?? 0,
        reviews: reviewsRes.count ?? 0,
        appointmentsTotal: appointmentsTotalRes.count ?? 0,
        appointmentsPending: appointmentsPendingRes.count ?? 0,
        contacts: contactsRes.count ?? 0,
        videos: videosRes.count ?? 0,
        shorts: shortsRes.count ?? 0,
        gallery: galleryRes.error ? 0 : (galleryRes.count ?? 0),
        inboxTotal: inboxTotalRes.error ? 0 : (inboxTotalRes.count ?? 0),
        dailyActivity,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load analytics";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (loading) return <AdminTabLoader />;

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-3">
        <p className="text-destructive">{error ?? "Could not load analytics"}</p>
        <button
          onClick={() => void load()}
          className="px-5 py-2 rounded-full bg-gradient-sacred text-cream text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const last7Totals = data.dailyActivity.reduce(
    (acc, d) => ({
      reviews: acc.reviews + d.reviews,
      contacts: acc.contacts + d.contacts,
      appointments: acc.appointments + d.appointments,
      sandesh: acc.sandesh + d.sandesh,
      videos: acc.videos + d.videos,
      shorts: acc.shorts + d.shorts,
      events: acc.events + d.events,
      inbox: acc.inbox + d.inbox,
    }),
    {
      reviews: 0,
      contacts: 0,
      appointments: 0,
      sandesh: 0,
      videos: 0,
      shorts: 0,
      events: 0,
      inbox: 0,
    },
  );

  const statCards = [
    {
      icon: Activity,
      label: "Live Visitors (online)",
      value: formatAnalyticsCount(liveCount),
    },
    { icon: MessageSquare, label: "Sandesh (total)", value: formatAnalyticsCount(data.sandesh) },
    {
      icon: Calendar,
      label: "Events",
      value: formatAnalyticsCount(data.eventsTotal),
      sub: `${formatAnalyticsCount(data.eventsUpcoming)} upcoming`,
    },
    { icon: Users, label: "Reviews (total)", value: formatAnalyticsCount(data.reviews) },
    {
      icon: Calendar,
      label: "Appointments",
      value: formatAnalyticsCount(data.appointmentsTotal),
      sub: `${formatAnalyticsCount(data.appointmentsPending)} pending`,
    },
    { icon: MessageSquare, label: "Contacts (total)", value: formatAnalyticsCount(data.contacts) },
    { icon: Video, label: "Videos (long-form)", value: formatAnalyticsCount(data.videos) },
    { icon: Video, label: "Shorts (vertical)", value: formatAnalyticsCount(data.shorts) },
    { icon: Inbox, label: "Inbox Broadcasts", value: formatAnalyticsCount(data.inboxTotal) },
    {
      icon: Image,
      label: "Gallery Images",
      value: formatAnalyticsCount(data.gallery + 9),
      sub: `9 local (GitHub) + ${formatAnalyticsCount(data.gallery)} custom (Admin)`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-maroon flex items-center gap-2">
            <BarChart3 size={22} /> Analytics Dashboard
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Accurate database counts and realtime sessions. Daily breakdown uses real submission
            timestamps from the last 7 days.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-5 py-2 rounded-full border border-gold/40 text-maroon text-sm hover:bg-cream/50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 active:scale-95"
        >
          <RotateCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-2xl bg-card border border-border hover:border-gold/40 transition"
          >
            <div className="flex items-center gap-2 text-saffron mb-2">
              <card.icon size={16} />
              <span className="text-xs uppercase tracking-wider font-medium">{card.label}</span>
            </div>
            <div className="font-display text-3xl text-maroon">{card.value}</div>
            {card.sub && <div className="text-xs text-muted-foreground mt-1">{card.sub}</div>}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 bg-gradient-divine border-b border-gold/20">
          <h4 className="font-display text-lg text-maroon">Activity by day (last 7 days)</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Reviews {formatAnalyticsCount(last7Totals.reviews)} · Contacts{" "}
            {formatAnalyticsCount(last7Totals.contacts)} · Appointments{" "}
            {formatAnalyticsCount(last7Totals.appointments)} · Sandesh{" "}
            {formatAnalyticsCount(last7Totals.sandesh)} · Videos{" "}
            {formatAnalyticsCount(last7Totals.videos)} · Shorts{" "}
            {formatAnalyticsCount(last7Totals.shorts)} · Events{" "}
            {formatAnalyticsCount(last7Totals.events)} · Inbox Broadcasts{" "}
            {formatAnalyticsCount(last7Totals.inbox)}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream/30 text-left">
                <th className="px-4 py-3 font-medium text-maroon">Day</th>
                <th className="px-4 py-3 font-medium text-maroon">Reviews</th>
                <th className="px-4 py-3 font-medium text-maroon">Contacts</th>
                <th className="px-4 py-3 font-medium text-maroon">Appointments</th>
                <th className="px-4 py-3 font-medium text-maroon">Sandesh</th>
                <th className="px-4 py-3 font-medium text-maroon">Videos</th>
                <th className="px-4 py-3 font-medium text-maroon">Shorts</th>
                <th className="px-4 py-3 font-medium text-maroon">Events</th>
                <th className="px-4 py-3 font-medium text-maroon">Inbox</th>
              </tr>
            </thead>
            <tbody>
              {data.dailyActivity.map((day) => {
                const total =
                  day.reviews +
                  day.contacts +
                  day.appointments +
                  day.sandesh +
                  day.videos +
                  day.shorts +
                  day.events +
                  day.inbox;
                return (
                  <tr
                    key={day.date}
                    className={`border-b border-border/60 ${total > 0 ? "bg-saffron/5" : ""}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{day.label}</td>
                    <td className="px-4 py-3">{formatAnalyticsCount(day.reviews)}</td>
                    <td className="px-4 py-3">{formatAnalyticsCount(day.contacts)}</td>
                    <td className="px-4 py-3">{formatAnalyticsCount(day.appointments)}</td>
                    <td className="px-4 py-3">{formatAnalyticsCount(day.sandesh)}</td>
                    <td className="px-4 py-3">{formatAnalyticsCount(day.videos)}</td>
                    <td className="px-4 py-3">{formatAnalyticsCount(day.shorts)}</td>
                    <td className="px-4 py-3">{formatAnalyticsCount(day.events)}</td>
                    <td className="px-4 py-3">{formatAnalyticsCount(day.inbox)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-cream/30 border border-gold/20 text-xs text-muted-foreground">
        <strong className="text-maroon">Realtime Tracking:</strong> Active live user sessions are
        captured automatically.
      </div>
    </div>
  );
}

type GalleryRow = {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
};

function GalleryAdmin() {
  const [form, setForm] = useState({ image_url: "", caption: "" });
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<GalleryRow[]>([]);
  const [listLoaded, setListLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("gallery")
      .select("id, image_url, caption, created_at")
      .order("created_at", { ascending: false });
    if (!error && data) setList(data as GalleryRow[]);
    setListLoaded(true);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setTimeout(() => setRefreshing(false), 600);
  }

  useEffect(() => {
    void load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image_url.trim() || !form.caption.trim()) {
      return toast.error("Image URL and caption are required");
    }
    setLoading(true);

    try {
      const { error } = await supabase.from("gallery").insert({
        image_url: form.image_url.trim(),
        caption: form.caption.trim(),
      });

      if (error) {
        toast.error(
          "Could not add: " +
            error.message +
            ". Run the gallery table SQL migration in your Supabase SQL Editor.",
        );
        setLoading(false);
        return;
      }

      toast.success("Image added to gallery!");
      setForm({ image_url: "", caption: "" });
      await load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to add: " + message);
    } finally {
      setLoading(false);
    }
  }

  async function del(id: string) {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Image removed from gallery");
    await load();
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-2xl text-maroon flex items-center gap-2 mb-0">
          <Image size={22} /> Gallery Manager
        </h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-1.5 rounded-full border border-gold/45 text-maroon text-xs font-medium hover:bg-cream/50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60 active:scale-95"
        >
          <RotateCw size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <form
        onSubmit={add}
        className="p-6 rounded-2xl bg-card border border-border space-y-4 max-w-2xl"
      >
        <h4 className="font-semibold text-maroon text-sm">Add New Image</h4>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            Image Title / Caption
          </label>
          <input
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            placeholder="e.g. Swarna Shringar (स्वर्ण श्रृंगार)"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            Image URL (Link)
          </label>
          <input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="e.g. https://images.unsplash.com/photo-..."
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold disabled:opacity-50 transition"
        >
          {loading ? "Adding..." : "Add to Gallery"}
        </button>
      </form>

      <div>
        <h4 className="font-semibold text-maroon mb-4">Uploaded Images</h4>
        {!listLoaded ? (
          <AdminTabLoader />
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No custom gallery images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {list.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-border flex flex-col shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-transparent flex items-center justify-center">
                  <img
                    src={item.image_url}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2 border-t border-border/60">
                  <div className="min-w-0 flex-1">
                    <h5 className="font-semibold text-maroon text-sm truncate">{item.caption}</h5>
                    <time className="text-[10px] text-muted-foreground/80 mt-0.5 block">
                      {new Date(item.created_at).toLocaleDateString("en-IN")}
                    </time>
                  </div>
                  <button
                    type="button"
                    onClick={() => void del(item.id)}
                    className="text-destructive p-1.5 hover:bg-destructive/10 rounded-lg transition shrink-0"
                    aria-label="Delete image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
