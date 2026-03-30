-- Create a users table for registrations
-- Run this in Supabase SQL editor (or via psql)

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Optional: grant insert/select to anon or a specific role if needed
-- GRANT INSERT, SELECT ON public.users TO authenticated;
