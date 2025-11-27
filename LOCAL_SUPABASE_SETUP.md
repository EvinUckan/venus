# 🏠 Local Supabase Setup Guide

## Prerequisites

### 1. Install Docker Desktop

Supabase CLI requires Docker to run locally. Download and install:

- **Windows/Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

After installation:
1. Start Docker Desktop (or Docker service on Linux)
2. Verify it's running: `docker --version`

---

## ✅ What's Already Set Up

Your local Supabase configuration is ready:

```
supabase/
├── config.toml                           # Supabase configuration
├── migrations/
│   └── 20250101000000_initial_schema.sql # Database schema
└── seed.sql                              # Test data (optional)
```

---

## 🚀 Quick Start (Once Docker is Running)

### Step 1: Start Local Supabase

```bash
npx supabase start
```

This will:
- Download necessary Docker images (first time only)
- Start PostgreSQL, PostgREST, Auth, Storage, and other services
- Run your migrations automatically
- Give you local API credentials

**Expected output:**
```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJh...
service_role key: eyJh...
```

### Step 2: Update Environment Variables for Local Development

Create a `.env.local` file:

```bash
# Local Supabase (for development)
EXPO_PUBLIC_VIBECODE_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY=<anon_key_from_start_command>
```

Or update your existing `.env`:

```bash
# Comment out production and use local:
# EXPO_PUBLIC_VIBECODE_SUPABASE_URL=https://tfpqemhikqavgfmvnfrq.supabase.co
# EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY=eyJhbGc...

# Local development
EXPO_PUBLIC_VIBECODE_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY=<anon_key_from_start_command>
```

### Step 3: Open Supabase Studio

Open your browser to: **http://localhost:54323**

This is your local Supabase dashboard where you can:
- View and edit tables
- Run SQL queries
- Manage authentication
- View logs

### Step 4: Create Test User and Data

Run the test script:

```bash
node insert-test-data.js
```

Or create a user through the Studio interface.

---

## 📝 Available Commands

### Start Supabase
```bash
npx supabase start
```

### Stop Supabase
```bash
npx supabase stop
```

### Check Status
```bash
npx supabase status
```

### View Logs
```bash
npx supabase logs
```

### Reset Database (⚠️ Deletes all data)
```bash
npx supabase db reset
```

### Create New Migration
```bash
npx supabase migration new migration_name
```

### Link to Remote Project (Optional)
```bash
npx supabase link --project-ref tfpqemhikqavgfmvnfrq
```

---

## 🔄 Development Workflow

### Daily Development

1. **Start Supabase**:
   ```bash
   npx supabase start
   ```

2. **Start Your App**:
   ```bash
   npm start
   ```

3. **Make Changes**: Edit your app, test locally

4. **Stop Supabase** (when done):
   ```bash
   npx supabase stop
   ```

### Making Database Changes

1. **Create Migration**:
   ```bash
   npx supabase migration new add_new_feature
   ```

2. **Edit Migration**: Update `supabase/migrations/[timestamp]_add_new_feature.sql`

3. **Apply Migration**:
   ```bash
   npx supabase db reset  # Applies all migrations
   ```

4. **Test Changes** in your app

### Syncing with Production

#### Push Local Changes to Production
```bash
npx supabase db push
```

#### Pull Production Schema to Local
```bash
npx supabase db pull
```

---

## 🎯 Testing Your Local Setup

### Test Script (Without Docker Running Yet)

We've created a test script that will work once Supabase is running. 

**Test connection**:
```bash
node insert-test-data.js
```

### Manual Test in Supabase Studio

1. Go to: http://localhost:54323
2. Navigate to **Table Editor**
3. Click **SQL Editor**
4. Run:
   ```sql
   SELECT * FROM public.cycles;
   ```

---

## 🔧 Configuration Files

### supabase/config.toml

This file contains all Supabase configuration. Key settings:

```toml
[api]
port = 54321

[db]
port = 54322

[studio]
port = 54323

[auth]
site_url = "http://localhost:3000"
enable_signup = true
```

You can customize these settings as needed.

---

## 🌐 Local vs Production

### Local Development (Recommended)
- ✅ No email confirmation required
- ✅ Faster iteration
- ✅ Free and unlimited
- ✅ Works offline
- ✅ Can reset data anytime
- ❌ Requires Docker

### Production (Your Cloud Project)
- ✅ Always available
- ✅ Shared across devices
- ✅ Automatic backups
- ✅ No Docker needed
- ❌ Email confirmation required
- ❌ Has usage limits

### Best Practice: Use Both!

1. **Develop locally** with `npx supabase start`
2. **Test thoroughly** with local data
3. **Push changes** to production when ready
4. **Use production** for staging/live apps

---

## 🐛 Troubleshooting

### Docker not running
**Error**: `Cannot connect to the Docker daemon`

**Solution**: 
1. Install Docker Desktop
2. Start Docker Desktop
3. Wait for it to fully start (watch icon in taskbar)
4. Try `npx supabase start` again

### Port already in use
**Error**: `Port 54321 is already allocated`

**Solution**:
```bash
# Stop Supabase
npx supabase stop

# Check if containers are still running
docker ps

# Force stop all Supabase containers
docker stop $(docker ps -q --filter "name=supabase")

# Start again
npx supabase start
```

### Migrations not applying
**Solution**:
```bash
# Reset database (⚠️ deletes all data)
npx supabase db reset
```

### Need to start fresh
```bash
# Stop everything
npx supabase stop

# Remove all data
npx supabase db reset

# Start again
npx supabase start
```

---

## 📊 Database Schema

Your local database includes:

### Tables
- `public.users` - User profiles
- `public.cycles` - Menstrual cycle records
- `public.diaries` - Daily mood and symptom entries
- `public.user_settings` - User preferences

### Features
- ✅ Row Level Security (RLS) enabled
- ✅ Automatic timestamps
- ✅ Foreign key constraints
- ✅ Performance indexes
- ✅ Cascade deletes

---

## 🎉 Benefits of Local Development

1. **No Email Confirmation**: Test users work immediately
2. **Fast Iteration**: Instant database resets
3. **Offline Development**: Work without internet
4. **Free Unlimited Usage**: No quotas or limits
5. **Safe Testing**: Can't break production
6. **Full Control**: Modify anything without restrictions

---

## 📚 Next Steps

Once Docker is running:

1. **Start Supabase**: `npx supabase start`
2. **Update .env**: Use local credentials
3. **Restart your app**: `npm start`
4. **Create test user**: Run `node insert-test-data.js`
5. **Start coding**: Everything works locally!

---

## 🔗 Useful Links

- **Local Studio**: http://localhost:54323 (when running)
- **Local API**: http://localhost:54321 (when running)
- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli
- **Local Development Guide**: https://supabase.com/docs/guides/cli/local-development
- **Your Production**: https://supabase.com/dashboard/project/tfpqemhikqavgfmvnfrq

---

## 💡 Pro Tips

1. **Keep Supabase running**: No need to stop/start between app restarts
2. **Use Studio**: Easier than SQL for quick edits
3. **Commit migrations**: Track schema changes in git
4. **Test locally first**: Then push to production
5. **Use seed data**: For consistent test scenarios

---

## ⚡ Quick Reference

```bash
# Start local Supabase
npx supabase start

# Stop local Supabase  
npx supabase stop

# Check status
npx supabase status

# Reset database
npx supabase db reset

# Open Studio
open http://localhost:54323

# View logs
npx supabase logs
```

---

**Ready to go!** Just install Docker, run `npx supabase start`, and you're all set! 🚀


