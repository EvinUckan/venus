/**
 * Auth Helper
 * Provides automatic authentication for users
 */

import { supabase } from '../lib/supabase';

let isAuthInitialized = false;

/**
 * Initialize authentication - creates test user if not already signed in
 */
export const initializeAuth = async () => {
  if (isAuthInitialized) {
    console.log("[auth] Already initialized");
    return;
  }

  try {
    // Check if user is already signed in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      console.log("[auth] ✅ User already signed in:", session.user.id);
      isAuthInitialized = true;
      return session.user;
    }

    // Try to sign in with test credentials
    console.log("[auth] Attempting to sign in with test user...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@venera.app',
      password: 'testpassword123',
    });

    if (signInData?.user) {
      console.log("[auth] ✅ Signed in with test user:", signInData.user.id);
      isAuthInitialized = true;
      return signInData.user;
    }

    // If sign in failed, try to create the test user
    if (signInError) {
      console.log("[auth] Creating new test user...");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'test@venera.app',
        password: 'testpassword123',
        options: {
          data: {
            name: 'Test User'
          }
        }
      });

      if (signUpError) {
        console.error("[auth] ❌ Failed to create test user:", signUpError.message);
        throw signUpError;
      }

      console.log("[auth] ✅ Test user created:", signUpData.user?.id);
      isAuthInitialized = true;
      return signUpData.user;
    }

  } catch (error) {
    console.error("[auth] ❌ Authentication failed:", error);
    // Continue without auth - app will work with local storage only
  }
};

/**
 * Get current authenticated user
 */
export const getAuthUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch (error) {
    console.error("[auth] Failed to get user:", error);
    return null;
  }
};

