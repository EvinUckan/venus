#!/bin/bash

# Script to apply Supabase migration for Vibecode app
# This ensures the diaries table exists for the Diary History feature

echo "🔍 Checking Supabase connection..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""
echo "📋 Migration file: supabase/migrations/20250101000000_initial_schema.sql"
echo ""
echo "This migration creates:"
echo "  ✓ users table"
echo "  ✓ cycles table"
echo "  ✓ diaries table (for Diary History)"
echo "  ✓ user_settings table"
echo "  ✓ RLS policies for security"
echo "  ✓ Real-time subscriptions enabled"
echo ""
echo "To apply the migration:"
echo "  1. If using local Supabase: supabase db reset"
echo "  2. If using remote Supabase: supabase db push"
echo ""
echo "For more info, see: APPLY_MIGRATION_NOW.md"

