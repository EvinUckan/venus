# 🎉 Complete Venera App + Supabase Setup Guide

## ✅ What's Ready Right Now

### 1. **App Name** ✓
- "Venera" displayed on main page (TodayScreen)

### 2. **Supabase Package** ✓
- `@supabase/supabase-js` v2.81.1 installed
- Client configured: `src/api/supabase.ts`
- Service functions: `src/api/supabase-service.ts`

### 3. **Environment Variables** ✓
- `.env` file created with credentials
- `.gitignore` updated for security

### 4. **Database Schema** ✓
- Migration file: `supabase/migrations/20250101000000_initial_schema.sql`
- Includes: users, cycles, diaries, user_settings tables
- RLS policies configured
- Performance indexes ready

### 5. **Supabase CLI** ✓
- Initialized: `supabase/config.toml`
- Ready for local development

### 6. **MCP Configuration** ✓
- Supabase MCP: `.cursor/mcp.json`
- Exa MCP for code search
- Ready to use after Cursor restart

---

## 🚀 Quick Start - Build Your Database (3 Options)

### ⭐ OPTION 1: MCP with AI (Easiest - Recommended)

**Step 1:** Restart Cursor
```bash
# Restart Cursor to load MCP configuration
```

**Step 2:** After restart, in this chat or new chat, say:

```
"Apply the migration file supabase/migrations/20250101000000_initial_schema.sql 
to my Supabase project tfpqemhikqavgfmvnfrq"
```

**Step 3:** AI will:
- ✅ Read your migration file
- ✅ Connect to your Supabase project
- ✅ Create all tables
- ✅ Set up RLS policies
- ✅ Create indexes
- ✅ Verify everything works

**That's it!** Your database is ready.

---

### 🐳 OPTION 2: Local Development with Docker

**Prerequisites:** Docker must be installed and running

**Step 1:** Start Local Supabase
```bash
npx supabase start
```

**Step 2:** Apply Migrations
```bash
npx supabase db reset
```

**Step 3:** Update Environment for Local
```bash
node switch-supabase-env.js local
```

**Step 4:** Get local credentials from terminal output and update .env

**Step 5:** Restart your app
```bash
npm start
```

**Benefits:**
- ✅ No email confirmation needed
- ✅ Instant resets
- ✅ Offline development
- ✅ Free unlimited usage

---

### 🌐 OPTION 3: Manual SQL in Dashboard

**Step 1:** Go to SQL Editor
```
https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/sql/new
```

**Step 2:** Copy Migration File
- Open: `supabase/migrations/20250101000000_initial_schema.sql`
- Copy all content (Ctrl+A, Ctrl+C)

**Step 3:** Paste and Run
- Paste in SQL Editor
- Click "Run" button

**Step 4:** Verify Tables Created
- Go to Table Editor
- Check: users, cycles, diaries, user_settings exist

---

## 📊 Your Database Structure

### Tables Created

```
users
├── id (UUID, PK)
├── email (TEXT, unique)
├── name (TEXT)
├── created_at (timestamp)
└── updated_at (timestamp)

cycles
├── id (UUID, PK)
├── user_id (UUID, FK → auth.users)
├── start_date (DATE)
├── end_date (DATE)
├── cycle_length (INTEGER)
├── period_length (INTEGER)
├── created_at (timestamp)
└── updated_at (timestamp)
    Indexes: (user_id), (start_date DESC)

diaries
├── id (UUID, PK)
├── user_id (UUID, FK → auth.users)
├── date (DATE)
├── mood (TEXT)
├── symptoms (TEXT[])
├── notes (TEXT)
├── created_at (timestamp)
└── updated_at (timestamp)
    Indexes: (user_id), (date DESC)

user_settings
├── user_id (UUID, PK, FK → auth.users)
├── cycle_length (INTEGER, default 28)
├── period_length (INTEGER, default 5)
├── language (TEXT, default 'en')
├── created_at (timestamp)
└── updated_at (timestamp)
```

### Security Features

✅ **Row Level Security (RLS)** enabled on all tables
✅ **User-only policies** - Users can only access their own data
✅ **Cascade deletes** - Data cleanup when user deleted
✅ **Auto timestamps** - created_at and updated_at maintained

---

## 🧪 Testing Your Database

### After Database is Built

**1. Insert Test Data**
```bash
node insert-test-with-auth.js
```

This will:
- Create a test user
- Add sample cycles
- Add diary entries
- Add user settings

**2. View in Dashboard**
```
https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/editor
```

**3. Test in Your App**
```bash
npm start
```

Use the service functions:
```typescript
import { fetchUserCycles, addCycleToSupabase } from './src/api/supabase-service';

// Fetch cycles
const cycles = await fetchUserCycles(userId);

// Add cycle
const newCycle = await addCycleToSupabase({
  user_id: userId,
  start_date: '2025-01-01',
  end_date: '2025-01-05',
  cycle_length: 28,
  period_length: 5
});
```

