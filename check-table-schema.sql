-- Check table schema and data types
-- Run this to see the actual column types

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('chat_sessions', 'chat_messages', 'chat_session_settings', 'onboarding_profiles', 'onboarding_steps')
AND column_name = 'user_id'
ORDER BY table_name; 