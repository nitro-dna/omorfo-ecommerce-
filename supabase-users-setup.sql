-- Create users table in Supabase
-- Run this in your Supabase SQL Editor

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  image TEXT,
  email_verified TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert test user from local data
INSERT INTO users (id, name, email, password, email_verified, created_at, updated_at)
VALUES (
  '1755176296731',
  'Test User',
  'test@example.com',
  '$2a$12$IjoLm.b3rP6ueBJ94hml/u/4n8c/g4dL/tQa9BDVMGXrv1AHd4Dwu',
  '2025-08-14T12:58:16.731Z',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
