# 🤖 MCP Setup for Supabase Database Development

## Overview

Model Context Protocol (MCP) allows AI assistants to directly interact with your Supabase project, making database development faster and more intuitive. This guide integrates MCP with your Venera app development.

---

## 🔧 MCP Servers Configured

### 1. **Supabase MCP** 
Connect AI tools directly to your Supabase project for:
- Creating and modifying tables
- Writing SQL queries
- Managing database schema
- Setting up RLS policies
- Testing database operations

**URL**: `https://mcp.supabase.com/mcp`
**Project**: `tfpqemhikqavgfmvnfrq`

### 2. **Exa MCP** (Code Search)
Get real-time code examples and documentation:
- React Native best practices
- Supabase integration patterns
- TypeScript examples
- Database design patterns

**URL**: `https://mcp.exa.ai/mcp?tools=get_code_context_exa,web_search_exa`

---

## 📋 Setup Steps

### Step 1: MCP Configuration (Already Done! ✅)

Your MCP configuration is saved in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp"
    },
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp?tools=get_code_context_exa,web_search_exa",
      "headers": {}
    }
  }
}
```

### Step 2: Authenticate with Supabase MCP

1. **Restart Cursor** to load the new MCP configuration
2. **Grant access** when prompted - a browser window will open
3. **Select your organization** that contains project `tfpqemhikqavgfmvnfrq`
4. **Authorize** the MCP connection

### Step 3: Test the Connection

After authentication, you can ask the AI assistant:

```
"Show me all tables in my Supabase project tfpqemhikqavgfmvnfrq"
```

or

```
"Create the cycles table in my Supabase database with the schema from our migrations"
```

---

## 🗄️ Building Your Database Structure with MCP

### Using Natural Language Commands

Once MCP is connected, you can build your entire database using natural language:

#### 1. **Create the Users Table**
```
"In my Supabase project tfpqemhikqavgfmvnfrq, create a users table that extends auth.users with columns:
- id (UUID, primary key, references auth.users)
- email (TEXT, unique, not null)
- name (TEXT)
- created_at and updated_at timestamps"
```

#### 2. **Create the Cycles Table**
```
"Create a cycles table in project tfpqemhikqavgfmvnfrq with:
- id (UUID primary key)
- user_id (UUID, references auth.users)
- start_date (DATE, not null)
- end_date (DATE, not null)
- cycle_length (INTEGER)
- period_length (INTEGER)
- timestamps
- index on user_id and start_date
Enable RLS with policies for user access only"
```

#### 3. **Create the Diaries Table**
```
"Create a diaries table with:
- id (UUID primary key)
- user_id (UUID, references auth.users)
- date (DATE, not null)
- mood (TEXT)
- symptoms (TEXT array)
- notes (TEXT)
- timestamps
- index on user_id and date
Enable RLS for user privacy"
```

#### 4. **Create User Settings Table**
```
"Create a user_settings table with:
- user_id (UUID primary key, references auth.users)
- cycle_length (INTEGER, default 28)
- period_length (INTEGER, default 5)
- language (TEXT, default 'en')
- timestamps
Enable RLS"
```

---

## 🎯 Quick Commands to Try

### Database Schema
```
"Apply the migration file supabase/migrations/20250101000000_initial_schema.sql to my Supabase project"
```

### Query Data
```
"Show me all cycles for user [user_id]"
```

### Add Test Data
```
"Insert 3 test cycles for user [user_id] with dates in January, February, and March 2025"
```

### Check RLS Policies
```
"Show me all RLS policies on the cycles table"
```

### Create Indexes
```
"Create a performance index on cycles table for start_date descending"
```

---

## 🔄 Workflow: Local + Remote Development

### Option 1: MCP with Remote (Production)
```
1. Use MCP to modify your remote Supabase project
2. Pull changes to local: npx supabase db pull
3. Test locally
4. Commit migrations to git
```

### Option 2: Local Development First
```
1. Develop locally: npx supabase start
2. Create migrations: npx supabase migration new feature_name
3. Test locally
4. Push to remote: npx supabase db push
5. Use MCP to verify remote changes
```

### Option 3: MCP-Driven Development (Recommended)
```
1. Use MCP to describe changes in natural language
2. AI creates and applies migrations
3. Pull to local: npx supabase db pull
4. Test locally: npx supabase db reset
5. Commit to git
```

---

## 🛡️ Security Best Practices (From Supabase Docs)

### ⚠️ Important Security Notes:

1. **Don't connect to production** - Use development projects only
2. **Read-only mode** - Enable for safer operations
3. **Manual approval** - Always review SQL before execution
4. **Project scoping** - Limit access to specific project
5. **No customer access** - MCP uses your dev permissions

### Enable Read-Only Mode

Update MCP config for read-only access:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?readonly=true"
    }
  }
}
```

