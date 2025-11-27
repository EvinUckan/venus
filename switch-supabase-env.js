#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-undef */
/**
 * Switch between local and production Supabase
 * Usage: node switch-supabase-env.js [local|production]
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

const LOCAL_CONFIG = `# Local Supabase Configuration (for development)
EXPO_PUBLIC_VIBECODE_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Note: The anon key above is the default local key
# Run 'npx supabase start' to get your actual local keys
`;

const PRODUCTION_CONFIG = `# Production Supabase Configuration
EXPO_PUBLIC_VIBECODE_SUPABASE_URL=https://tfpqemhikqavgfmvnfrq.supabase.co
EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmcHFlbWhpa3FhdmdmbXZuZnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTkzODAsImV4cCI6MjA3ODY5NTM4MH0.qHYqt6TL83421lV4vlRzTlqMbtalru619B4EQ6LEgcs
`;

function switchEnvironment(mode) {
  if (!mode || !['local', 'production'].includes(mode)) {
    console.log('❌ Invalid mode. Usage: node switch-supabase-env.js [local|production]');
    console.log('\nExamples:');
    console.log('  node switch-supabase-env.js local       # Switch to local Supabase');
    console.log('  node switch-supabase-env.js production  # Switch to production Supabase');
    process.exit(1);
  }

  const config = mode === 'local' ? LOCAL_CONFIG : PRODUCTION_CONFIG;
  
  try {
    fs.writeFileSync(envPath, config);
    console.log(`✅ Switched to ${mode.toUpperCase()} Supabase configuration`);
    console.log(`   Updated: ${envPath}`);
    
    if (mode === 'local') {
      console.log('\n📋 Next steps:');
      console.log('   1. Start local Supabase: npx supabase start');
      console.log('   2. Copy the anon key from the output');
      console.log('   3. Update EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY in .env');
      console.log('   4. Restart your app: npm start');
    } else {
      console.log('\n📋 Next steps:');
      console.log('   1. Restart your app: npm start');
      console.log('   2. Your app will now use production Supabase');
    }
    
    console.log('\n⚠️  Important: Restart your development server for changes to take effect!');
  } catch (error) {
    console.error('❌ Error writing .env file:', error.message);
    process.exit(1);
  }
}

// Get mode from command line argument
const mode = process.argv[2];
switchEnvironment(mode);


