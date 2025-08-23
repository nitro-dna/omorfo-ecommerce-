-- Fix Search Schema Issues
-- Run this in your Supabase SQL Editor

-- Create search_logs table for analytics
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  result_count INTEGER NOT NULL DEFAULT 0,
  filters JSONB,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search_history table for user search history
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  result_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search_trends table for trending searches
CREATE TABLE IF NOT EXISTS search_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL UNIQUE,
  search_count INTEGER NOT NULL DEFAULT 1,
  last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_trends ENABLE ROW LEVEL SECURITY;

-- Create policies for search_logs
CREATE POLICY "Anyone can insert search logs" ON search_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own search logs" ON search_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Create policies for search_history
CREATE POLICY "Users can manage their own search history" ON search_history
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for search_trends
CREATE POLICY "Anyone can view search trends" ON search_trends
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert search trends" ON search_trends
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs(query);
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_search_logs_user_id ON search_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);

CREATE INDEX IF NOT EXISTS idx_search_trends_query ON search_trends(query);
CREATE INDEX IF NOT EXISTS idx_search_trends_search_count ON search_trends(search_count);
CREATE INDEX IF NOT EXISTS idx_search_trends_last_searched ON search_trends(last_searched);

-- Create function to increment search count
CREATE OR REPLACE FUNCTION increment_search_count(search_query TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO search_trends (query, search_count, last_searched)
  VALUES (search_query, 1, NOW())
  ON CONFLICT (query)
  DO UPDATE SET
    search_count = search_trends.search_count + 1,
    last_searched = NOW();
END;
$$ LANGUAGE plpgsql;

-- Add tags column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Add rating column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0;

-- Add stock_count column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT 0;

-- Add size column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS size TEXT;

-- Add color column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS color TEXT;

-- Create indexes for product search
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON products USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_stock_count ON products(stock_count);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Insert some sample trending searches
INSERT INTO search_trends (query, search_count) VALUES
  ('abstract posters', 15),
  ('nature landscape', 12),
  ('typography quotes', 8),
  ('vintage travel', 10),
  ('minimalist art', 6),
  ('geometric patterns', 4),
  ('urban photography', 3),
  ('floral designs', 5)
ON CONFLICT (query) DO NOTHING;

-- Create a function to update product rating based on reviews
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews 
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
  )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update product rating when reviews change
DROP TRIGGER IF EXISTS trigger_update_product_rating ON reviews;
CREATE TRIGGER trigger_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();
