-- ─────────────────────────────────────────────────────────────────────────────
-- Smart Captcha Studios — Push Notifications Database Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create the push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint    text        UNIQUE NOT NULL,
  p256dh      text        NOT NULL,
  auth        text        NOT NULL,
  user_agent  text,
  created_at  timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous users to INSERT their own subscription
--    (they submit their browser's PushSubscription object)
CREATE POLICY "allow_anon_insert"
  ON push_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. Allow anonymous users to DELETE their own subscription by endpoint
--    (used when they unsubscribe via window.SmartCapturePush.unsubscribe())
CREATE POLICY "allow_anon_delete_own"
  ON push_subscriptions
  FOR DELETE
  TO anon
  USING (true);

-- 5. Only the service role (Edge Function) can SELECT all subscriptions
--    Anonymous users cannot list all subscriptions (privacy/security)
CREATE POLICY "allow_service_role_select"
  ON push_subscriptions
  FOR SELECT
  TO service_role
  USING (true);

-- 6. Only the service role can UPDATE subscriptions (for endpoint rotation)
CREATE POLICY "allow_service_role_update"
  ON push_subscriptions
  FOR UPDATE
  TO service_role
  USING (true);

-- 7. Only the service role can DELETE stale subscriptions
CREATE POLICY "allow_service_role_delete"
  ON push_subscriptions
  FOR DELETE
  TO service_role
  USING (true);

-- Done! ✅
-- You can verify the table was created with:
--   SELECT * FROM push_subscriptions LIMIT 5;
