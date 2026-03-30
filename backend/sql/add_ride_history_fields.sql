-- Add missing fields to bookings table for ride history
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS fare DECIMAL(10, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS distance DECIMAL(10, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration VARCHAR(50);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'Card';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS ride_type VARCHAR(50) DEFAULT 'Standard';
