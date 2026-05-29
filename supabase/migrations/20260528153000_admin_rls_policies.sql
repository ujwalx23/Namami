-- Ensure the youtube_videos table exists and matches expected structure
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id TEXT PRIMARY KEY, -- The YouTube Video ID (e.g. i3W9AOFhJAI)
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'short')),
    embed TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on youtube_videos
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Allow read access to all users" ON public.youtube_videos;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.youtube_videos;
DROP POLICY IF EXISTS "Allow update for all users" ON public.youtube_videos;
DROP POLICY IF EXISTS "Allow delete for all users" ON public.youtube_videos;

-- Create public policies for youtube_videos table
CREATE POLICY "Allow read access to all users" 
ON public.youtube_videos FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" 
ON public.youtube_videos FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" 
ON public.youtube_videos FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" 
ON public.youtube_videos FOR DELETE USING (true);

-- Enable select, update, and delete policies for public on appointments
DROP POLICY IF EXISTS "Anyone can select appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can delete appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can update appointments" ON public.appointments;

CREATE POLICY "Anyone can select appointments"
ON public.appointments FOR SELECT USING (true);

CREATE POLICY "Anyone can update appointments"
ON public.appointments FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete appointments"
ON public.appointments FOR DELETE USING (true);

-- Enable select and delete policies for public on contacts
DROP POLICY IF EXISTS "Anyone can select contacts" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can delete contacts" ON public.contacts;

CREATE POLICY "Anyone can select contacts"
ON public.contacts FOR SELECT USING (true);

CREATE POLICY "Anyone can delete contacts"
ON public.contacts FOR DELETE USING (true);

-- Enable delete policy for public on reviews (select and insert already exist)
DROP POLICY IF EXISTS "Anyone can delete reviews" ON public.reviews;
CREATE POLICY "Anyone can delete reviews"
ON public.reviews FOR DELETE USING (true);

-- Enable select policy for all reviews (in case they are not approved yet, so admin can see them)
DROP POLICY IF EXISTS "Anyone can select reviews" ON public.reviews;
CREATE POLICY "Anyone can select reviews"
ON public.reviews FOR SELECT USING (true);

-- Enable update policies for admin/public on events, sandesh, and inbox_messages
DROP POLICY IF EXISTS "Anyone can update events" ON public.events;
CREATE POLICY "Anyone can update events"
ON public.events FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can update sandesh" ON public.sandesh;
CREATE POLICY "Anyone can update sandesh"
ON public.sandesh FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can update inbox messages" ON public.inbox_messages;
CREATE POLICY "Anyone can update inbox messages"
ON public.inbox_messages FOR UPDATE USING (true);
