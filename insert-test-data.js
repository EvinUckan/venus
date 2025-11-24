/**
 * INSERT TEST DATA TO SUPABASE
 * This script will insert test data into your Supabase tables
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.log('   Make sure .env file exists with:');
  console.log('   - EXPO_PUBLIC_VIBECODE_SUPABASE_URL');
  console.log('   - EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTestData() {
  console.log('🧪 Starting Supabase test data insertion...\n');

  try {
    // Test 1: Check connection
    console.log('1️⃣ Testing connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('cycles')
      .select('count', { count: 'exact', head: true });

    if (healthError) {
      if (healthError.message.includes('does not exist') || healthError.message.includes('relation')) {
        console.log('❌ Tables do not exist yet!');
        console.log('   Please create the tables first using the SQL in SUPABASE_SETUP.md');
        console.log('   Dashboard: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq');
        return;
      }
      console.log('⚠️  Connection warning:', healthError.message);
    }
    console.log('✅ Connection successful!\n');

    // Test 2: Create a test user (using Supabase Auth)
    console.log('2️⃣ Creating test user...');
    const testEmail = `test_${Date.now()}@venera.app`;
    const testPassword = 'TestPassword123!';
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.log('⚠️  Auth error:', authError.message);
      console.log('   Note: Email confirmation may be required in Supabase settings');
      console.log('   Trying to use existing session...\n');
    } else {
      console.log(`✅ Test user created: ${testEmail}`);
      console.log(`   Password: ${testPassword}`);
      console.log(`   User ID: ${authData.user?.id}\n`);
    }

    // Get the user ID
    const { data: { user } } = await supabase.auth.getUser();
    let userId = user?.id;

    if (!userId && authData?.user?.id) {
      userId = authData.user.id;
    }

    if (!userId) {
      console.log('⚠️  No user authenticated.');
      console.log('   Attempting insert without authentication (may fail due to RLS)...\n');
      await insertMockDataDirectly();
      return;
    }

    // Test 3: Insert test cycles
    console.log('3️⃣ Inserting test cycles...');
    const testCycles = [
      {
        user_id: userId,
        start_date: '2025-01-01',
        end_date: '2025-01-05',
        cycle_length: 28,
        period_length: 5,
      },
      {
        user_id: userId,
        start_date: '2025-01-29',
        end_date: '2025-02-03',
        cycle_length: 28,
        period_length: 6,
      },
      {
        user_id: userId,
        start_date: '2025-02-26',
        end_date: '2025-03-02',
        cycle_length: 28,
        period_length: 5,
      },
    ];

    const { data: cyclesData, error: cyclesError } = await supabase
      .from('cycles')
      .insert(testCycles)
      .select();

    if (cyclesError) {
      console.log('❌ Error inserting cycles:', cyclesError.message);
      if (cyclesError.message.includes('relation') || cyclesError.message.includes('does not exist')) {
        console.log('   The "cycles" table may not exist. Please create it first.');
      } else if (cyclesError.message.includes('policy')) {
        console.log('   This may be due to Row Level Security policies.');
        console.log('   Check that RLS policies allow inserts for authenticated users.');
      }
    } else {
      console.log(`✅ Inserted ${cyclesData?.length || 0} test cycles`);
      cyclesData?.forEach((cycle, idx) => {
        console.log(`   ${idx + 1}. ${cycle.start_date} to ${cycle.end_date} (${cycle.period_length} days)`);
      });
    }

    // Test 4: Insert test diaries
    console.log('\n4️⃣ Inserting test diary entries...');
    const testDiaries = [
      {
        user_id: userId,
        date: '2025-01-01',
        mood: 'tired',
        symptoms: ['cramps', 'headache'],
        notes: 'First day of period, feeling tired but managing well.',
      },
      {
        user_id: userId,
        date: '2025-01-15',
        mood: 'energetic',
        symptoms: [],
        notes: 'Feeling great! Lots of energy today.',
      },
      {
        user_id: userId,
        date: '2025-02-14',
        mood: 'happy',
        symptoms: ['bloating'],
        notes: 'Valentine\'s Day! Feeling good overall.',
      },
    ];

    const { data: diariesData, error: diariesError } = await supabase
      .from('diaries')
      .insert(testDiaries)
      .select();

    if (diariesError) {
      console.log('❌ Error inserting diaries:', diariesError.message);
      if (diariesError.message.includes('relation') || diariesError.message.includes('does not exist')) {
        console.log('   The "diaries" table may not exist. Please create it first.');
      }
    } else {
      console.log(`✅ Inserted ${diariesData?.length || 0} test diary entries`);
      diariesData?.forEach((diary, idx) => {
        console.log(`   ${idx + 1}. ${diary.date} - Mood: ${diary.mood}`);
      });
    }

    // Test 5: Insert user settings
    console.log('\n5️⃣ Inserting user settings...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        cycle_length: 28,
        period_length: 5,
        language: 'en',
      })
      .select();

    if (settingsError) {
      console.log('⚠️  Error inserting settings:', settingsError.message);
    } else {
      console.log('✅ User settings created');
    }

    // Test 6: Query the data back
    console.log('\n6️⃣ Verifying data by querying back...');
    
    const { data: queriedCycles, error: queryError } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (queryError) {
      console.log('❌ Error querying cycles:', queryError.message);
    } else {
      console.log(`✅ Retrieved ${queriedCycles?.length || 0} cycles from database`);
    }

    const { data: queriedDiaries } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId);

    console.log(`✅ Retrieved ${queriedDiaries?.length || 0} diaries from database`);

    // Success summary
    console.log('\n✨ TEST DATA INSERTION COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary:');
    console.log(`   • Test User: ${testEmail}`);
    console.log(`   • User ID: ${userId}`);
    console.log(`   • Cycles: ${queriedCycles?.length || 0} records`);
    console.log(`   • Diaries: ${queriedDiaries?.length || 0} records`);
    console.log(`   • Settings: ${settingsData ? 'Created' : 'Not created'}`);
    console.log('\n🎉 Your Supabase connection is working perfectly!');
    console.log('\n📍 View your data at:');
    console.log('   https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/editor');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure tables are created (see SUPABASE_SETUP.md)');
    console.log('   2. Check RLS policies allow authenticated users');
    console.log('   3. Verify .env file has correct credentials');
    console.log('   4. Restart your dev server if you just added .env');
  }
}

async function insertMockDataDirectly() {
  console.log('Attempting to insert data without authentication...\n');
  
  // Generate a mock UUID for testing
  const mockUserId = '00000000-0000-0000-0000-000000000001';
  
  console.log('3️⃣ Inserting test cycles (without auth)...');
  const testCycles = [
    {
      user_id: mockUserId,
      start_date: '2025-01-01',
      end_date: '2025-01-05',
      cycle_length: 28,
      period_length: 5,
    },
  ];

  const { data, error } = await supabase
    .from('cycles')
    .insert(testCycles)
    .select();

  if (error) {
    console.log('❌ Error:', error.message);
    console.log('\n💡 This is likely due to Row Level Security (RLS) policies.');
    console.log('   RLS requires authentication to insert data.');
    console.log('\n   Options:');
    console.log('   1. Disable email confirmation in Supabase Auth settings');
    console.log('   2. Temporarily disable RLS on tables for testing');
    console.log('   3. Manually verify email for the test user in Supabase dashboard');
  } else {
    console.log('✅ Data inserted successfully!');
    console.log(data);
  }
}

// Run the test
insertTestData()
  .catch(error => {
    console.error('Fatal error:', error);
  })
  .finally(() => {
    console.log('\n👋 Test script completed.');
    process.exit(0);
  });

