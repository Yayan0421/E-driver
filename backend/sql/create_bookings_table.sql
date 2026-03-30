-- Create bookings table to store ride bookings from passengers
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_email VARCHAR(255),
  passenger_name VARCHAR(255) NOT NULL,
  passenger_email VARCHAR(255) NOT NULL,
  passenger_phone VARCHAR(20),
  pickup_address TEXT,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  dropoff_address TEXT,
  dropoff_latitude DECIMAL(10, 8),
  dropoff_longitude DECIMAL(11, 8),
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, completed, cancelled, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on driver_email for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_driver_email ON public.bookings(driver_email);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger_email ON public.bookings(passenger_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
