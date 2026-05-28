-- Reliable in-app notifications via Realtime postgres_changes
CREATE TABLE IF NOT EXISTS public.site_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read site notifications" ON public.site_notifications;
CREATE POLICY "Anyone can read site notifications"
  ON public.site_notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert site notifications" ON public.site_notifications;
CREATE POLICY "Anyone can insert site notifications"
  ON public.site_notifications FOR INSERT WITH CHECK (true);

-- Enable Realtime for INSERT events (clients show toast on new rows)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_notifications;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Allow upserting push subscriptions when keys rotate
DROP POLICY IF EXISTS "Allow update push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Allow update push subscriptions"
  ON public.push_subscriptions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Allow read push subscriptions"
  ON public.push_subscriptions FOR SELECT TO anon, authenticated USING (true);
