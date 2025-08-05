-- Check and fix chat tables structure
-- Run this in your Supabase SQL Editor

-- 1. Check if tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name IN ('chat_sessions', 'chat_messages', 'chat_session_settings')
AND table_schema = 'public';

-- 2. Check chat_sessions table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'chat_sessions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check chat_messages table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('chat_sessions', 'chat_messages', 'chat_session_settings');

-- 5. Check if there are any existing records
SELECT 'chat_sessions' as table_name, COUNT(*) as record_count FROM chat_sessions
UNION ALL
SELECT 'chat_messages' as table_name, COUNT(*) as record_count FROM chat_messages
UNION ALL
SELECT 'chat_session_settings' as table_name, COUNT(*) as record_count FROM chat_session_settings;

-- 6. Test insert into chat_sessions (if table exists)
-- INSERT INTO chat_sessions (user_id, title, subtitle) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Test Session', 'Test Subtitle')
-- RETURNING id, user_id, title, subtitle; 