-- Create Push Subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts to push_subscriptions" 
ON public.push_subscriptions FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow deletion of subscriptions" 
ON public.push_subscriptions FOR DELETE TO anon, authenticated USING (true);

-- Create Dynamic YouTube Videos table
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id TEXT PRIMARY KEY, -- The YouTube Video ID (e.g. i3W9AOFhJAI)
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'short')),
    embed TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for videos
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users" 
ON public.youtube_videos FOR SELECT TO anon, authenticated USING (true);
