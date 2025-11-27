# 🚀 Supabase Quick Start Guide - Venera App

## ✅ What's Been Set Up

Your Supabase database connection is ready! Here's what was configured:

### 📦 Installed
- ✅ `@supabase/supabase-js` package (v2.81.1)

### 📝 Files Created
1. **`src/api/supabase.ts`** - Supabase client configuration
2. **`src/api/supabase-service.ts`** - Ready-to-use service functions
3. **`.env`** - Environment variables with your credentials
4. **`.gitignore`** - Updated to protect your `.env` file
5. **`test-supabase-connection.ts`** - Connection test script

### 📚 Documentation Created
- **`SUPABASE_SETUP.md`** - Complete setup guide with database schemas
- **`SUPABASE_USAGE_EXAMPLES.md`** - Code examples for your app
- **`ENV_VARIABLES.md`** - Environment variable configuration
- **`SUPABASE_QUICKSTART.md`** - This quick start guide

---

## 🎯 Your Supabase Project

**Project URL**: https://tfpqemhikqavgfmvnfrq.supabase.co
**Dashboard**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq

Your credentials are already configured in the `.env` file.

---

## 🏃 Quick Start (3 Steps)

### Step 1: Restart Your Dev Server

```bash
# Stop your current Expo server (Ctrl+C)
# Then restart it:
npm start
```

This ensures the environment variables are loaded.

### Step 2: Create Database Tables

Go to your Supabase dashboard and run this SQL:

**Dashboard → SQL Editor → New Query**

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cycles table
CREATE TABLE cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cycle_length INTEGER,
  period_length INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diaries table
CREATE TABLE diaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT,
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  cycle_length INTEGER DEFAULT 28,
  period_length INTEGER DEFAULT 5,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cycles_user_id ON cycles(user_id);
CREATE INDEX idx_cycles_start_date ON cycles(start_date DESC);
CREATE INDEX idx_diaries_user_id ON diaries(user_id);
CREATE INDEX idx_diaries_date ON diaries(date DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for cycles
CREATE POLICY "Users can view own cycles" ON cycles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cycles" ON cycles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cycles" ON cycles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cycles" ON cycles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for diaries
CREATE POLICY "Users can view own diaries" ON diaries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own diaries" ON diaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own diaries" ON diaries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own diaries" ON diaries
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

Click **Run** to execute the query.

### Step 3: Start Using Supabase

Import the client in any file:

```typescript
import { supabase } from './src/api/supabase';
import { fetchUserCycles, addCycleToSupabase } from './src/api/supabase-service';

// Example: Fetch cycles
const cycles = await fetchUserCycles(userId);

// Example: Add a cycle
const newCycle = await addCycleToSupabase({
  user_id: userId,
  start_date: '2025-01-01',
  end_date: '2025-01-05',
  cycle_length: 28,
  period_length: 5
});
```

---

## 🧪 Test Your Connection

Run the test script:

```bash
npx ts-node test-supabase-connection.ts
```

Or add this to any of your React Native components:

```typescript
import { useEffect } from 'react';
import { supabase } from './src/api/supabase';

useEffect(() => {
  const testConnection = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('Connection test:', error.message);
    } else {
      console.log('✅ Supabase connected!');
    }
  };
  
  testConnection();
}, []);
```

---

## 📖 Common Operations

### Sign Up a User
```typescript
import { signUpUser } from './src/api/supabase-service';

const result = await signUpUser('user@example.com', 'password123');
console.log('User created:', result.user);
```

### Sign In
```typescript
import { signInUser } from './src/api/supabase-service';

const result = await signInUser('user@example.com', 'password123');
console.log('Logged in:', result.user);
```

### Add a Cycle
```typescript
import { addCycleToSupabase } from './src/api/supabase-service';

const cycle = await addCycleToSupabase({
  user_id: 'user-uuid-here',
  start_date: '2025-01-01',
  end_date: '2025-01-05',
  cycle_length: 28,
  period_length: 5
});
```

### Fetch User's Cycles
```typescript
import { fetchUserCycles } from './src/api/supabase-service';

const cycles = await fetchUserCycles('user-uuid-here');
console.log('User cycles:', cycles);
```

---

## 🔐 Security Notes

✅ **Already Protected**:
- Your `.env` file is in `.gitignore`
- Row Level Security (RLS) is enabled
- Each user can only access their own data

⚠️ **Important**:
- The ANON key in `.env` is safe for client-side use
- Never share your SERVICE_ROLE key
- RLS policies protect your data even with the ANON key

---

## 📚 Next Steps

1. **Read the detailed guides**:
   - `SUPABASE_SETUP.md` - Full setup details
   - `SUPABASE_USAGE_EXAMPLES.md` - More code examples

2. **Integrate with your app**:
   - Add authentication screens
   - Sync cycles with Supabase
   - Add real-time updates

3. **Test everything**:
   - Create test users
   - Add/update/delete cycles
   - Test permissions

---

## 🆘 Troubleshooting

### Environment variables not loading?
```bash
# Stop server
# Delete .expo folder
rm -rf .expo
# Restart
npm start
```

### Can't connect to Supabase?
1. Check `.env` file exists
2. Verify credentials in dashboard
3. Check internet connection
4. Look for errors in console

### Tables don't exist?
- Run the SQL from Step 2 in Supabase dashboard
- Check SQL Editor → Query History for errors

### Permission denied errors?
- Ensure RLS policies are created (Step 2)
- Verify user is authenticated
- Check `auth.uid()` matches `user_id`

---

## 🎉 You're Ready!

Your Supabase connection is fully configured and ready to use. Start building!

**Need help?** Check the other documentation files or visit:
- Supabase Docs: https://supabase.com/docs
- Your Dashboard: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq


