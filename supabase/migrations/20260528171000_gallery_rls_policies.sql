-- Enable RLS on gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Anyone can select gallery" ON public.gallery;
DROP POLICY IF EXISTS "Anyone can insert gallery" ON public.gallery;
DROP POLICY IF EXISTS "Anyone can delete gallery" ON public.gallery;

-- Create policies
CREATE POLICY "Anyone can select gallery"
ON public.gallery FOR SELECT USING (true);

CREATE POLICY "Anyone can insert gallery"
ON public.gallery FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete gallery"
ON public.gallery FOR DELETE USING (true);
