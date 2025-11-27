# Environment Variables Configuration

## Quick Setup

To enable Supabase in your Venera app, add these environment variables to your `.env` file in the project root:

```env
EXPO_PUBLIC_VIBECODE_SUPABASE_URL=https://tfpqemhikqavgfmvnfrq.supabase.co
EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmcHFlbWhpa3FhdmdmbXZuZnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTkzODAsImV4cCI6MjA3ODY5NTM4MH0.qHYqt6TL83421lV4vlRzTlqMbtalru619B4EQ6LEgcs
```

## Manual Setup (if .env doesn't work)

1. **Open Terminal**
2. **Export environment variables** (for the current session):

```bash
export EXPO_PUBLIC_VIBECODE_SUPABASE_URL="https://tfpqemhikqavgfmvnfrq.supabase.co"
export EXPO_PUBLIC_VIBECODE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmcHFlbWhpa3FhdmdmbXZuZnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTkzODAsImV4cCI6MjA3ODY5NTM4MH0.qHYqt6TL83421lV4vlRzTlqMbtalru619B4EQ6LEgcs"
```

3. **Start Expo** in the same terminal session:

```bash
npm start
```

## Verification

After setting up environment variables, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

The Supabase client will automatically use these credentials when you import it:

```typescript
import { supabase } from './src/api/supabase';
```

## Security Notes

⚠️ **Important**:
- Never commit your `.env` file to git
- The `.env` file is already in `.gitignore`
- The ANON key is safe for client-side use (it's public)
- Sensitive operations should use Row Level Security (RLS) in Supabase

## Next Steps

1. Create `.env` file with the above credentials
2. Restart your development server
3. Follow the setup guide in `SUPABASE_SETUP.md`
4. Create database tables in Supabase dashboard
5. Test the connection using the examples provided


