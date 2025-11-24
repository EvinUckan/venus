/**
 * CHECK SUPABASE TABLES
 * This script checks what tables exist in your Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n');

  const tablesToCheck = ['cycles', 'diaries', 'user_settings', 'users'];

  for (const table of tablesToCheck) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        console.log(`❌ Table "${table}" does not exist`);
      } else {
        console.log(`⚠️  Table "${table}" exists but has issues: ${error.message}`);
      }
    } else {
      console.log(`✅ Table "${table}" exists`);
      if (data && data.length > 0) {
        console.log(`   Sample columns:`, Object.keys(data[0]).join(', '));
      }
    }
  }

  console.log('\n📋 Recommendation:');
  console.log('Run the SQL script below in your Supabase dashboard to create/update tables:');
  console.log('https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/sql/new');
}

checkTables().finally(() => process.exit(0));

