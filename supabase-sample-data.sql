-- Sample data for ómorfo
-- Run this after creating the schema

-- Insert categories
INSERT INTO categories (name, slug, description, image) VALUES
('Abstract', 'abstract', 'Modern abstract designs with bold colors and geometric shapes', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'),
('Nature', 'nature', 'Beautiful nature-inspired posters featuring landscapes and botanical elements', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'),
('Typography', 'typography', 'Elegant typography posters with inspiring quotes and modern fonts', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'),
('Minimalist', 'minimalist', 'Clean and simple minimalist designs for modern spaces', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'),
('Vintage', 'vintage', 'Retro and vintage-inspired posters with classic aesthetics', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop');

-- Insert products
INSERT INTO products (name, slug, description, price, sale_price, images, category_id, tags, dimensions, materials, sizes, frames, in_stock, stock_count, rating, review_count, featured) 
SELECT 
  'Abstract Geometric Harmony',
  'abstract-geometric-harmony',
  'A stunning abstract composition featuring bold geometric shapes in harmonious colors. Perfect for modern living spaces.',
  49.99,
  39.99,
  ARRAY[
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop'
  ],
  c.id,
  ARRAY['abstract', 'geometric', 'modern', 'colorful'],
  '{"width": 297, "height": 420}',
  ARRAY['Premium matte paper', 'Fade-resistant inks'],
  ARRAY['A4', 'A3', 'A2', 'A1', 'A0'],
  ARRAY['No Frame', 'Black Frame', 'White Frame', 'Natural Wood Frame'],
  true,
  50,
  4.8,
  124,
  true
FROM categories c WHERE c.slug = 'abstract';

INSERT INTO products (name, slug, description, price, sale_price, images, category_id, tags, dimensions, materials, sizes, frames, in_stock, stock_count, rating, review_count, featured) 
SELECT 
  'Mountain Landscape Serenity',
  'mountain-landscape-serenity',
  'Breathtaking mountain landscape with serene colors and peaceful atmosphere. Ideal for creating a calming environment.',
  59.99,
  NULL,
  ARRAY[
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop'
  ],
  c.id,
  ARRAY['nature', 'landscape', 'mountains', 'serene'],
  '{"width": 297, "height": 420}',
  ARRAY['Premium matte paper', 'Fade-resistant inks'],
  ARRAY['A4', 'A3', 'A2', 'A1'],
  ARRAY['No Frame', 'Black Frame', 'White Frame', 'Natural Wood Frame'],
  true,
  35,
  4.9,
  203,
  true
FROM categories c WHERE c.slug = 'nature';

INSERT INTO products (name, slug, description, price, sale_price, images, category_id, tags, dimensions, materials, sizes, frames, in_stock, stock_count, rating, review_count, featured) 
SELECT 
  'Typography Inspiration Quote',
  'typography-inspiration-quote',
  'Elegant typography poster featuring an inspiring quote with modern font design. Perfect for home offices and study spaces.',
  44.99,
  34.99,
  ARRAY[
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1200&fit=crop'
  ],
  c.id,
  ARRAY['typography', 'quote', 'inspiration', 'modern'],
  '{"width": 297, "height": 420}',
  ARRAY['Premium matte paper', 'Fade-resistant inks'],
  ARRAY['A4', 'A3', 'A2'],
  ARRAY['No Frame', 'Black Frame', 'White Frame'],
  true,
  40,
  4.6,
  89,
  false
FROM categories c WHERE c.slug = 'typography';

INSERT INTO products (name, slug, description, price, sale_price, images, category_id, tags, dimensions, materials, sizes, frames, in_stock, stock_count, rating, review_count, featured) 
SELECT 
  'Minimalist Line Art',
  'minimalist-line-art',
  'Clean and simple line art design with minimalist aesthetic. Perfect for contemporary interiors.',
  39.99,
  NULL,
  ARRAY[
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop'
  ],
  c.id,
  ARRAY['minimalist', 'line art', 'simple', 'contemporary'],
  '{"width": 297, "height": 420}',
  ARRAY['Premium matte paper', 'Fade-resistant inks'],
  ARRAY['A4', 'A3', 'A2', 'A1'],
  ARRAY['No Frame', 'Black Frame', 'White Frame'],
  true,
  60,
  4.7,
  156,
  true
FROM categories c WHERE c.slug = 'minimalist';

INSERT INTO products (name, slug, description, price, sale_price, images, category_id, tags, dimensions, materials, sizes, frames, in_stock, stock_count, rating, review_count, featured) 
SELECT 
  'Vintage Travel Poster',
  'vintage-travel-poster',
  'Retro travel poster with vintage aesthetics and classic design elements. Adds character to any room.',
  54.99,
  44.99,
  ARRAY[
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop'
  ],
  c.id,
  ARRAY['vintage', 'travel', 'retro', 'classic'],
  '{"width": 297, "height": 420}',
  ARRAY['Premium matte paper', 'Fade-resistant inks'],
  ARRAY['A4', 'A3', 'A2'],
  ARRAY['No Frame', 'Black Frame', 'Natural Wood Frame'],
  true,
  25,
  4.5,
  78,
  false
FROM categories c WHERE c.slug = 'vintage';

-- Update category product counts
UPDATE categories SET product_count = (
  SELECT COUNT(*) FROM products WHERE category_id = categories.id
);
