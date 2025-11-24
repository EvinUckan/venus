-- Create tables for Venera app
-- This migration sets up the initial database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cycles table
CREATE TABLE IF NOT EXISTS public.cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cycle_length INTEGER,
  period_length INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diaries table
CREATE TABLE IF NOT EXISTS public.diaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT,
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_length INTEGER DEFAULT 28,
  period_length INTEGER DEFAULT 5,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cycles_user_id ON public.cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_cycles_start_date ON public.cycles(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON public.diaries(user_id);
CREATE INDEX IF NOT EXISTS idx_diaries_date ON public.diaries(date DESC);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for cycles table
CREATE POLICY "Users can view own cycles" ON public.cycles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycles" ON public.cycles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycles" ON public.cycles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycles" ON public.cycles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for diaries table
CREATE POLICY "Users can view own diaries" ON public.diaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diaries" ON public.diaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diaries" ON public.diaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diaries" ON public.diaries
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_settings table
CREATE POLICY "Users can view own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cycles_updated_at BEFORE UPDATE ON public.cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diaries_updated_at BEFORE UPDATE ON public.diaries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a comment to track migration
COMMENT ON TABLE public.cycles IS 'Stores menstrual cycle data for users';
COMMENT ON TABLE public.diaries IS 'Stores daily diary entries including mood and symptoms';
COMMENT ON TABLE public.user_settings IS 'Stores user preferences and settings';


