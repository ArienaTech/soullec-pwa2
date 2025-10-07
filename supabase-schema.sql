-- Soullec Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- SESSIONS TABLE (for Replit Auth)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Index for session expiration cleanup
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions(expire);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  subscription_status TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  soul_gems INTEGER DEFAULT 1 NOT NULL,
  last_free_gems_date TEXT,
  birth_date TEXT,
  birth_time TEXT,
  birth_place TEXT,
  religion TEXT,
  horoscope_preferences TEXT[],
  referral_code VARCHAR UNIQUE,
  referred_by VARCHAR REFERENCES users(id),
  referral_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for referral lookups
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  emotion TEXT,
  type TEXT DEFAULT 'message' NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Index for user message lookups
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  stripe_payment_id TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Index for payment lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe ON payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_timestamp ON payments(timestamp DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Sessions: Service role only
CREATE POLICY "Service role can manage sessions"
  ON sessions
  FOR ALL
  TO service_role
  USING (true);

-- Users: Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid()::text = id OR true); -- Allow all reads for now

CREATE POLICY "Service role can manage users"
  ON users
  FOR ALL
  TO service_role
  USING (true);

-- Messages: Users can read their own messages
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  USING (auth.uid()::text = user_id OR true); -- Allow all reads for now

CREATE POLICY "Service role can manage messages"
  ON messages
  FOR ALL
  TO service_role
  USING (true);

-- Payments: Users can read their own payments
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  USING (auth.uid()::text = user_id OR true); -- Allow all reads for now

CREATE POLICY "Service role can manage payments"
  ON payments
  FOR ALL
  TO service_role
  USING (true);

-- =====================================================
-- USEFUL VIEWS (OPTIONAL)
-- =====================================================

-- View for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.email,
  u.subscription_status,
  u.soul_gems,
  u.referral_count,
  COUNT(DISTINCT m.id) as total_messages,
  COUNT(DISTINCT p.id) as total_payments,
  SUM(CASE WHEN p.type = 'gems' THEN p.amount ELSE 0 END) as total_gems_purchased,
  u.created_at,
  u.updated_at
FROM users u
LEFT JOIN messages m ON u.id = m.user_id
LEFT JOIN payments p ON u.id = p.user_id
GROUP BY u.id, u.email, u.subscription_status, u.soul_gems, u.referral_count, u.created_at, u.updated_at;

-- =====================================================
-- FUNCTIONS (OPTIONAL BUT USEFUL)
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =====================================================
-- Uncomment to insert sample data

/*
-- Sample user
INSERT INTO users (email, subscription_status, soul_gems, referral_code)
VALUES ('test@example.com', 'free', 5, 'TEST123');

-- Sample message
INSERT INTO messages (user_id, input, ai_response, emotion, type)
SELECT 
  id, 
  'I feel hopeful today',
  'The universe whispers to those who listen. Your journey is unfolding exactly as it should.',
  'hopeful',
  'message'
FROM users WHERE email = 'test@example.com' LIMIT 1;
*/

-- =====================================================
-- CLEANUP OLD SESSIONS (OPTIONAL CRON JOB)
-- =====================================================
-- Delete expired sessions (run this periodically or set up a cron job in Supabase)
-- DELETE FROM sessions WHERE expire < NOW();
