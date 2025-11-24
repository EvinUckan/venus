/**
 * INSERT SIMPLE TEST DATA TO SUPABASE
 * This script inserts minimal test data into the existing cycles table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSimpleTestData() {
  console.log('🧪 Inserting simple test data into Supabase...\n');

  try {
    // Get the current user (from previous test)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('⚠️  No authenticated user found.');
      console.log('   Creating a new test user...\n');
      
      const testEmail = `test_${Date.now()}@venera.app`;
      const testPassword = 'TestPassword123!';
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (authError) {
        console.log('❌ Failed to create user:', authError.message);
        return;
      }
      
      console.log(`✅ Created test user: ${testEmail}`);
      console.log(`   User ID: ${authData.user.id}\n`);
    } else {
      console.log(`✅ Using existing user: ${user.email}`);
      console.log(`   User ID: ${user.id}\n`);
    }

    const userId = user?.id || (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      console.log('❌ Could not get user ID');
      return;
    }

    // First, let's check what columns the cycles table actually has
    console.log('1️⃣ Checking cycles table structure...');
    const { data: existingCycles, error: checkError } = await supabase
      .from('cycles')
      .select('*')
      .limit(1);

    if (checkError) {
      console.log('❌ Error checking table:', checkError.message);
      return;
    }

    console.log('✅ Cycles table is accessible\n');

    // Insert test data with minimal fields
    console.log('2️⃣ Inserting test cycles...');
    
    // Try inserting with just the basic fields
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
      console.log('\n💡 Trying to view existing data instead...\n');
    } else {
      console.log(`✅ Successfully inserted ${insertedCycles.length} cycles!`);
      insertedCycles.forEach((cycle, idx) => {
        console.log(`   ${idx + 1}. Cycle from ${cycle.start_date} to ${cycle.end_date}`);
      });
    }

    // Query all cycles for this user
    console.log('\n3️⃣ Fetching all cycles for user...');
    const { data: allCycles, error: queryError } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (queryError) {
      console.log('❌ Error fetching cycles:', queryError.message);
    } else {
      console.log(`✅ Found ${allCycles.length} total cycles in database`);
      
      if (allCycles.length > 0) {
        console.log('\n📊 Your Cycles:');
        allCycles.forEach((cycle, idx) => {
          const columns = Object.keys(cycle);
          console.log(`\n   Cycle ${idx + 1}:`);
          console.log(`   - ID: ${cycle.id}`);
          console.log(`   - Start Date: ${cycle.start_date}`);
          console.log(`   - End Date: ${cycle.end_date}`);
          
          // Show any additional columns
          columns.forEach(col => {
            if (!['id', 'user_id', 'start_date', 'end_date'].includes(col)) {
              console.log(`   - ${col}: ${cycle[col]}`);
            }
          });
        });
      }
    }

    console.log('\n✨ TEST COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Your Supabase connection is working!');
    console.log(`📊 Total cycles in database: ${allCycles?.length || 0}`);
    console.log('\n📍 View your data at:');
    console.log('   https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/editor');
    console.log('\n💡 Next steps:');
    console.log('   - You can now use these cycles in your Venera app');
    console.log('   - Import functions from src/api/supabase-service.ts');
    console.log('   - See SUPABASE_USAGE_EXAMPLES.md for code examples');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

insertSimpleTestData().finally(() => {
  console.log('\n👋 Script completed.');
  process.exit(0);
});

