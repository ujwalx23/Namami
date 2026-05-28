-- Site inbox: admin broadcasts appear here; online users get Realtime popup + navbar inbox
CREATE TABLE IF NOT EXISTS public.inbox_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read inbox messages" ON public.inbox_messages;
CREATE POLICY "Anyone can read inbox messages"
  ON public.inbox_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert inbox messages" ON public.inbox_messages;
CREATE POLICY "Anyone can insert inbox messages"
  ON public.inbox_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete inbox messages" ON public.inbox_messages;
CREATE POLICY "Anyone can delete inbox messages"
  ON public.inbox_messages FOR DELETE USING (true);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.inbox_messages;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
