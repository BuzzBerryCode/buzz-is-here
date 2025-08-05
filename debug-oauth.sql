-- Debug OAuth user creation issue
-- Check the current state of tables and policies

-- Check if auth.users table has RLS enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'auth' AND tablename = 'users';

-- Check RLS status on all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check existing policies on public tables
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if there are any triggers that might be interfering
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Check the auth schema configuration
SELECT nspname, nspowner::regrole as owner
FROM pg_namespace 
WHERE nspname = 'auth'; 