-- =============================================================================
-- Migration: Secure Admin Policy with admin_users table
-- This replaces the vulnerable is_admin() logic with a strict user whitelist check.
-- =============================================================================

-- 1. Create the admin_users table to store authorized admin user IDs
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only superusers/postgres (service role) can read/write the admin_users table
-- We do not define any public SELECT/INSERT/UPDATE/DELETE policies, keeping it completely private.

-- 2. Redefine public.is_admin() helper function to check the admin_users table.
-- We use SECURITY DEFINER so that the function can query public.admin_users bypassing normal RLS checks.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    );
END;
$$;

-- 3. Drop the visitor_heartbeats table since live counting is being removed
DROP TABLE IF EXISTS public.visitor_heartbeats CASCADE;
