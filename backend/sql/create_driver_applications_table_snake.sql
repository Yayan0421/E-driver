-- Create driver_applications table with snake_case column names
-- Run this in Supabase SQL editor (you may DROP the existing table first if present)

-- Optional: drop existing table if you want to recreate (be careful, this deletes data)
-- DROP TABLE IF EXISTS public.driver_applications;

CREATE TABLE IF NOT EXISTS public.driver_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  date_of_birth date,
  email text,
  phone text,
  address text,
  id_type text,
  id_number text,
  vehicle_type text,
  vehicle_brand text,
  vehicle_model text,
  vehicle_year text,
  license_plate text,
  vehicle_color text,
  insurance_company text,
  insurance_number text,
  license_number text,
  license_expiry date,
  driving_experience integer,
  emergency_contact_name text,
  emergency_contact_phone text,
  violations text,
  selfie_image text,
  accept_terms boolean,
  created_at timestamptz DEFAULT now()
);
