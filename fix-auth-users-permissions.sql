-- Fix Auth Users Table Permissions for OAuth
-- This script specifically addresses the "Database error saving new user" issue

-- 1. Check current RLS status on auth.users
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'auth' AND tablename = 'users';

-- 2. Disable RLS on auth.users (this is the main issue)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- 3. Grant necessary permissions to the auth service
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON auth.users TO anon, authenticated, service_role;
GRANT ALL ON auth.identities TO anon, authenticated, service_role;
GRANT ALL ON auth.sessions TO anon, authenticated, service_role;
GRANT ALL ON auth.refresh_tokens TO anon, authenticated, service_role;

-- 4. Grant sequence permissions for user IDs
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO anon, authenticated, service_role;

-- 5. Ensure the auth service can create users
GRANT CREATE ON SCHEMA auth TO service_role;

-- 6. Verify the fix
SELECT 
    schemaname, 
    tablename, 
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'auth' 
AND tablename = 'users'; 