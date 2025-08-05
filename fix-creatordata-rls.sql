-- Fix RLS policies for creatordata table to allow anonymous access
-- This will enable the Discover page to fetch creator data

-- First, let's check if RLS is enabled on the creatordata table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'creatordata';

-- Disable RLS on creatordata table to allow anonymous access
ALTER TABLE public.creatordata DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled but allow anonymous access, create a policy:
-- DROP POLICY IF EXISTS creatordata_select_policy ON public.creatordata;
-- CREATE POLICY creatordata_select_policy ON public.creatordata
--     FOR SELECT
--     TO anon
--     USING (true);

-- Verify the change
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'creatordata';

-- Test query to verify access
SELECT COUNT(*) FROM public.creatordata; 