-- Fix OAuth Database Issues
-- This script addresses the "Database error saving new user" issue

-- 1. Check if auth.users table has RLS enabled (it shouldn't)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'auth' AND tablename = 'users';

-- 2. Disable RLS on auth.users if it's enabled (this is the main issue)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- 3. Grant necessary permissions to the auth service
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON auth.users TO anon, authenticated;
GRANT ALL ON auth.identities TO anon, authenticated;
GRANT ALL ON auth.sessions TO anon, authenticated;
GRANT ALL ON auth.refresh_tokens TO anon, authenticated;

-- 4. Ensure the auth service can create users
GRANT CREATE ON SCHEMA auth TO service_role;
GRANT ALL ON auth.users TO service_role;
GRANT ALL ON auth.identities TO service_role;
GRANT ALL ON auth.sessions TO service_role;
GRANT ALL ON auth.refresh_tokens TO service_role;

-- 5. Check if there are any triggers that might be blocking user creation
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users';

-- 6. Verify the current state
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    hasindexes,
    hasrules
FROM pg_tables 
WHERE schemaname = 'auth' 
AND tablename IN ('users', 'identities', 'sessions', 'refresh_tokens');

-- 7. Check if there are any policies that might interfere
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'auth' 
AND tablename = 'users'; 