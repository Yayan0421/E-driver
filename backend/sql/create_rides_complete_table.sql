-- Create rides_complete table to store completed and cancelled bookings
CREATE TABLE IF NOT EXISTS public.rides_complete (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
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
  status VARCHAR(50) NOT NULL, -- completed, cancelled
  booking_created_at TIMESTAMP,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fare DECIMAL(10, 2),
  distance DECIMAL(10, 2),
  duration VARCHAR(50),
  rating INT,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'completed', -- completed, pending, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_rides_complete_driver_email ON public.rides_complete(driver_email);
CREATE INDEX IF NOT EXISTS idx_rides_complete_passenger_email ON public.rides_complete(passenger_email);
CREATE INDEX IF NOT EXISTS idx_rides_complete_status ON public.rides_complete(status);
CREATE INDEX IF NOT EXISTS idx_rides_complete_booking_id ON public.rides_complete(booking_id);
CREATE INDEX IF NOT EXISTS idx_rides_complete_payment_status ON public.rides_complete(payment_status);
