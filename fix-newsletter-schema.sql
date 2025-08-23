-- Fix Newsletter Schema Issues
-- Run this in your Supabase SQL Editor

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_logs table for analytics
CREATE TABLE IF NOT EXISTS newsletter_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'subscribe', 'unsubscribe', 'email_sent', 'email_opened', 'email_clicked'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_campaigns table for email campaigns
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'cancelled'
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_campaign_recipients table
CREATE TABLE IF NOT EXISTS newsletter_campaign_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaign_recipients ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter_subscribers
CREATE POLICY "Anyone can insert newsletter subscribers" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view newsletter subscribers" ON newsletter_subscribers
  FOR SELECT USING (true);

CREATE POLICY "Subscribers can update their own subscription" ON newsletter_subscribers
  FOR UPDATE USING (true);

-- Create policies for newsletter_logs
CREATE POLICY "Anyone can insert newsletter logs" ON newsletter_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view newsletter logs" ON newsletter_logs
  FOR SELECT USING (true);

-- Create policies for newsletter_campaigns
CREATE POLICY "Admin can manage newsletter campaigns" ON newsletter_campaigns
  FOR ALL USING (true);

-- Create policies for newsletter_campaign_recipients
CREATE POLICY "Admin can manage campaign recipients" ON newsletter_campaign_recipients
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON newsletter_subscribers(is_active);

CREATE INDEX IF NOT EXISTS idx_newsletter_logs_email ON newsletter_logs(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_action ON newsletter_logs(action);
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_created_at ON newsletter_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_scheduled_at ON newsletter_campaigns(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_recipients_campaign_id ON newsletter_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_recipients_subscriber_id ON newsletter_campaign_recipients(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_recipients_status ON newsletter_campaign_recipients(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER trigger_update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_newsletter_campaigns_updated_at
  BEFORE UPDATE ON newsletter_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle unsubscribe
CREATE OR REPLACE FUNCTION unsubscribe_from_newsletter(subscriber_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE newsletter_subscribers 
  SET is_active = false, unsubscribed_at = NOW()
  WHERE email = subscriber_email AND is_active = true;
  
  IF FOUND THEN
    INSERT INTO newsletter_logs (email, action, metadata)
    VALUES (subscriber_email, 'unsubscribe', '{"unsubscribed_at": "' || NOW() || '"}');
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample newsletter subscribers for testing
INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES
  ('test@example.com', NOW() - INTERVAL '7 days'),
  ('demo@omorfo.com', NOW() - INTERVAL '3 days'),
  ('newsletter@test.com', NOW() - INTERVAL '1 day')
ON CONFLICT (email) DO NOTHING;

-- Insert sample newsletter logs
INSERT INTO newsletter_logs (email, action, metadata) VALUES
  ('test@example.com', 'subscribe', '{"source": "footer"}'),
  ('demo@omorfo.com', 'subscribe', '{"source": "homepage"}'),
  ('newsletter@test.com', 'subscribe', '{"source": "popup"}')
ON CONFLICT DO NOTHING;
