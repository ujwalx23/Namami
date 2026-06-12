-- =============================================================================
-- Secure RLS: public can READ content + SUBMIT forms; only logged-in admins
-- can INSERT/UPDATE/DELETE managed site data (gallery, sandesh, blog, etc.)
-- =============================================================================

-- Helper: true when request uses a valid Supabase Auth session (admin login)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- =============================================================================
-- SANDESH
-- =============================================================================
ALTER TABLE public.sandesh ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sandesh are viewable by everyone" ON public.sandesh;
DROP POLICY IF EXISTS "Anyone can insert sandesh" ON public.sandesh;
DROP POLICY IF EXISTS "Anyone can delete sandesh" ON public.sandesh;
DROP POLICY IF EXISTS "Anyone can update sandesh" ON public.sandesh;

CREATE POLICY "Public can read sandesh"
  ON public.sandesh FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert sandesh"
  ON public.sandesh FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update sandesh"
  ON public.sandesh FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete sandesh"
  ON public.sandesh FOR DELETE TO authenticated
  USING (public.is_admin());

-- =============================================================================
-- EVENTS
-- =============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Anyone can insert events" ON public.events;
DROP POLICY IF EXISTS "Anyone can delete events" ON public.events;
DROP POLICY IF EXISTS "Anyone can update events" ON public.events;

CREATE POLICY "Public can read events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE TO authenticated
  USING (public.is_admin());

-- =============================================================================
-- GALLERY
-- =============================================================================
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can select gallery" ON public.gallery;
DROP POLICY IF EXISTS "Anyone can insert gallery" ON public.gallery;
DROP POLICY IF EXISTS "Anyone can delete gallery" ON public.gallery;
DROP POLICY IF EXISTS "Anyone can update gallery" ON public.gallery;

CREATE POLICY "Public can read gallery"
  ON public.gallery FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert gallery"
  ON public.gallery FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update gallery"
  ON public.gallery FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete gallery"
  ON public.gallery FOR DELETE TO authenticated
  USING (public.is_admin());

-- =============================================================================
-- BLOG POSTS
-- =============================================================================
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow update for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow delete for all users" ON public.blog_posts;

CREATE POLICY "Public can read published blog posts"
  ON public.blog_posts FOR SELECT TO anon
  USING (
    status = 'published'
    AND publish_date <= now()
  );

CREATE POLICY "Admins can read all blog posts"
  ON public.blog_posts FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts FOR DELETE TO authenticated
  USING (public.is_admin());

-- =============================================================================
-- YOUTUBE VIDEOS
-- =============================================================================
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to all users" ON public.youtube_videos;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.youtube_videos;
DROP POLICY IF EXISTS "Allow update for all users" ON public.youtube_videos;
DROP POLICY IF EXISTS "Allow delete for all users" ON public.youtube_videos;

CREATE POLICY "Public can read youtube videos"
  ON public.youtube_videos FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert youtube videos"
  ON public.youtube_videos FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update youtube videos"
  ON public.youtube_videos FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete youtube videos"
  ON public.youtube_videos FOR DELETE TO authenticated
  USING (public.is_admin());

-- =============================================================================
-- REVIEWS (public submit + read approved; admin moderates)
-- =============================================================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Approved reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can submit a valid review" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can select reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can delete reviews" ON public.reviews;

CREATE POLICY "Public can read approved reviews"
  ON public.reviews FOR SELECT TO anon
  USING (is_approved = true);

CREATE POLICY "Admins can read all reviews"
  ON public.reviews FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Public can submit reviews"
  ON public.reviews FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 80
    AND char_length(trim(comment)) BETWEEN 3 AND 1000
  );

CREATE POLICY "Admins can update reviews"
  ON public.reviews FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE TO authenticated
  USING (public.is_admin());

-- =============================================================================
-- CONTACTS (public submit only; admin reads)
-- =============================================================================
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can select contacts" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can delete contacts" ON public.contacts;

CREATE POLICY "Public can submit contact"
  ON public.contacts FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 120
    AND char_length(trim(email)) BETWEEN 3 AND 255
    AND char_length(trim(message)) BETWEEN 1 AND 2000
  );

CREATE POLICY "Admins can read contacts"
  ON public.contacts FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can delete contacts"
  ON public.contacts FOR DELETE TO authenticated
  USING (public.is_admin());

-- =============================================================================
-- APPOINTMENTS (public request only; admin manages)
-- =============================================================================
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can request appointment" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can select appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can delete appointments" ON public.appointments;

CREATE POLICY "Public can request appointment"
  ON public.appointments FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 120
    AND char_length(trim(phone)) BETWEEN 5 AND 30
    AND char_length(trim(purpose)) BETWEEN 1 AND 1000
    AND char_length(trim(time_slot)) BETWEEN 1 AND 50
    AND appointment_date >= CURRENT_DATE
  );

CREATE POLICY "Admins can read appointments"
  ON public.appointments FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update appointments"
  ON public.appointments FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete appointments"
  ON public.appointments FOR DELETE TO authenticated
  USING (public.is_admin());

-- =============================================================================
-- INBOX MESSAGES (public read broadcasts; admin writes)
-- =============================================================================
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read inbox messages" ON public.inbox_messages;
DROP POLICY IF EXISTS "Anyone can insert inbox messages" ON public.inbox_messages;
DROP POLICY IF EXISTS "Anyone can delete inbox messages" ON public.inbox_messages;
DROP POLICY IF EXISTS "Anyone can update inbox messages" ON public.inbox_messages;

CREATE POLICY "Public can read inbox messages"
  ON public.inbox_messages FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert inbox messages"
  ON public.inbox_messages FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update inbox messages"
  ON public.inbox_messages FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete inbox messages"
  ON public.inbox_messages FOR DELETE TO authenticated
  USING (public.is_admin());

-- Remaining optional tables — see 20260612130100_secure_rls_remaining.sql
-- (site_notifications, push_subscriptions, page_views, visitor_heartbeats, videos)
