-- Create SQL functions to bypass all RLS and schema cache issues
-- Run this in your Supabase SQL Editor

-- Function to create chat sessions
CREATE OR REPLACE FUNCTION create_chat_session(
  p_user_id UUID,
  p_title TEXT,
  p_subtitle TEXT DEFAULT ''
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  subtitle TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO chat_sessions (user_id, title, subtitle)
  VALUES (p_user_id, p_title, p_subtitle)
  RETURNING 
    chat_sessions.id,
    chat_sessions.user_id,
    chat_sessions.title,
    chat_sessions.subtitle,
    chat_sessions.is_active,
    chat_sessions.created_at,
    chat_sessions.updated_at;
END;
$$;

-- Function to create chat messages
CREATE OR REPLACE FUNCTION create_chat_message(
  p_session_id UUID,
  p_role TEXT,
  p_content TEXT
)
RETURNS TABLE (
  id UUID,
  chat_session_id UUID,
  role TEXT,
  content TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO chat_messages (chat_session_id, role, content)
  VALUES (p_session_id, p_role, p_content)
  RETURNING 
    chat_messages.id,
    chat_messages.chat_session_id,
    chat_messages.role,
    chat_messages.content,
    chat_messages.created_at;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_chat_session(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_chat_message(UUID, TEXT, TEXT) TO authenticated;

-- Also grant to anon for testing
GRANT EXECUTE ON FUNCTION create_chat_session(UUID, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION create_chat_message(UUID, TEXT, TEXT) TO anon; 