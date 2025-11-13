-- Create notifications table with gc_ prefix
CREATE TABLE IF NOT EXISTS gc_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read boolean DEFAULT false,
  is_test boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create push_subscriptions table with gc_ prefix
CREATE TABLE IF NOT EXISTS gc_push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription jsonb,
  device_type text NOT NULL,
  device_token text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, device_type)
);

-- Enable Row Level Security
ALTER TABLE gc_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gc_push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" ON gc_notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON gc_notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM gc_profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) OR auth.uid() = user_id
  );

CREATE POLICY "Users can update their own notifications" ON gc_notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Create policies for push_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON gc_push_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own subscriptions" ON gc_push_subscriptions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" ON gc_push_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM gc_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_gc_notifications_updated_at
  BEFORE UPDATE ON gc_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_gc_push_subscriptions_updated_at
  BEFORE UPDATE ON gc_push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create index for faster queries
CREATE INDEX idx_gc_notifications_user_id ON gc_notifications(user_id);
CREATE INDEX idx_gc_notifications_is_read ON gc_notifications(is_read);
CREATE INDEX idx_gc_push_subscriptions_user_id ON gc_push_subscriptions(user_id);
