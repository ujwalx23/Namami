-- Contacts table for contact form submissions
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact"
  ON public.contacts FOR INSERT TO public
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 120
    AND char_length(trim(email)) BETWEEN 3 AND 255
    AND char_length(trim(message)) BETWEEN 1 AND 2000
  );
-- No SELECT policy => not publicly readable (PII protected)

-- Appointments with Guru Ji
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request appointment"
  ON public.appointments FOR INSERT TO public
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 120
    AND char_length(trim(phone)) BETWEEN 5 AND 30
    AND char_length(trim(purpose)) BETWEEN 1 AND 1000
    AND char_length(trim(time_slot)) BETWEEN 1 AND 50
    AND appointment_date >= CURRENT_DATE
  );

-- Allow public INSERTs to events and sandesh (admin UI uses anon key + passcode gate in app)
CREATE POLICY "Anyone can insert events"
  ON public.events FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can delete events"
  ON public.events FOR DELETE TO public USING (true);

CREATE POLICY "Anyone can insert sandesh"
  ON public.sandesh FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can delete sandesh"
  ON public.sandesh FOR DELETE TO public USING (true);