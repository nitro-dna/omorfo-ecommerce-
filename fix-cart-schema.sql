-- Fix Cart Items Schema Issues
-- Run this in your Supabase SQL Editor

-- Drop existing cart_items table if it exists
DROP TABLE IF EXISTS cart_items CASCADE;

-- Recreate cart_items table with correct references
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT NOT NULL DEFAULT 'A3',
  frame TEXT NOT NULL DEFAULT 'No Frame',
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, frame)
);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for cart_items
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own cart items" ON cart_items
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- Add updated_at trigger
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
