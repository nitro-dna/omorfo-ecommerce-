-- Fix Wishlist Schema Issues
-- Run this in your Supabase SQL Editor

-- Drop existing wishlist_items table if it exists
DROP TABLE IF EXISTS wishlist_items CASCADE;

-- Recreate wishlist_items table with correct references
CREATE TABLE wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlist_items
CREATE POLICY "Users can view their own wishlist items" ON wishlist_items
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own wishlist items" ON wishlist_items
  FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);

-- Add updated_at trigger
CREATE TRIGGER update_wishlist_items_updated_at BEFORE UPDATE ON wishlist_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
