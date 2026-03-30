-- Create driver_support table to store driver concerns and support requests
CREATE TABLE IF NOT EXISTS public.driver_support (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_email VARCHAR(255) NOT NULL,
  driver_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- general, payment, technical, complaint, account
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in-progress, resolved
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_driver_support_driver_email ON public.driver_support(driver_email);
CREATE INDEX IF NOT EXISTS idx_driver_support_status ON public.driver_support(status);
CREATE INDEX IF NOT EXISTS idx_driver_support_created_at ON public.driver_support(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_driver_support_category ON public.driver_support(category);
