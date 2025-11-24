-- Seed data for local Supabase development
-- This file contains test data for the Venera app

-- Note: This seed data will run after migrations
-- Users are created through Supabase Auth, so we'll create test cycles and diaries
-- You'll need to sign up users through the app or API first

-- Example seed data (uncomment after creating test users)
-- 
-- -- Insert test cycles for a user (replace user_id with actual UUID)
-- INSERT INTO public.cycles (user_id, start_date, end_date, cycle_length, period_length) VALUES
--   ('YOUR_USER_ID_HERE', '2025-01-01', '2025-01-05', 28, 5),
--   ('YOUR_USER_ID_HERE', '2025-01-29', '2025-02-03', 28, 6),
--   ('YOUR_USER_ID_HERE', '2025-02-26', '2025-03-02', 28, 5);
-- 
-- -- Insert test diaries
-- INSERT INTO public.diaries (user_id, date, mood, symptoms, notes) VALUES
--   ('YOUR_USER_ID_HERE', '2025-01-01', 'tired', ARRAY['cramps', 'headache'], 'First day of period'),
--   ('YOUR_USER_ID_HERE', '2025-01-15', 'energetic', ARRAY[]::TEXT[], 'Feeling great today!'),
--   ('YOUR_USER_ID_HERE', '2025-02-14', 'happy', ARRAY['bloating'], 'Valentines Day!');
-- 
-- -- Insert user settings
-- INSERT INTO public.user_settings (user_id, cycle_length, period_length, language) VALUES
--   ('YOUR_USER_ID_HERE', 28, 5, 'en');

-- For now, just add a comment
SELECT 'Seed data ready - create users first, then uncomment and update the INSERT statements above' AS message;


