/*
  # Create additional tables for rewards and achievements

  1. New Tables
    - `user_rewards` - Store user rewards and points
    - `achievements` - Define available achievements
    - `user_achievements` - Track user achievement progress
    - `surprise_events` - Manage surprise events and promotions

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each table
*/

-- User Rewards Table
CREATE TABLE IF NOT EXISTS user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('daily_login', 'first_purchase', 'loyalty_points', 'surprise_gift', 'achievement')),
  title text NOT NULL,
  description text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  claimed boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON user_rewards
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own rewards"
  ON user_rewards
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create rewards"
  ON user_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  requirement_type text NOT NULL CHECK (requirement_type IN ('orders', 'spending', 'login_streak', 'referrals')),
  requirement_value integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are publicly readable"
  ON achievements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage achievements"
  ON achievements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can manage user achievements"
  ON user_achievements
  FOR ALL
  TO authenticated
  USING (true);

-- Surprise Events Table
CREATE TABLE IF NOT EXISTS surprise_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('flash_sale', 'mystery_box', 'spin_wheel', 'daily_gift')),
  active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz NOT NULL,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE surprise_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active events are publicly readable"
  ON surprise_events
  FOR SELECT
  TO public
  USING (active = true AND now() BETWEEN start_date AND end_date);

CREATE POLICY "Admin can manage surprise events"
  ON surprise_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Add loyalty points and level to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS level text DEFAULT 'Bronze',
ADD COLUMN IF NOT EXISTS last_login timestamptz,
ADD COLUMN IF NOT EXISTS login_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_orders integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent integer DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_claimed ON user_rewards(claimed);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_surprise_events_active ON surprise_events(active);
CREATE INDEX IF NOT EXISTS idx_surprise_events_dates ON surprise_events(start_date, end_date);