-- Create messages table for driver-passenger conversations
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255),
  sender_type VARCHAR(50) DEFAULT 'driver', -- driver or passenger
  message_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on booking_id for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON public.messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_email ON public.messages(sender_email);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Create a view to get the latest messages from each booking conversation
CREATE OR REPLACE VIEW latest_messages AS
SELECT DISTINCT ON (booking_id) 
  booking_id,
  sender_email,
  sender_name,
  message_text,
  created_at
FROM public.messages
ORDER BY booking_id, created_at DESC;
