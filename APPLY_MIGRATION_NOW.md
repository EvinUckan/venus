# 🚀 Apply Your Database Migration RIGHT NOW

## Quick Method: Copy & Paste SQL (2 minutes)

### Step 1: Open SQL Editor
Click this link to open the SQL Editor in your Supabase project:
**[Open SQL Editor →](https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/sql/new)**

### Step 2: Copy the SQL Below

```sql
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
```

### Step 3: Paste and Run
1. Paste the SQL into the editor
2. Click the **"Run"** button (or press Ctrl+Enter)
3. Wait for "Success" message

### Step 4: Verify Tables Created
Go to **[Table Editor](https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/editor)** and verify you see:
- ✅ users
- ✅ cycles
- ✅ diaries
- ✅ user_settings

---

## What This Creates

### 📊 Tables
- **users** - User profiles (extends auth.users)
- **cycles** - Menstrual cycle tracking
- **diaries** - Daily mood & symptoms
- **user_settings** - User preferences

### 🔐 Security
- **Row Level Security (RLS)** enabled on all tables
- **Access policies** - Users can only see their own data
- **Cascade deletes** - Data cleanup when user deleted

### ⚡ Performance
- **Indexes** on user_id and dates
- **Auto timestamps** - created_at and updated_at
- **Triggers** for automatic timestamp updates

---

## After Running the SQL

### ✅ Verify Everything Works

**Run this test query in SQL Editor:**
```sql
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'cycles', 'diaries', 'user_settings');
```

**Expected output:** 4 tables with their column counts

### 🧪 Insert Test Data

Run this command in your terminal:
```bash
node insert-test-with-auth.js
```

This will:
- Create a test user
- Add sample cycles
- Add diary entries
- Verify everything works

### 🚀 Start Your App

```bash
npm start
```

Your app is now ready to use with the complete database!

---

## 🎉 Database Structure Complete!

Your Venera app now has a complete, production-ready database with:
- ✅ All tables created
- ✅ Security policies configured
- ✅ Performance optimized
- ✅ Data integrity enforced

**Total time: ~2 minutes** ⏱️



