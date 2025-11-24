import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_URL || "https://tfpqemhikqavgfmvnfrq.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmcHFlbWhpa3FhdmdmbXZuZnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTkzODAsImV4cCI6MjA3ODY5NTM4MH0.qHYqt6TL83421lV4vlRzTlqMbtalru619B4EQ6LEgcs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("[supabase] client initialized:", supabaseUrl);
console.log("[supabase] Project ID:", process.env.EXPO_PUBLIC_VIBECODE_PROJECT_ID);

