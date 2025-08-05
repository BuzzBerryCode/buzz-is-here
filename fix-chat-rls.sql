-- Fix RLS policies for chat tables
-- Run this in your Supabase SQL Editor

-- Disable RLS on chat_messages table
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

-- Disable RLS on chat_sessions table  
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS chat_messages_select ON chat_messages;
DROP POLICY IF EXISTS chat_messages_insert ON chat_messages;
DROP POLICY IF EXISTS chat_messages_update ON chat_messages;
DROP POLICY IF EXISTS chat_messages_delete ON chat_messages;

DROP POLICY IF EXISTS chat_sessions_select ON chat_sessions;
DROP POLICY IF EXISTS chat_sessions_insert ON chat_sessions;
DROP POLICY IF EXISTS chat_sessions_update ON chat_sessions;
DROP POLICY IF EXISTS chat_sessions_delete ON chat_sessions;

-- Create permissive policies for chat_messages
CREATE POLICY chat_messages_all ON chat_messages
FOR ALL USING (true) WITH CHECK (true);

-- Create permissive policies for chat_sessions
CREATE POLICY chat_sessions_all ON chat_sessions
FOR ALL USING (true) WITH CHECK (true);

-- Verify the changes
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('chat_messages', 'chat_sessions'); 