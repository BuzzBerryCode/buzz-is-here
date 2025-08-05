-- Fix RLS policies to only allow authenticated users
-- Remove the temporary default user ID bypass

-- Update chat_sessions policies to only allow authenticated users
DROP POLICY IF EXISTS "Users can insert own chat sessions" ON chat_sessions;
CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own chat sessions" ON chat_sessions;
CREATE POLICY "Users can update own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own chat sessions" ON chat_sessions;
CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Update chat_messages policies to only allow authenticated users
DROP POLICY IF EXISTS "Users can view messages in own sessions" ON chat_messages;
CREATE POLICY "Users can view messages in own sessions" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert messages in own sessions" ON chat_messages;
CREATE POLICY "Users can insert messages in own sessions" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Update chat_session_settings policies to only allow authenticated users
DROP POLICY IF EXISTS "Users can view settings for own sessions" ON chat_session_settings;
CREATE POLICY "Users can view settings for own sessions" ON chat_session_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert settings for own sessions" ON chat_session_settings;
CREATE POLICY "Users can insert settings for own sessions" ON chat_session_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update settings for own sessions" ON chat_session_settings;
CREATE POLICY "Users can update settings for own sessions" ON chat_session_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  ); 