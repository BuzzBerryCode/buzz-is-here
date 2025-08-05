-- Fix for user creation during OAuth signup
-- This script adds policies to allow new users to be created during OAuth flow

-- Enable RLS on auth schema tables if not already enabled
-- Note: auth.users table is managed by Supabase Auth, but we need to ensure proper policies

-- Create a policy to allow new user creation during OAuth
-- This is typically handled automatically by Supabase Auth, but let's ensure it works

-- Check if there are any conflicting policies on auth.users
-- The auth.users table should be managed by Supabase Auth itself

-- For the public schema tables, ensure we have proper policies for new users

-- Allow new users to be created in onboarding_profiles
DROP POLICY IF EXISTS "Allow new user creation" ON onboarding_profiles;
CREATE POLICY "Allow new user creation" ON onboarding_profiles
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (auth.uid()::text = user_id::text OR user_id IS NULL)
  );

-- Allow new users to be created in onboarding_steps  
DROP POLICY IF EXISTS "Allow new user creation" ON onboarding_steps;
CREATE POLICY "Allow new user creation" ON onboarding_steps
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (auth.uid()::text = user_id::text OR user_id IS NULL)
  );

-- Ensure invitation codes can be updated by new users
DROP POLICY IF EXISTS "New users can update invitation codes" ON invitation_codes;
CREATE POLICY "New users can update invitation codes" ON invitation_codes
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    (assigned_email = auth.jwt() ->> 'email' OR assigned_email IS NULL)
  );

-- Allow new users to insert into invitation codes (for claiming codes)
DROP POLICY IF EXISTS "New users can claim invitation codes" ON invitation_codes;
CREATE POLICY "New users can claim invitation codes" ON invitation_codes
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    assigned_email IS NULL
  );

-- Ensure chat sessions can be created by new users
DROP POLICY IF EXISTS "New users can create chat sessions" ON chat_sessions;
CREATE POLICY "New users can create chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    auth.uid()::text = user_id::text
  );

-- Ensure chat messages can be created by new users
DROP POLICY IF EXISTS "New users can create chat messages" ON chat_messages;
CREATE POLICY "New users can create chat messages" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  );

-- Ensure chat session settings can be created by new users
DROP POLICY IF EXISTS "New users can create chat session settings" ON chat_session_settings;
CREATE POLICY "New users can create chat session settings" ON chat_session_settings
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id::text = auth.uid()::text
    )
  ); 