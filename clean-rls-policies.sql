-- Clean RLS Policies for BuzzBerry Application
-- This script removes duplicate policies and creates clean, working policies

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view messages from their chat sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert messages to their chat sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can update messages from their chat sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete messages from their chat sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can view messages in own sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert messages in own sessions" ON chat_messages;

DROP POLICY IF EXISTS "Users can view settings from their chat sessions" ON chat_session_settings;
DROP POLICY IF EXISTS "Users can manage settings for their chat sessions" ON chat_session_settings;
DROP POLICY IF EXISTS "Users can view settings for own sessions" ON chat_session_settings;
DROP POLICY IF EXISTS "Users can insert settings for own sessions" ON chat_session_settings;
DROP POLICY IF EXISTS "Users can update settings for own sessions" ON chat_session_settings;

DROP POLICY IF EXISTS "Users can insert own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can insert their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete own chat sessions" ON chat_sessions;

-- Enable RLS on creatordata table
ALTER TABLE creatordata ENABLE ROW LEVEL SECURITY;

-- Create clean, non-duplicate policies

-- Chat Sessions Policies
CREATE POLICY "chat_sessions_select" ON chat_sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "chat_sessions_insert" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "chat_sessions_update" ON chat_sessions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "chat_sessions_delete" ON chat_sessions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Chat Messages Policies
CREATE POLICY "chat_messages_select" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "chat_messages_insert" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "chat_messages_update" ON chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "chat_messages_delete" ON chat_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

-- Chat Session Settings Policies
CREATE POLICY "chat_session_settings_select" ON chat_session_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "chat_session_settings_insert" ON chat_session_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "chat_session_settings_update" ON chat_session_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "chat_session_settings_delete" ON chat_session_settings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

-- Invitation Codes Policies (Allow read access for validation)
CREATE POLICY "invitation_codes_select" ON invitation_codes
  FOR SELECT USING (true);

CREATE POLICY "invitation_codes_update" ON invitation_codes
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    (assigned_email = auth.jwt() ->> 'email' OR assigned_email IS NULL)
  );

-- Waitlist Policies (Allow public access for signups)
CREATE POLICY "waitlist_insert" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "waitlist_select" ON waitlist
  FOR SELECT USING (true);

-- Onboarding Profiles Policies
CREATE POLICY "onboarding_profiles_all" ON onboarding_profiles
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Onboarding Steps Policies
CREATE POLICY "onboarding_steps_all" ON onboarding_steps
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Creator Data Policies (Read-only for authenticated users)
CREATE POLICY "creatordata_select" ON creatordata
  FOR SELECT USING (auth.uid() IS NOT NULL); 