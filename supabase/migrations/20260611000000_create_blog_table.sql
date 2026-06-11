-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    seo_title TEXT,
    seo_description TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    featured_image TEXT,
    content TEXT NOT NULL,
    author TEXT DEFAULT 'Pujya Guru Ji',
    publish_date TIMESTAMPTZ DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Allow read access to all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow update for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow delete for all users" ON public.blog_posts;

-- Create policies
CREATE POLICY "Allow read access to all users" ON public.blog_posts
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON public.blog_posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON public.blog_posts
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON public.blog_posts
    FOR DELETE USING (true);
