-- Fix for auth.users table RLS issue
-- The auth.users table should NOT have RLS enabled as it's managed by Supabase Auth

-- Disable RLS on auth.users table (this is the main issue)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Also ensure the auth schema is properly configured
-- This allows Supabase Auth to manage user creation during OAuth flow

-- Verify the change
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'auth' AND tablename = 'users'; 