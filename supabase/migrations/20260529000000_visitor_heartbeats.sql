-- ============================================================
-- Visitor heartbeat table for reliable live visitor counting
-- Replace Supabase Realtime Presence (unreliable on production)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.visitor_heartbeats (
  session_id TEXT PRIMARY KEY,
  last_seen  TIMESTAMPTZ NOT NULL DEFAULT now(),
  page_path  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_heartbeats ENABLE ROW LEVEL SECURITY;

-- Anyone (anon / authenticated) can upsert their own heartbeat
DROP POLICY IF EXISTS "Anyone can upsert visitor heartbeat" ON public.visitor_heartbeats;
CREATE POLICY "Anyone can upsert visitor heartbeat" ON public.visitor_heartbeats
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Also ensure page_views table exists with correct policies
-- (re-run safe — IF NOT EXISTS guards everything)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.page_views (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select page views" ON public.page_views;
CREATE POLICY "Anyone can select page views" ON public.page_views
  FOR SELECT TO anon, authenticated USING (true);
