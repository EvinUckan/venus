# Supabase Setup Guide for Venera App

## Overview
This guide will help you set up and use Supabase as your database backend for the Venera period tracking app.

## Prerequisites
✅ **Already Installed**: `@supabase/supabase-js` package has been installed
✅ **Supabase Client**: Created at `src/api/supabase.ts`
✅ **Service Functions**: Example functions created at `src/api/supabase-service.ts`

## Your Supabase Project Details

- **Project URL**: `https://tfpqemhikqavgfmvnfrq.supabase.co`
- **Project Dashboard**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq

## Environment Variables Setup

### Step 1: Add Environment Variables

You need to add these environment variables to your project. The exact method depends on your deployment:

#### For Local Development:
Create a `.env` file in the root directory with:

```env
EXPO_PUBLIC_VIBECODE_SUPABASE_URL=https://tfpqemhikqavgfmvnfrq.supabase.co
EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmcHFlbWhpa3FhdmdmbXZuZnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTkzODAsImV4cCI6MjA3ODY5NTM4MH0.qHYqt6TL83421lV4vlRzTlqMbtalru619B4EQ6LEgcs
```

#### For Production/EAS Build:
Add the environment variables to your EAS secrets or app.json configuration.

## Database Schema Recommendations

Based on your app structure, here are recommended tables to create in Supabase:

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Cycles Table
```sql
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

-- Add index for faster queries
CREATE INDEX idx_cycles_user_id ON cycles(user_id);
CREATE INDEX idx_cycles_start_date ON cycles(start_date DESC);
```

### 3. Diaries Table
```sql
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

-- Add index for faster queries
CREATE INDEX idx_diaries_user_id ON diaries(user_id);
CREATE INDEX idx_diaries_date ON diaries(date DESC);
```

### 4. Settings Table
```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  cycle_length INTEGER DEFAULT 28,
  period_length INTEGER DEFAULT 5,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

Enable RLS and add policies to secure your data:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Cycles policies
CREATE POLICY "Users can view own cycles" ON cycles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycles" ON cycles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycles" ON cycles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycles" ON cycles
  FOR DELETE USING (auth.uid() = user_id);

-- Diaries policies
CREATE POLICY "Users can view own diaries" ON diaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diaries" ON diaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diaries" ON diaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diaries" ON diaries
  FOR DELETE USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

## Usage Examples

### 1. Import the Supabase Client
```typescript
import { supabase } from './src/api/supabase';
```

### 2. Using the Service Functions
```typescript
import {
  fetchUserCycles,
  addCycleToSupabase,
  signInUser,
  getCurrentUser
} from './src/api/supabase-service';

// Sign in a user
const { user, session } = await signInUser('user@example.com', 'password');

// Get current user
const currentUser = await getCurrentUser();

// Fetch cycles
const cycles = await fetchUserCycles(currentUser.id);

// Add a new cycle
const newCycle = await addCycleToSupabase({
  user_id: currentUser.id,
  start_date: '2025-01-01',
  end_date: '2025-01-05',
  cycle_length: 28,
  period_length: 5
});
```

### 3. Direct Supabase Queries
```typescript
import { supabase } from './src/api/supabase';

// Insert data
const { data, error } = await supabase
  .from('cycles')
  .insert([
    {
      user_id: userId,
      start_date: '2025-01-01',
      end_date: '2025-01-05',
      cycle_length: 28,
      period_length: 5
    }
  ]);

// Select data
const { data, error } = await supabase
  .from('cycles')
  .select('*')
  .eq('user_id', userId)
  .order('start_date', { ascending: false });

// Update data
const { data, error } = await supabase
  .from('cycles')
  .update({ end_date: '2025-01-06' })
  .eq('id', cycleId);

// Delete data
const { data, error } = await supabase
  .from('cycles')
  .delete()
  .eq('id', cycleId);
```

### 4. Real-time Subscriptions
```typescript
import { subscribeToCyclesChanges } from './src/api/supabase-service';

// Subscribe to changes
const subscription = subscribeToCyclesChanges(userId, (payload) => {
  console.log('Change received!', payload);
  // Update your local state here
});

// Unsubscribe when component unmounts
subscription.unsubscribe();
```

## Integration with Existing Store

You can integrate Supabase with your existing Zustand store (`src/state/venusStore.ts`):

```typescript
// Example: Sync local state with Supabase
const useVenusStore = create<VenusStore>()(
  persist(
    (set, get) => ({
      // ... existing state ...

      // Modified addCycle to also save to Supabase
      addCycle: async (cycle) => {
        try {
          // Save to Supabase
          const savedCycle = await addCycleToSupabase({
            user_id: currentUserId, // Get from auth
            start_date: cycle.startDate,
            end_date: cycle.endDate,
            cycle_length: get().settings.cycleLength,
            period_length: get().settings.periodLength
          });

          // Update local state
          set((state) => ({
            cycles: [...state.cycles, {
              id: savedCycle.id,
              startDate: savedCycle.start_date,
              endDate: savedCycle.end_date
            }].sort(
              (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            ),
          }));
        } catch (error) {
          console.error('Failed to add cycle:', error);
          // Handle error appropriately
        }
      },
    }),
    {
      name: "venus-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

## Testing the Connection

To test if your Supabase connection is working:

```typescript
import { supabase } from './src/api/supabase';

// Test the connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count');
    
    if (error) {
      console.error('Connection failed:', error);
    } else {
      console.log('✅ Supabase connected successfully!');
    }
  } catch (err) {
    console.error('❌ Failed to connect:', err);
  }
}
```

## Next Steps

1. ✅ Create the database tables in your Supabase dashboard
2. ✅ Set up Row Level Security policies
3. ✅ Add environment variables to your project
4. ✅ Test the connection
5. ✅ Integrate authentication (if needed)
6. ✅ Update your existing stores to sync with Supabase
7. ✅ Test all CRUD operations

## Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq
- **Supabase Docs**: https://supabase.com/docs
- **Supabase JS Client Docs**: https://supabase.com/docs/reference/javascript/introduction
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security

## Support

If you encounter any issues, check:
- Supabase project dashboard for errors
- Browser/Metro console for error messages
- Ensure environment variables are properly loaded
- Verify RLS policies allow your queries


