-- Add a password column to users table (development only).
-- Run in Supabase SQL editor. In production use hashed passwords and Supabase Auth.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS password text;

-- Optional: populate password for test users (plain text) e.g.
-- UPDATE public.users SET password = 'test123' WHERE email = 'you@example.com';
