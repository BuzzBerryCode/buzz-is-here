-- Comprehensive RLS Fix for BuzzBerry Application
-- This script enables RLS on all tables and creates proper policies

-- Enable RLS on all tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_session_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;

-- Chat Sessions Policies
DROP POLICY IF EXISTS "Users can insert own chat sessions" ON chat_sessions;
CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own chat sessions" ON chat_sessions;
CREATE POLICY "Users can update own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own chat sessions" ON chat_sessions;
CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Chat Messages Policies
DROP POLICY IF EXISTS "Users can view messages in own sessions" ON chat_messages;
CREATE POLICY "Users can view messages in own sessions" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can insert messages in own sessions" ON chat_messages;
CREATE POLICY "Users can insert messages in own sessions" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

-- Chat Session Settings Policies
DROP POLICY IF EXISTS "Users can view settings for own sessions" ON chat_session_settings;
CREATE POLICY "Users can view settings for own sessions" ON chat_session_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can insert settings for own sessions" ON chat_session_settings;
CREATE POLICY "Users can insert settings for own sessions" ON chat_session_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can update settings for own sessions" ON chat_session_settings;
CREATE POLICY "Users can update settings for own sessions" ON chat_session_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

-- Invitation Codes Policies (Allow read access for validation)
DROP POLICY IF EXISTS "Anyone can read invitation codes" ON invitation_codes;
CREATE POLICY "Anyone can read invitation codes" ON invitation_codes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can update their assigned codes" ON invitation_codes;
CREATE POLICY "Authenticated users can update their assigned codes" ON invitation_codes
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    (assigned_email = auth.jwt() ->> 'email' OR assigned_email IS NULL)
  );

-- Waitlist Policies (Allow public access for signups)
DROP POLICY IF EXISTS "Anyone can insert to waitlist" ON waitlist;
CREATE POLICY "Anyone can insert to waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read waitlist" ON waitlist;
CREATE POLICY "Anyone can read waitlist" ON waitlist
  FOR SELECT USING (true);

-- Onboarding Profiles Policies
DROP POLICY IF EXISTS "Users can manage own onboarding profile" ON onboarding_profiles;
CREATE POLICY "Users can manage own onboarding profile" ON onboarding_profiles
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Onboarding Steps Policies
DROP POLICY IF EXISTS "Users can manage own onboarding steps" ON onboarding_steps;
CREATE POLICY "Users can manage own onboarding steps" ON onboarding_steps
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Creator Data Policies (Read-only for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can read creator data" ON creatordata;
CREATE POLICY "Authenticated users can read creator data" ON creatordata
  FOR SELECT USING (auth.uid() IS NOT NULL); 