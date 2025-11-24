/*
SUPABASE SERVICE
This file contains example functions for interacting with Supabase database.
Customize these functions based on your database schema.
*/
import { supabase } from '../lib/supabase';

// Example: User data interface
export interface UserData {
  id?: string;
  name: string;
  email: string;
  created_at?: string;
}

// Example: Cycle data interface (matching your existing app structure)
export interface CycleData {
  id?: string;
  user_id: string;
  start_date: string;
  end_date: string;
  cycle_length: number;
  period_length: number;
  created_at?: string;
}

// Example: Diary entry interface
export interface DiaryData {
  id?: string;
  user_id: string;
  date: string;
  mood: string;
  symptoms?: string[];
  notes?: string;
  created_at?: string;
}

/**
 * Example function: Fetch user cycles from Supabase
 */
export const fetchUserCycles = async (userId: string): Promise<CycleData[]> => {
  try {
    const { data, error } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching cycles:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch user cycles:', error);
    throw error;
  }
};

/**
 * Example function: Add a new cycle to Supabase
 */
export const addCycleToSupabase = async (cycle: Omit<CycleData, 'id' | 'created_at'>): Promise<CycleData> => {
  try {
    const { data, error } = await supabase
      .from('cycles')
      .insert([cycle])
      .select()
      .single();

    if (error) {
      console.error('Error adding cycle:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add cycle:', error);
    throw error;
  }
};

/**
 * Example function: Update a cycle in Supabase
 */
export const updateCycleInSupabase = async (
  cycleId: string,
  updates: Partial<CycleData>
): Promise<CycleData> => {
  try {
    const { data, error } = await supabase
      .from('cycles')
      .update(updates)
      .eq('id', cycleId)
      .select()
      .single();

    if (error) {
      console.error('Error updating cycle:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update cycle:', error);
    throw error;
  }
};

/**
 * Example function: Delete a cycle from Supabase
 */
export const deleteCycleFromSupabase = async (cycleId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cycles')
      .delete()
      .eq('id', cycleId);

    if (error) {
      console.error('Error deleting cycle:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete cycle:', error);
    throw error;
  }
};

/**
 * Example function: Fetch user diary entries from Supabase
 */
export const fetchUserDiaries = async (userId: string): Promise<DiaryData[]> => {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching diaries:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch user diaries:', error);
    throw error;
  }
};

/**
 * Example function: Add a new diary entry to Supabase
 */
export const addDiaryToSupabase = async (diary: Omit<DiaryData, 'id' | 'created_at'>): Promise<DiaryData> => {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .insert([diary])
      .select()
      .single();

    if (error) {
      console.error('Error adding diary:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add diary:', error);
    throw error;
  }
};

/**
 * Example function: Update a diary entry in Supabase
 */
export const updateDiaryInSupabase = async (
  diaryId: string,
  updates: Partial<DiaryData>
): Promise<DiaryData> => {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .update(updates)
      .eq('id', diaryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating diary:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update diary:', error);
    throw error;
  }
};

/**
 * Example function: Delete a diary entry from Supabase
 */
export const deleteDiaryFromSupabase = async (diaryId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('diaries')
      .delete()
      .eq('id', diaryId);

    if (error) {
      console.error('Error deleting diary:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete diary:', error);
    throw error;
  }
};

/**
 * Example function: Real-time subscription to cycles changes
 */
export const subscribeToCyclesChanges = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('cycles_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cycles',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

/**
 * Example function: Real-time subscription to diaries changes
 */
export const subscribeToDiariesChanges = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('diaries_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'diaries',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

/**
 * Example function: Sign up a new user
 */
export const signUpUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to sign up user:', error);
    throw error;
  }
};

/**
 * Example function: Sign in a user
 */
export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to sign in user:', error);
    throw error;
  }
};

/**
 * Example function: Sign out current user
 */
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to sign out user:', error);
    throw error;
  }
};

/**
 * Example function: Get current user session
 */
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }

    return session?.user || null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

// User Settings Interface
export interface UserSettings {
  user_id: string;
  cycle_length: number;
  period_length: number;
  language: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch user settings from Supabase
 */
export const fetchUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    console.log('📖 Fetching user settings for:', userId);
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If settings don't exist yet, return null
      if (error.code === 'PGRST116') {
        console.log('ℹ️ No settings found for user, will create default');
        return null;
      }
      console.error('Error fetching user settings:', error);
      throw error;
    }

    console.log('✅ User settings fetched:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch user settings:', error);
    throw error;
  }
};

/**
 * Create or update user settings in Supabase (upsert)
 */
export const saveUserSettings = async (settings: Omit<UserSettings, 'created_at' | 'updated_at'>): Promise<UserSettings> => {
  try {
    console.log('💾 Saving user settings:', settings);
    
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(settings, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }

    console.log('✅ User settings saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to save user settings:', error);
    throw error;
  }
};

/**
 * Update partial user settings in Supabase
 */
export const updateUserSettings = async (
  userId: string,
  updates: Partial<Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserSettings> => {
  try {
    console.log('🔄 Updating user settings:', { userId, updates });
    
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }

    console.log('✅ User settings updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update user settings:', error);
    throw error;
  }
};

/**
 * Create user profile entry after signup
 */
export const createUserProfile = async (userId: string, email: string, name?: string) => {
  try {
    console.log('👤 Creating user profile:', { userId, email, name });
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email,
        name: name || '',
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    console.log('✅ User profile created:', data);
    return data;
  } catch (error) {
    console.error('Failed to create user profile:', error);
    throw error;
  }
};


