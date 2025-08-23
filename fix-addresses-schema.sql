-- Fix Addresses Schema Issues
-- Run this in your Supabase SQL Editor

-- Drop existing addresses table if it exists
DROP TABLE IF EXISTS addresses CASCADE;

-- Recreate addresses table with correct references
CREATE TABLE addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('shipping', 'billing')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Germany',
  phone TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for addresses
CREATE POLICY "Users can view their own addresses" ON addresses
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own addresses" ON addresses
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_type ON addresses(type);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);

-- Add updated_at trigger
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create unique constraint for default addresses per user and type
CREATE UNIQUE INDEX idx_addresses_default_per_user_type 
ON addresses(user_id, type) 
WHERE is_default = true;