---

## 🚀 Using MCP to Build Your Venera Database

### Complete Database Setup Command

Once MCP is connected, you can run:

```
"I need to set up a complete database for a period tracking app called Venera. 
Create these tables in my Supabase project tfpqemhikqavgfmvnfrq:

1. users table extending auth.users
2. cycles table with user_id, start_date, end_date, cycle_length, period_length
3. diaries table with user_id, date, mood, symptoms array, notes
4. user_settings table with user_id, cycle_length, period_length, language

All tables should have:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Row Level Security enabled
- Policies allowing users to only access their own data
- Appropriate indexes for performance
- Cascade delete on user removal
- Updated_at triggers

Also create these indexes:
- cycles: (user_id), (start_date DESC)
- diaries: (user_id), (date DESC)"
```

The AI with MCP will:
1. ✅ Create all tables with proper schema
2. ✅ Set up foreign key relationships
3. ✅ Enable Row Level Security
4. ✅ Create RLS policies
5. ✅ Add performance indexes
6. ✅ Set up triggers for timestamps

---

## 📊 Verify Database Structure

After MCP creates your database, verify with:

```
"Show me the complete schema for all tables in project tfpqemhikqavgfmvnfrq including columns, constraints, and indexes"
```

Or:

```
"List all RLS policies for the cycles, diaries, and user_settings tables"
```

---

## 🔍 Using Exa MCP for Code Examples

With Exa MCP configured, you can ask:

```
"Show me examples of using Supabase RLS policies with React Native"
```

```
"Find best practices for storing menstrual cycle data in PostgreSQL"
```

```
"Get documentation for Supabase real-time subscriptions in TypeScript"
```

---

## 🎨 Example Workflow

### 1. **Start a Chat with AI Assistant**

### 2. **Build Database Schema**
```
"Using MCP, create my Venera app database structure in Supabase project tfpqemhikqavgfmvnfrq based on the migration file at supabase/migrations/20250101000000_initial_schema.sql"
```

### 3. **Add Test Data**
```
"Create a test user and add 3 sample cycles with dates in 2025"
```

### 4. **Verify Everything**
```
"Show me all tables, their row counts, and verify RLS policies are working"
```

### 5. **Pull to Local**
```bash
npx supabase db pull
```

### 6. **Test Locally**
```bash
npx supabase db reset
node insert-test-data.js
```

---

## 🔗 Integration with Your App

Once database is set up via MCP, your app code (already created) will work:

```typescript
// Your existing code in src/api/supabase-service.ts
import { supabase } from './supabase';

// These functions will now work with your MCP-created database
const cycles = await fetchUserCycles(userId);
const newCycle = await addCycleToSupabase({...});
```

---

## 🐛 Troubleshooting

### MCP Not Connecting
```
1. Restart Cursor
2. Check .cursor/mcp.json exists
3. Try manual authentication
4. Check Supabase dashboard permissions
```

### Authentication Failed
```
1. Go to https://supabase.com/dashboard
2. Settings → Access Tokens
3. Generate new token if needed
4. Update MCP config
```

### Tables Not Creating
```
"Show me any errors from the last SQL execution"
"Check if my Supabase project is accessible"
```

---

## 📚 References

- **Supabase MCP Docs**: https://supabase.com/docs/guides/getting-started/mcp
- **Exa MCP Docs**: https://docs.exa.ai/reference/exa-mcp
- **MCP Tools**: https://ref.tools/mcp
- **Your Project**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq

---

## ✨ Next Steps

1. **Restart Cursor** to load MCP configuration
2. **Authenticate** with Supabase MCP
3. **Run the database setup command** (see above)
4. **Verify tables** in Supabase dashboard
5. **Test with your app** using existing service functions
6. **Add test data** via MCP or scripts
7. **Pull to local** for offline development

---

## 🎉 Benefits of Using MCP

✅ **Natural language** - Describe what you want, AI creates it
✅ **No SQL required** - AI writes optimized SQL for you
✅ **Instant setup** - Create entire database in minutes
✅ **Best practices** - AI follows Supabase conventions
✅ **Error handling** - AI fixes issues automatically
✅ **Documentation** - AI explains what it's doing
✅ **Rapid iteration** - Make changes through conversation

---

**You're ready to build your database with MCP!** 🚀

