-- Alter gallery table to make caption nullable
ALTER TABLE public.gallery ALTER COLUMN caption DROP NOT NULL;