---

## 📁 Project Structure

```
venera-app/
├── .env                                  ✅ Environment variables
├── .cursor/
│   └── mcp.json                         ✅ MCP configuration
├── supabase/
│   ├── config.toml                      ✅ Supabase CLI config
│   ├── migrations/
│   │   └── 20250101000000_initial_schema.sql  ✅ Database schema
│   └── seed.sql                         ✅ Seed data template
├── src/
│   └── api/
│       ├── supabase.ts                  ✅ Supabase client
│       └── supabase-service.ts          ✅ Service functions
├── Documentation/
│   ├── SUPABASE_QUICKSTART.md           ✅ Quick start
│   ├── SUPABASE_SETUP.md                ✅ Complete setup
│   ├── SUPABASE_USAGE_EXAMPLES.md       ✅ Code examples
│   ├── LOCAL_SUPABASE_SETUP.md          ✅ Local development
│   ├── MCP_SETUP.md                     ✅ MCP configuration
│   └── COMPLETE_SETUP_GUIDE.md          ✅ This file
└── Test Scripts/
    ├── insert-test-data.js              ✅ Insert test data
    ├── insert-test-with-auth.js         ✅ Auth + test data
    ├── check-tables.js                  ✅ Verify tables
    └── setup-database-complete.js       ✅ Setup guide
```

---

## 🎯 Next Actions (Choose Your Path)

### Path A: MCP + Remote (Fastest)
1. ✅ Restart Cursor
2. ✅ Say: "Apply migration to Supabase project tfpqemhikqavgfmvnfrq"
3. ✅ Verify in dashboard
4. ✅ Run: `node insert-test-with-auth.js`
5. ✅ Start app: `npm start`

### Path B: Local Development
1. ✅ Install Docker
2. ✅ Run: `npx supabase start`
3. ✅ Run: `npx supabase db reset`
4. ✅ Run: `node switch-supabase-env.js local`
5. ✅ Start app: `npm start`

### Path C: Manual Setup
1. ✅ Copy SQL from migration file
2. ✅ Paste in Supabase SQL Editor
3. ✅ Click Run
4. ✅ Verify tables exist
5. ✅ Start app: `npm start`

---

## 🔧 Useful Commands

### Environment Switching
```bash
node switch-supabase-env.js local       # Switch to local
node switch-supabase-env.js production  # Switch to production
```

### Supabase CLI (Local)
```bash
npx supabase start      # Start local Supabase
npx supabase stop       # Stop local Supabase
npx supabase status     # Check status
npx supabase db reset   # Reset and apply migrations
npx supabase db push    # Push to production
npx supabase db pull    # Pull from production
```

### Testing
```bash
node setup-database-complete.js    # Show setup options
node check-tables.js               # Check table structure
node insert-test-with-auth.js      # Insert test data
```

---

## 🐛 Troubleshooting

### Issue: Tables don't exist
**Solution:** Run database setup (choose option above)

### Issue: Permission denied / RLS error
**Solution:** User must be authenticated, RLS policies require auth.uid()

### Issue: Email not confirmed
**Solution:** 
- Disable email confirmation in Supabase dashboard
- OR confirm email manually in Auth → Users

### Issue: Docker not running (for local)
**Solution:**
- Install Docker Desktop
- Start Docker
- Wait for it to fully start
- Try `npx supabase start` again

### Issue: MCP not connecting
**Solution:**
- Restart Cursor
- Check `.cursor/mcp.json` exists
- Authenticate when prompted

---

## 📚 Documentation Reference

- **Quick Start**: `SUPABASE_QUICKSTART.md`
- **Complete Setup**: `SUPABASE_SETUP.md`
- **Code Examples**: `SUPABASE_USAGE_EXAMPLES.md`
- **Local Development**: `LOCAL_SUPABASE_SETUP.md`
- **MCP Setup**: `MCP_SETUP.md`
- **This Guide**: `COMPLETE_SETUP_GUIDE.md`

---

## 🎉 You're All Set!

**Everything is ready.** Choose your preferred method above and build your database in minutes!

### Recommended: MCP Method (Option 1)
Just restart Cursor and tell me to apply the migration. I'll handle everything! 🚀

---

## 🔗 Important Links

- **Production Dashboard**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq
- **SQL Editor**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/editor
- **Auth Users**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq/auth/users
- **Supabase MCP Docs**: https://supabase.com/docs/guides/getting-started/mcp
- **Exa MCP Docs**: https://docs.exa.ai/reference/exa-mcp

---

**Ready when you are!** Just tell me which method you want to use. 🎊



