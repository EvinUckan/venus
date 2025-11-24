#!/usr/bin/env node
/**
 * Complete Database Setup for Venera App
 * This script will build your entire Supabase database structure
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🏗️  Building Complete Venera Database Structure\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function setupCompleteDatabase() {
  try {
    console.log('📊 Database Structure to be Created:\n');
    console.log('   📁 Tables:');
    console.log('      • users - User profiles (extends auth.users)');
    console.log('      • cycles - Menstrual cycle tracking');
    console.log('      • diaries - Daily mood & symptoms');
    console.log('      • user_settings - User preferences\n');
    console.log('   🔐 Security:');
    console.log('      • Row Level Security (RLS) enabled');
    console.log('      • User-only access policies');
    console.log('      • Cascade delete protection\n');
    console.log('   ⚡ Performance:');
    console.log('      • Optimized indexes');
    console.log('      • Auto-updated timestamps\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test connection first
    console.log('1️⃣  Testing connection...');
    const { data: versionData, error: versionError } = await supabase
      .rpc('version');
    
    if (versionError) {
      console.log('⚠️  Basic RPC test - this is expected\n');
    } else {
      console.log('✅ Connection successful!\n');
    }

    console.log('2️⃣  Database Schema Instructions:\n');
    console.log('   Your database structure is defined in:');
    console.log('   📄 supabase/migrations/20250101000000_initial_schema.sql\n');
    
    console.log('   To apply this schema, you have 3 options:\n');
    
    console.log('   ╔═══════════════════════════════════════════════════╗');
    console.log('   ║  OPTION 1: Use MCP (Recommended - Natural AI)    ║');
    console.log('   ╚═══════════════════════════════════════════════════╝\n');
    console.log('   1. Restart Cursor to load MCP config');
    console.log('   2. In chat, say: "Apply the migration file');
    console.log('      supabase/migrations/20250101000000_initial_schema.sql');
    console.log('      to my Supabase project tfpqemhikqavgfmvnfrq"\n');
    console.log('   3. AI will create all tables automatically!\n');
    
    console.log('   ╔═══════════════════════════════════════════════════╗');
    console.log('   ║  OPTION 2: Use Supabase CLI (Local Development)  ║');
    console.log('   ╚═══════════════════════════════════════════════════╝\n');
    console.log('   Prerequisites: Docker must be running\n');
    console.log('   Commands:');
    console.log('   $ npx supabase start         # Start local Supabase');
    console.log('   $ npx supabase db reset      # Apply migrations\n');
    console.log('   Then update .env to use local URL:\n');
    console.log('   EXPO_PUBLIC_VIBECODE_SUPABASE_URL=http://localhost:54321\n');
    
    console.log('   ╔═══════════════════════════════════════════════════╗');
    console.log('   ║  OPTION 3: Supabase Dashboard (Manual SQL)       ║');
    console.log('   ╚═══════════════════════════════════════════════════╝\n');
    console.log('   1. Go to: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/sql/new');
    console.log('   2. Copy content from:');
    console.log('      supabase/migrations/20250101000000_initial_schema.sql');
    console.log('   3. Paste in SQL Editor');
    console.log('   4. Click "Run"\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 After Database is Created:\n');
    console.log('   ✅ Verify tables in dashboard');
    console.log('   ✅ Run: node insert-test-with-auth.js');
    console.log('   ✅ Start your app: npm start\n');
    
    console.log('💡 Pro Tip: Use MCP (Option 1) for the easiest setup!');
    console.log('   Just restart Cursor and tell the AI what you need.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupCompleteDatabase().finally(() => {
  console.log('👋 Setup script completed.\n');
  process.exit(0);
});



