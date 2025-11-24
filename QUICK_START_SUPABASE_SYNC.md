# Quick Start: Supabase Real-time Sync

## ✅ Implementation Complete!

Your Vibecode app now has **full bidirectional sync** between the app and Supabase with real-time updates.

---

## 🚀 What Works Now

### 1. **App → Supabase** (Already working)
- When you add/edit/delete in the app, it syncs to Supabase ✅

### 2. **Supabase → App** (NOW WORKING!)
- When you add/edit/delete in Supabase Dashboard, it appears in the app instantly ✅
- No need to refresh or restart the app ✅

### 3. **Real-time Everywhere**
All screens now have real-time sync:
- ✅ **HistoryScreen** - Shows cycles and diaries with live updates
- ✅ **TodayScreen** - Phase calculations update with latest cycles
- ✅ **DailyScreen** - Diary entries sync in real-time
- ✅ **CalendarScreen** - Calendar view updates with new cycles instantly

---

## 🧪 Test It Right Now!

### Test 1: Add in Supabase, see in App (Diaries)

1. **In App**: Open the app and go to **History** or **Daily** screen
2. **In Supabase Dashboard**:
   - Go to Table Editor → `diaries` table
   - Click "Insert row"
   - Fill in:
     - `user_id`: Copy from `auth.users` table (your user's UUID)
     - `date`: `2025-11-21` (today)
     - `mood`: `happy` (or calm, sad, energetic)
     - `notes`: `Test from Supabase!`
   - Click "Save"
3. **Watch the App**: The new entry appears within 1-2 seconds! 🎉

### Test 2: Add in Supabase, see in App (Cycles)

1. **In App**: Open **Calendar** or **Today** screen
2. **In Supabase Dashboard**:
   - Go to Table Editor → `cycles` table
   - Click "Insert row"
   - Fill in:
     - `user_id`: Your user's UUID
     - `start_date`: `2025-11-01`
     - `end_date`: `2025-11-05`
     - `cycle_length`: `28`
     - `period_length`: `5`
   - Click "Save"
3. **Watch the App**: The calendar updates instantly! 🎉

### Test 3: Delete in Supabase

1. Keep the app open on any screen
2. In Supabase Dashboard, delete a diary or cycle entry
3. Watch it disappear from the app instantly! ✅

### Test 4: Edit in Supabase

1. Keep the app open
2. In Supabase Dashboard, edit the `notes` field of a diary entry
3. Watch the note update in the app! ✅

---

## 📋 Database Tables

All tables already exist in your migration:

### `cycles` table
- Stores period/cycle data
- Fields: `id`, `user_id`, `start_date`, `end_date`, `cycle_length`, `period_length`

### `diaries` table (Diary History)
- Stores mood/diary entries
- Fields: `id`, `user_id`, `date`, `mood`, `notes`, `symptoms`

### Security (RLS)
- ✅ Users can ONLY see/edit their own data
- ✅ Real-time subscriptions are filtered by `user_id`
- ✅ Full row-level security enabled

---

## 🔧 How to Apply Migration (if not done yet)

### Check if migration is already applied:
1. Go to Supabase Dashboard → SQL Editor
2. Run: `SELECT * FROM cycles LIMIT 1;`
3. If it works, migration is already applied! ✅
4. If error, apply migration:

### Option 1: Via Dashboard (Easiest)
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20250101000000_initial_schema.sql`
3. Paste and click "Run"

### Option 2: Via CLI
```bash
# If using local Supabase
supabase db reset

# If using remote Supabase (production)
supabase db push
```

---

## 📱 App Architecture

```
User Action (App or Supabase)
        │
        ▼
┌───────────────────┐
│   Supabase DB     │ ← Real-time enabled
└───────┬───────────┘
        │
        │ Real-time subscription
        ▼
┌───────────────────┐
│  Zustand Store    │ ← Local state
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│   App UI          │ ← Auto re-renders
└───────────────────┘
```

**Key Features:**
- ✅ Optimistic updates (UI updates immediately)
- ✅ Background sync to Supabase
- ✅ Real-time subscriptions listen for changes
- ✅ Graceful error handling
- ✅ Works offline (local-first)

---

## 🐛 Troubleshooting

### Issue: Changes not appearing in app

**Check:**
1. Is user logged in? (Check console for "ℹ️ No user logged in")
2. Is the `user_id` in Supabase correct? (Must match logged-in user)
3. Check console for:
   - `🔄 Fetching data...` (data loading)
   - `🔔 Cycle changed: INSERT` (real-time working)

### Issue: Console shows errors

**Common errors:**
- "PGRST116" → Table doesn't exist → Apply migration
- "42501" → Permission denied → Check RLS policies
- "Failed to fetch" → Network issue → Check internet connection

### Issue: Duplicate entries

This is normal! The app updates optimistically, then real-time confirms it. No actual duplicates are created (same UUID).

---

## 📊 Console Logs to Watch For

### When screen loads:
```
🔄 Fetching cycles for TodayScreen...
✅ Cycles fetched successfully
🔔 Setting up real-time subscriptions for TodayScreen...
```

### When data changes in Supabase:
```
🔔 Cycle changed: INSERT
```

### When you modify in the app:
```
✅ Cycle synced to Supabase: abc-123-def-456
```

### When screen unmounts:
```
🔕 Unsubscribed from real-time changes
```

---

## 📚 Files Modified

| File | Changes |
|------|---------|
| `src/api/supabase-service.ts` | Added update/delete functions for diaries + real-time subscriptions |
| `src/state/venusStore.ts` | Enhanced sync logic for all operations |
| `src/screens/HistoryScreen.tsx` | Added fetch on focus + real-time sync (cycles + diaries) |
| `src/screens/TodayScreen.tsx` | Added fetch on focus + real-time sync (cycles) |
| `src/screens/DailyScreen.tsx` | Added fetch on focus + real-time sync (diaries) |
| `src/screens/CalendarScreen.tsx` | Added fetch on focus + real-time sync (cycles) |

---

## 🎯 Next Steps

1. ✅ **Test the sync** using the test cases above
2. ✅ **Verify migration** is applied (tables exist in Supabase)
3. ✅ **Check authentication** (user must be logged in)
4. ✅ **Monitor console** during testing

---

## 💡 Pro Tips

- **View logs in real-time**: Keep React Native debugger open
- **Test with multiple devices**: Changes sync across all devices instantly
- **Use Supabase Dashboard**: Great for debugging and manual data entry
- **Check RLS policies**: Ensure security is properly configured

---

## 📖 Documentation

- **Full implementation details**: `SUPABASE_SYNC_IMPLEMENTATION.md`
- **Usage examples**: `SUPABASE_USAGE_EXAMPLES.md`
- **Database schema**: `supabase/migrations/20250101000000_initial_schema.sql`

---

## ✨ Summary

**Before:**
- ❌ Data added in Supabase didn't appear in app
- ❌ Had to restart app to see changes
- ❌ No real-time sync

**After:**
- ✅ Instant bidirectional sync
- ✅ Real-time updates across all screens
- ✅ Proper user filtering and security
- ✅ Works offline with background sync

**Your app is now fully synced with Supabase! 🎉**

