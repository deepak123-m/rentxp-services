-- Check if the notifications table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'notifications'
  ) THEN
    -- Create notifications table
    CREATE TABLE notifications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      title text NOT NULL,
      message text NOT NULL,
      type text DEFAULT 'info',
      is_read boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable Row Level Security
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

    -- Create policies for notifications
    CREATE POLICY "Users can view their own notifications" ON notifications
      FOR SELECT USING (user_id = auth.uid());

    CREATE POLICY "Users can create their own notifications" ON notifications
      FOR INSERT WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Users can update their own notifications" ON notifications
      FOR UPDATE USING (user_id = auth.uid());

    -- Create index for faster queries
    CREATE INDEX idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX idx_notifications_is_read ON notifications(is_read);
  ELSE
    -- Check if is_test column exists and add it if it doesn't
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'notifications' AND column_name = 'is_test'
    ) THEN
      ALTER TABLE notifications ADD COLUMN is_test boolean DEFAULT false;
    END IF;
  END IF;
END
$$;

-- Create function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = $1
  );
END;
$$;
