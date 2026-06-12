-- =============================================================================
-- RUN THIS ONLY if the main security script failed at site_notifications.
-- Safe to re-run — skips tables that do not exist.
-- =============================================================================

-- SITE NOTIFICATIONS (optional table — create if missing)
CREATE TABLE IF NOT EXISTS public.site_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read site notifications" ON public.site_notifications;
DROP POLICY IF EXISTS "Anyone can insert site notifications" ON public.site_notifications;
DROP POLICY IF EXISTS "Public can read site notifications" ON public.site_notifications;
DROP POLICY IF EXISTS "Admins can insert site notifications" ON public.site_notifications;
DROP POLICY IF EXISTS "Admins can delete site notifications" ON public.site_notifications;

CREATE POLICY "Public can read site notifications"
  ON public.site_notifications FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site notifications"
  ON public.site_notifications FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete site notifications"
  ON public.site_notifications FOR DELETE TO authenticated
  USING (public.is_admin());

-- PUSH SUBSCRIPTIONS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'push_subscriptions'
  ) THEN
    ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow anonymous inserts to push_subscriptions" ON public.push_subscriptions;
    DROP POLICY IF EXISTS "Allow deletion of subscriptions" ON public.push_subscriptions;
    DROP POLICY IF EXISTS "Allow update push subscriptions" ON public.push_subscriptions;
    DROP POLICY IF EXISTS "Allow read push subscriptions" ON public.push_subscriptions;
    DROP POLICY IF EXISTS "Public can subscribe to push" ON public.push_subscriptions;
    DROP POLICY IF EXISTS "Public can update own push subscription" ON public.push_subscriptions;
    DROP POLICY IF EXISTS "Admins can read push subscriptions" ON public.push_subscriptions;
    DROP POLICY IF EXISTS "Admins can delete push subscriptions" ON public.push_subscriptions;

    CREATE POLICY "Public can subscribe to push"
      ON public.push_subscriptions FOR INSERT TO anon, authenticated
      WITH CHECK (true);

    CREATE POLICY "Public can update own push subscription"
      ON public.push_subscriptions FOR UPDATE TO anon, authenticated
      USING (true)
      WITH CHECK (true);

    CREATE POLICY "Admins can read push subscriptions"
      ON public.push_subscriptions FOR SELECT TO authenticated
      USING (public.is_admin());

    CREATE POLICY "Admins can delete push subscriptions"
      ON public.push_subscriptions FOR DELETE TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- PAGE VIEWS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'page_views'
  ) THEN
    ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
    DROP POLICY IF EXISTS "Anyone can select page views" ON public.page_views;
    DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;
    DROP POLICY IF EXISTS "Admins can read page views" ON public.page_views;

    CREATE POLICY "Public can insert page views"
      ON public.page_views FOR INSERT TO anon, authenticated
      WITH CHECK (true);

    CREATE POLICY "Admins can read page views"
      ON public.page_views FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- VISITOR HEARTBEATS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'visitor_heartbeats'
  ) THEN
    ALTER TABLE public.visitor_heartbeats ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Anyone can upsert visitor heartbeat" ON public.visitor_heartbeats;
    DROP POLICY IF EXISTS "Public can insert visitor heartbeat" ON public.visitor_heartbeats;
    DROP POLICY IF EXISTS "Public can update visitor heartbeat" ON public.visitor_heartbeats;
    DROP POLICY IF EXISTS "Admins can read visitor heartbeats" ON public.visitor_heartbeats;
    DROP POLICY IF EXISTS "Admins can delete visitor heartbeats" ON public.visitor_heartbeats;

    CREATE POLICY "Public can insert visitor heartbeat"
      ON public.visitor_heartbeats FOR INSERT TO anon, authenticated
      WITH CHECK (true);

    CREATE POLICY "Public can update visitor heartbeat"
      ON public.visitor_heartbeats FOR UPDATE TO anon, authenticated
      USING (true)
      WITH CHECK (true);

    CREATE POLICY "Admins can read visitor heartbeats"
      ON public.visitor_heartbeats FOR SELECT TO authenticated
      USING (public.is_admin());

    CREATE POLICY "Admins can delete visitor heartbeats"
      ON public.visitor_heartbeats FOR DELETE TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- LEGACY videos TABLE
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'videos'
  ) THEN
    ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Enable read access for all users" ON public.videos;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.videos;
    DROP POLICY IF EXISTS "Enable all operations for service role" ON public.videos;
    DROP POLICY IF EXISTS "Public can read videos" ON public.videos;
    DROP POLICY IF EXISTS "Admins can insert videos" ON public.videos;
    DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;
    DROP POLICY IF EXISTS "Admins can delete videos" ON public.videos;

    CREATE POLICY "Public can read videos"
      ON public.videos FOR SELECT
      USING (true);

    CREATE POLICY "Admins can insert videos"
      ON public.videos FOR INSERT TO authenticated
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admins can update videos"
      ON public.videos FOR UPDATE TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admins can delete videos"
      ON public.videos FOR DELETE TO authenticated
      USING (public.is_admin());
  END IF;
END $$;
