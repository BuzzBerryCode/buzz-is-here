-- Comprehensive Supabase Auth Fix
-- Run this in your Supabase SQL Editor

-- 1. Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'auth' 
ORDER BY tablename;

-- 2. Disable RLS on auth.users (this is the main issue)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- 3. Grant all necessary permissions to the auth service
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON auth.users TO anon, authenticated, service_role;
GRANT ALL ON auth.identities TO anon, authenticated, service_role;
GRANT ALL ON auth.sessions TO anon, authenticated, service_role;
GRANT ALL ON auth.refresh_tokens TO anon, authenticated, service_role;
GRANT ALL ON auth.flow_state TO anon, authenticated, service_role;
GRANT ALL ON auth.saml_providers TO anon, authenticated, service_role;
GRANT ALL ON auth.saml_relay_states TO anon, authenticated, service_role;
GRANT ALL ON auth.sso_providers TO anon, authenticated, service_role;
GRANT ALL ON auth.sso_domains TO anon, authenticated, service_role;

-- 4. Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO anon, authenticated, service_role;

-- 5. Grant function permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon, authenticated, service_role;

-- 6. Ensure the auth service can create users
GRANT CREATE ON SCHEMA auth TO service_role;

-- 7. Check if there are any triggers that might be blocking user creation
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users';

-- 8. Verify the current state
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    hasindexes,
    hasrules
FROM pg_tables 
WHERE schemaname = 'auth' 
AND tablename IN ('users', 'identities', 'sessions', 'refresh_tokens', 'flow_state');

-- 9. Check if there are any policies that might interfere
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

-- 10. Ensure proper role permissions
ALTER ROLE anon SET "auth.jwt_secret" = 'your-jwt-secret';
ALTER ROLE authenticated SET "auth.jwt_secret" = 'your-jwt-secret';
ALTER ROLE service_role SET "auth.jwt_secret" = 'your-jwt-secret';

-- 11. Check if auth schema is properly configured
SELECT 
    n.nspname as schema_name,
    c.relname as table_name,
    c.relkind as type,
    pg_get_userbyid(c.relowner) as owner
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'auth'
ORDER BY c.relname;

-- 12. Verify auth functions are accessible
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'auth'
AND p.proname LIKE '%user%'
ORDER BY p.proname; 