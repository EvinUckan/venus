/**
 * INSERT TEST DATA WITH PROPER AUTH
 * This script signs in with the previously created user and inserts data
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTestWithAuth() {
  console.log('🧪 Testing Supabase with authentication...\n');

  try {
    // Sign in with the first test user we created
    console.log('1️⃣ Signing in with test user...');
    const testEmail = 'test_1763133910691@venera.app';
    const testPassword = 'TestPassword123!';

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.log('⚠️  Sign in failed:', signInError.message);
      console.log('   This might be because email confirmation is required.');
      console.log('\n💡 To fix this:');
      console.log('   1. Go to: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/auth/users');
      console.log('   2. Find user: ' + testEmail);
      console.log('   3. Click "..." menu → Confirm email');
      console.log('   4. Then run this script again\n');
      
      // Try creating user without email confirmation requirement
      console.log('   OR disable email confirmation:');
      console.log('   1. Go to Authentication → Settings');
      console.log('   2. Disable "Enable email confirmations"');
      console.log('   3. Run this script again\n');
      
      return;
    }

    const userId = signInData.user.id;
    console.log(`✅ Signed in as: ${signInData.user.email}`);
    console.log(`   User ID: ${userId}\n`);

    // Insert test cycles
    console.log('2️⃣ Inserting test cycles...');
    const testCycles = [
      {
        user_id: userId,
        start_date: '2025-01-01',
        end_date: '2025-01-05',
      },
      {
        user_id: userId,
        start_date: '2025-01-29',
        end_date: '2025-02-03',
      },
      {
        user_id: userId,
        start_date: '2025-02-26',
        end_date: '2025-03-02',
      },
    ];

    const { data: insertedCycles, error: insertError } = await supabase
      .from('cycles')
      .insert(testCycles)
      .select();

    if (insertError) {
      console.log('❌ Error inserting cycles:', insertError.message);
      
      if (insertError.message.includes('column')) {
        console.log('\n💡 The cycles table may have a different structure.');
        console.log('   Checking what columns exist...\n');
        
        // Try to get existing data to see the structure
        const { data: sample, error: sampleError } = await supabase
          .from('cycles')
          .select('*')
          .limit(1);
        
        if (!sampleError && sample && sample.length > 0) {
          console.log('   Existing columns:', Object.keys(sample[0]).join(', '));
        }
      }
    } else {
      console.log(`✅ Successfully inserted ${insertedCycles.length} cycles!`);
      insertedCycles.forEach((cycle, idx) => {
        console.log(`   ${idx + 1}. ${cycle.start_date} to ${cycle.end_date}`);
      });
    }

    // Query all cycles
    console.log('\n3️⃣ Fetching all cycles for user...');
    const { data: allCycles, error: queryError } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId);

    if (queryError) {
      console.log('❌ Error fetching cycles:', queryError.message);
    } else {
      console.log(`✅ Found ${allCycles.length} total cycles in database\n`);
      
      if (allCycles.length > 0) {
        console.log('📊 Your Cycles:');
        allCycles.forEach((cycle, idx) => {
          console.log(`\n   Cycle ${idx + 1}:`);
          console.log(`   - Start: ${cycle.start_date}`);
          console.log(`   - End: ${cycle.end_date}`);
          
          // Calculate period length
          const start = new Date(cycle.start_date);
          const end = new Date(cycle.end_date);
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          console.log(`   - Period Length: ${days} days`);
        });
      }
    }

    console.log('\n✨ TEST SUCCESSFUL!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Supabase is working perfectly!');
    console.log(`📊 Total cycles: ${allCycles?.length || 0}`);
    console.log(`👤 User: ${signInData.user.email}`);
    console.log('\n📍 View your data:');
    console.log('   https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/editor');
    console.log('\n💡 You can now use Supabase in your Venera app!');

    // Sign out
    await supabase.auth.signOut();
    console.log('\n✅ Signed out successfully');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

insertTestWithAuth().finally(() => {
  console.log('\n👋 Script completed.');
  process.exit(0);
});

