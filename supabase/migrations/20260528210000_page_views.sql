-- Create table for tracking page views
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insertions (for users browsing the site)
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views" ON public.page_views 
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow select for analytics display
DROP POLICY IF EXISTS "Anyone can select page views" ON public.page_views;
CREATE POLICY "Anyone can select page views" ON public.page_views 
  FOR SELECT TO anon, authenticated USING (true);
