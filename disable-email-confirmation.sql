-- Disable email confirmation for seamless sign-up flow
-- Run this in your Supabase SQL editor

-- Update auth settings to disable email confirmation
UPDATE auth.config 
SET confirm_email_change = false,
    enable_signup = true,
    enable_email_confirmations = false,
    enable_email_change_confirmations = false;

-- Alternative: If the above doesn't work, you can also try:
-- INSERT INTO auth.config (id, confirm_email_change, enable_signup, enable_email_confirmations, enable_email_change_confirmations)
-- VALUES (1, false, true, false, false)
-- ON CONFLICT (id) DO UPDATE SET
--   confirm_email_change = false,
--   enable_signup = true,
--   enable_email_confirmations = false,
--   enable_email_change_confirmations = false;

-- Note: You may also need to update this in the Supabase Dashboard:
-- 1. Go to Authentication → Settings
-- 2. Disable "Enable email confirmations"
-- 3. Save changes 