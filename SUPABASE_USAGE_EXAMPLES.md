# Supabase Usage Examples for Venera App

This guide shows practical examples of how to integrate Supabase into your existing Venera app screens and components.

## Table of Contents
- [Basic Setup](#basic-setup)
- [Authentication](#authentication)
- [Cycle Management](#cycle-management)
- [Diary Entries](#diary-entries)
- [Real-time Updates](#real-time-updates)
- [Integration with TodayScreen](#integration-with-todayscreen)

---

## Basic Setup

### Import Supabase Client
```typescript
import { supabase } from './src/api/supabase';
```

### Import Service Functions
```typescript
import {
  fetchUserCycles,
  addCycleToSupabase,
  updateCycleInSupabase,
  deleteCycleFromSupabase,
  signInUser,
  getCurrentUser
} from './src/api/supabase-service';
```

---

## Authentication

### Sign Up Example
```typescript
import { signUpUser } from './src/api/supabase-service';

const handleSignUp = async (email: string, password: string) => {
  try {
    const { user, session } = await signUpUser(email, password);
    console.log('User signed up:', user);
    // Navigate to main app
  } catch (error) {
    console.error('Sign up failed:', error);
    Alert.alert('Error', 'Failed to create account');
  }
};
```

### Sign In Example
```typescript
import { signInUser } from './src/api/supabase-service';

const handleSignIn = async (email: string, password: string) => {
  try {
    const { user, session } = await signInUser(email, password);
    console.log('User signed in:', user);
    // Navigate to main app
  } catch (error) {
    console.error('Sign in failed:', error);
    Alert.alert('Error', 'Invalid credentials');
  }
};
```

### Get Current User
```typescript
import { getCurrentUser } from './src/api/supabase-service';

const checkAuth = async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      console.log('Logged in as:', user.email);
      return user;
    } else {
      console.log('Not logged in');
      // Navigate to login screen
      return null;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
};
```

---

## Cycle Management

### Fetch User Cycles
```typescript
import { fetchUserCycles } from './src/api/supabase-service';
import { getCurrentUser } from './src/api/supabase-service';

const loadCycles = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const cycles = await fetchUserCycles(user.id);
    console.log('Loaded cycles:', cycles);
    // Update your state with the cycles
    return cycles;
  } catch (error) {
    console.error('Failed to load cycles:', error);
  }
};
```

### Add New Cycle
```typescript
import { addCycleToSupabase } from './src/api/supabase-service';

const handleAddCycle = async (startDate: string, endDate: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    const newCycle = await addCycleToSupabase({
      user_id: user.id,
      start_date: startDate,
      end_date: endDate,
      cycle_length: 28,
      period_length: 5
    });

    console.log('Cycle added:', newCycle);
    // Update your local state
    return newCycle;
  } catch (error) {
    console.error('Failed to add cycle:', error);
    Alert.alert('Error', 'Failed to save cycle');
  }
};
```

### Update Cycle
```typescript
import { updateCycleInSupabase } from './src/api/supabase-service';

const handleUpdateCycle = async (cycleId: string, endDate: string) => {
  try {
    const updatedCycle = await updateCycleInSupabase(cycleId, {
      end_date: endDate
    });

    console.log('Cycle updated:', updatedCycle);
    return updatedCycle;
  } catch (error) {
    console.error('Failed to update cycle:', error);
    Alert.alert('Error', 'Failed to update cycle');
  }
};
```

### Delete Cycle
```typescript
import { deleteCycleFromSupabase } from './src/api/supabase-service';

const handleDeleteCycle = async (cycleId: string) => {
  try {
    await deleteCycleFromSupabase(cycleId);
    console.log('Cycle deleted');
    // Update your local state
  } catch (error) {
    console.error('Failed to delete cycle:', error);
    Alert.alert('Error', 'Failed to delete cycle');
  }
};
```

---

## Diary Entries

### Add Diary Entry
```typescript
import { addDiaryToSupabase } from './src/api/supabase-service';

const handleAddDiary = async (mood: string, symptoms: string[], notes: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const newDiary = await addDiaryToSupabase({
      user_id: user.id,
      date: new Date().toISOString().split('T')[0],
      mood: mood,
      symptoms: symptoms,
      notes: notes
    });

    console.log('Diary entry added:', newDiary);
    return newDiary;
  } catch (error) {
    console.error('Failed to add diary:', error);
    Alert.alert('Error', 'Failed to save diary entry');
  }
};
```

### Fetch Diary Entries
```typescript
import { fetchUserDiaries } from './src/api/supabase-service';

const loadDiaries = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    const diaries = await fetchUserDiaries(user.id);
    console.log('Loaded diaries:', diaries);
    return diaries;
  } catch (error) {
    console.error('Failed to load diaries:', error);
  }
};
```

---

## Real-time Updates

### Complete Real-time Sync Pattern (Recommended)

Here's the complete pattern used in Vibecode app for full sync between Supabase and local state:

```typescript
import React, { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import useVenusStore from '../state/venusStore';
import { 
  getCurrentUser, 
  subscribeToCyclesChanges,
  subscribeToDiariesChanges,
  fetchUserCycles,
  fetchUserDiaries 
} from '../api/supabase-service';

function MyScreen() {
  const cycles = useVenusStore((s) => s.cycles);
  const diaries = useVenusStore((s) => s.diaries);
  const setCycles = useVenusStore((s) => s.setCycles);
  const setDiaries = useVenusStore((s) => s.setDiaries);

  // 1. Fetch data from Supabase on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const user = await getCurrentUser();
          if (!user) {
            console.log("ℹ️ No user logged in");
            return;
          }

          console.log("🔄 Fetching data...");
          const [remoteCycles, remoteDiaries] = await Promise.all([
            fetchUserCycles(user.id),
            fetchUserDiaries(user.id),
          ]);

          // Transform and update local state
          const transformedCycles = remoteCycles.map((cycle) => ({
            id: cycle.id!,
            startDate: cycle.start_date,
            endDate: cycle.end_date,
          }));

          const transformedDiaries = remoteDiaries.map((diary) => ({
            id: diary.id!,
            date: diary.date,
            moodTag: diary.mood as any,
            note: diary.notes,
          }));

          setCycles(transformedCycles);
          setDiaries(transformedDiaries);
          console.log("✅ Data fetched successfully");
        } catch (error) {
          console.error("⚠️ Failed to fetch data:", error);
        }
      };

      fetchData();
    }, [])
  );

  // 2. Subscribe to real-time changes
  useEffect(() => {
    let cyclesSubscription: any;
    let diariesSubscription: any;

    const setupSubscriptions = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        console.log("🔔 Setting up real-time subscriptions...");

        // Subscribe to cycles changes
        cyclesSubscription = subscribeToCyclesChanges(user.id, (payload) => {
          console.log("🔔 Cycle changed:", payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newCycle = {
              id: payload.new.id,
              startDate: payload.new.start_date,
              endDate: payload.new.end_date,
            };
            setCycles([...cycles, newCycle].sort(
              (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            ));
          } else if (payload.eventType === 'UPDATE') {
            setCycles(cycles.map((cycle) =>
              cycle.id === payload.new.id
                ? {
                    id: payload.new.id,
                    startDate: payload.new.start_date,
                    endDate: payload.new.end_date,
                  }
                : cycle
            ));
          } else if (payload.eventType === 'DELETE') {
            setCycles(cycles.filter((cycle) => cycle.id !== payload.old.id));
          }
        });

        // Subscribe to diaries changes
        diariesSubscription = subscribeToDiariesChanges(user.id, (payload) => {
          console.log("🔔 Diary changed:", payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newDiary = {
              id: payload.new.id,
              date: payload.new.date,
              moodTag: payload.new.mood,
              note: payload.new.notes,
            };
            setDiaries([...diaries, newDiary].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
          } else if (payload.eventType === 'UPDATE') {
            setDiaries(diaries.map((diary) =>
              diary.id === payload.new.id
                ? {
                    id: payload.new.id,
                    date: payload.new.date,
                    moodTag: payload.new.mood,
                    note: payload.new.notes,
                  }
                : diary
            ));
          } else if (payload.eventType === 'DELETE') {
            setDiaries(diaries.filter((diary) => diary.id !== payload.old.id));
          }
        });
      } catch (error) {
        console.error("⚠️ Failed to setup subscriptions:", error);
      }
    };

    setupSubscriptions();

    // Cleanup subscriptions on unmount
    return () => {
      cyclesSubscription?.unsubscribe();
      diariesSubscription?.unsubscribe();
      console.log("🔕 Unsubscribed from real-time changes");
    };
  }, [cycles, diaries]);

  return (
    // Your component JSX
  );
}
```

### Key Features of This Pattern

✅ **Fetches on Focus**: Data is refreshed every time the screen comes into focus
✅ **Real-time Updates**: Changes in Supabase instantly appear in the app
✅ **Bidirectional Sync**: App changes go to Supabase, Supabase changes come to app
✅ **Proper Cleanup**: Subscriptions are cleaned up when component unmounts
✅ **User Filtering**: Only fetches/subscribes to the logged-in user's data

---

## Integration with TodayScreen

Here's how you can modify your existing `TodayScreen` to sync with Supabase:

```typescript
import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { getCurrentUser, fetchUserCycles } from "../api/supabase-service";
import useVenusStore from "../state/venusStore";

export default function TodayScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const cycles = useVenusStore((s) => s.cycles);
  const settings = useVenusStore((s) => s.settings);

  // Load data from Supabase on mount
  useEffect(() => {
    loadDataFromSupabase();
  }, []);

  const loadDataFromSupabase = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is logged in
      const user = await getCurrentUser();
      if (!user) {
        console.log('User not logged in, using local storage only');
        setIsLoading(false);
        return;
      }

      // Fetch cycles from Supabase
      const remoteCycles = await fetchUserCycles(user.id);
      
      // You can either:
      // 1. Merge with local cycles
      // 2. Replace local cycles with remote cycles
      // 3. Implement conflict resolution
      
      console.log('Loaded cycles from Supabase:', remoteCycles);
      
      // Example: Update local store with remote data
      // useVenusStore.setState({ cycles: remoteCycles });
      
    } catch (error) {
      console.error('Failed to load data from Supabase:', error);
      Alert.alert('Sync Error', 'Failed to sync with cloud. Using local data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Rest of your existing TodayScreen code...
  return (
    // Your existing JSX
  );
}
```

---

## Advanced: Custom Hook for Supabase Sync

Create a custom hook to automatically sync with Supabase:

```typescript
// src/hooks/useSupabaseSync.ts
import { useEffect, useState } from 'react';
import { getCurrentUser, fetchUserCycles, subscribeToCyclesChanges } from '../api/supabase-service';
import useVenusStore from '../state/venusStore';

export function useSupabaseSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: any;

    const initSync = async () => {
      try {
        setIsSyncing(true);
        
        const user = await getCurrentUser();
        if (!user) {
          console.log('No user logged in, skipping sync');
          return;
        }

        // Initial data load
        const cycles = await fetchUserCycles(user.id);
        useVenusStore.setState({ cycles });

        // Set up real-time subscription
        subscription = subscribeToCyclesChanges(user.id, (payload) => {
          // Handle real-time updates
          console.log('Real-time update:', payload);
        });

        setSyncError(null);
      } catch (error) {
        console.error('Sync error:', error);
        setSyncError(error.message);
      } finally {
        setIsSyncing(false);
      }
    };

    initSync();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { isSyncing, syncError };
}
```

Then use it in your app:

```typescript
import { useSupabaseSync } from '../hooks/useSupabaseSync';

function App() {
  const { isSyncing, syncError } = useSupabaseSync();

  if (syncError) {
    console.warn('Sync error:', syncError);
  }

  // Rest of your app...
}
```

---

## Direct Queries (Advanced)

For custom queries not covered by the service functions:

```typescript
import { supabase } from './src/api/supabase';

// Complex query example
const getCycleStatistics = async (userId: string) => {
  const { data, error } = await supabase
    .from('cycles')
    .select(`
      id,
      start_date,
      end_date,
      cycle_length,
      period_length
    `)
    .eq('user_id', userId)
    .gte('start_date', '2025-01-01')
    .order('start_date', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
};

// Aggregation query
const getAverageCycleLength = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('calculate_average_cycle_length', {
      user_id_param: userId
    });

  if (error) throw error;
  return data;
};
```

---

## Error Handling Best Practices

Always wrap Supabase calls in try-catch blocks:

```typescript
const safeSupabaseCall = async () => {
  try {
    const { data, error } = await supabase
      .from('cycles')
      .select('*');

    if (error) {
      // Supabase-specific error
      console.error('Supabase error:', error.message);
      
      // Handle specific error types
      if (error.code === 'PGRST116') {
        Alert.alert('Error', 'Table not found');
      } else if (error.code === '42501') {
        Alert.alert('Error', 'Permission denied');
      } else {
        Alert.alert('Error', 'Database error occurred');
      }
      
      return null;
    }

    return data;
  } catch (error) {
    // Network or other errors
    console.error('Network error:', error);
    Alert.alert('Error', 'Connection failed. Please check your internet.');
    return null;
  }
};
```

---

## Testing Checklist

Before deploying, test:

- ✅ User authentication (sign up, sign in, sign out)
- ✅ Data persistence (add, update, delete)
- ✅ Real-time updates
- ✅ Offline functionality (if implemented)
- ✅ Error handling
- ✅ Row Level Security (try accessing other users' data)

---

## Next Steps

1. **Create database tables** in Supabase dashboard
2. **Set up RLS policies** for security
3. **Choose integration approach**:
   - Option A: Keep local Zustand store + Supabase backup
   - Option B: Use Supabase as primary data source
   - Option C: Hybrid approach with offline support
4. **Implement authentication** (if needed)
5. **Test thoroughly** before production

---

## Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq
- **API Documentation**: https://supabase.com/docs/reference/javascript
- **Authentication Guide**: https://supabase.com/docs/guides/auth
- **Real-time Guide**: https://supabase.com/docs/guides/realtime

---

For more details, see:
- `SUPABASE_SETUP.md` - Initial setup and database schema
- `ENV_VARIABLES.md` - Environment configuration
- `src/api/supabase.ts` - Supabase client
- `src/api/supabase-service.ts` - Service functions


