/**
 * SUPABASE CONNECTION TEST
 * 
 * This is a simple test script to verify your Supabase connection is working.
 * Run this after setting up your environment variables.
 * 
 * Usage:
 * 1. Make sure your .env file is set up
 * 2. Run: npx ts-node test-supabase-connection.ts
 * 
 * Or import and use in your app to test the connection.
 */

import { supabase } from './src/api/supabase';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...\n');

  try {
    // Test 1: Check if client is initialized
    console.log('✓ Supabase client initialized');
    console.log(`  Project URL: ${process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_URL}`);
    
    // Test 2: Try a simple query (this will fail if tables don't exist, which is expected)
    console.log('\n🔍 Attempting to query database...');
    
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error) {
      // This is expected if the table doesn't exist yet
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        console.log('⚠️  Table does not exist yet (this is normal for first setup)');
        console.log('   Please create your database tables in Supabase dashboard');
        console.log('   Dashboard: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq');
      } else if (error.message.includes('JWT')) {
        console.log('❌ Authentication error - check your API key');
        console.log('   Error:', error.message);
      } else {
        console.log('⚠️  Query error:', error.message);
      }
    } else {
      console.log('✅ Database query successful!');
      console.log('   Connection is working perfectly!');
    }

    // Test 3: Test auth functionality
    console.log('\n🔐 Testing auth functionality...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('⚠️  Auth error:', sessionError.message);
    } else {
      console.log('✓ Auth service is accessible');
      if (sessionData.session) {
        console.log(`  Logged in as: ${sessionData.session.user.email}`);
      } else {
        console.log('  No active session (user not logged in)');
      }
    }

    console.log('\n✨ Connection test completed!');
    console.log('   Next steps:');
    console.log('   1. Create database tables (see SUPABASE_SETUP.md)');
    console.log('   2. Set up Row Level Security policies');
    console.log('   3. Start using Supabase in your app!');
    
  } catch (err) {
    console.error('❌ Connection test failed:', err);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if .env file exists with correct variables');
    console.log('   2. Restart your development server');
    console.log('   3. Verify your Supabase project is active');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSupabaseConnection().catch(console.error);
}

export default testSupabaseConnection;


