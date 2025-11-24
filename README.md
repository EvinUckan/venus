# Venus - Menstrual Cycle Tracker

A beautiful, luxurious mobile app for tracking menstrual cycles, built with React Native and Expo.

## Features

### 🔐 Authentication
- **Email-based authentication** with Supabase
- **Secure login and signup** with validation
- Password visibility toggle
- Clean, feminine design with gradient backgrounds
- Automatic session management

### ✨ Onboarding Experience
- **3-step personalized setup** after authentication
- **Step 1**: Welcome and name collection
- **Step 2**: Average cycle length (21-45 days)
- **Step 3**: Average period length (2-10 days)
- Progress indicators with dots
- Clean, minimal design with validation
- Only shown on first app launch after signup/login

### 🏠 Today Screen (Home)
- **Compact circular menstrual phase chart** with Stardust-inspired design
  - **Clean, minimal design** - 240px size with no background card
  - **4 pastel color-coded phases with smooth blending**:
    - Menstrual: soft pink (#F7B2D9)
    - Follicular: lavender-purple (#C7B0F8)
    - Ovulation: mint green (#9CF7D1)
    - Luteal: peach (#F7C8A5)
  - **No phase labels on ring** - clean circular design
  - **Simple white dot indicator** showing current day position on the ring
  - **No day numbers** - clean, minimalist circular design
  - **Center displays**:
    - "TODAY" label at top
    - Current phase name in bold large text
    - "Day X / cycle length" in pink below
  - **Phase legend in single row** - smaller dots and text, all 4 phases fit on one line below chart
  - **Dynamically syncs** with calendar period data
- **Personalized greeting** with user's name and white sparkle icon
- **Soft pink background** (#FDEEF4) creating a calm, feminine aesthetic
- **7-day mini calendar** with clean pink highlighting (no shadows)
- **Display next period countdown and ovulation prediction** with accurate calculations
  - Properly handles cycles that have passed their expected date
  - Always shows future dates, never negative values
  - Dynamically calculates based on user's cycle length
- Current cycle phase indicator (Menstrual, Follicular, Ovulation, Luteal)
- **Rotating phase-specific inspirational messages** (5 messages per phase)
- Phase-specific information and gradient cards
- Quick action buttons for Calendar and Daily screens
- **Cycle History section** at bottom
  - Shows last 5 cycle entries
  - **Edit functionality** - tap edit icon to modify start/end dates
  - **Delete functionality** - tap trash icon to remove cycle
  - Displays period length and cycle length for each entry

### 📊 History Tab
- **Split into two distinct sections** for better organization:

  **Period History Section:**
  - Comprehensive cycle history view with detailed tracking
  - Past cycles list showing all recorded menstrual cycles
  - Detailed cycle information for each entry:
    - Period start and end dates
    - Period length (number of days)
    - Cycle length (days between periods)
    - Estimated ovulation date
  - Delete functionality - remove any cycle entry with trash icon
  - Beautiful color-coded cards matching phase colors

  **Diary History Section:**
  - Separate section for all mood tracking entries
  - Shows all diary entries chronologically
  - Displays mood icons, labels, dates, and notes
  - Beautiful color-coded mood indicators
  - Delete functionality for each diary entry
  - Independent from period cycles
- Clean, organized display of historical data
- Helpful empty state messages when no data exists

### 📅 Calendar Screen
- Monthly calendar view with period tracking
- **Quick period entry button** positioned above phase information for easy access
- Add period start dates (uses period length from settings)
- **Color-coded calendar days** showing all menstrual cycle phases:
  - **Dark Pink**: Active period days
  - **Light Pink**: Menstrual phase
  - **Peach**: Follicular phase
  - **Lavender**: Ovulation phase (±1 day)
  - **Sage Green**: Luteal phase
- **Phase Legend** with educational information about each cycle phase
- Visual period indicators on calendar
- Edit and delete existing cycles
- Overlap validation to prevent conflicting entries

### 💖 Daily Screen (Mood Tracker)
- **Beautiful light lilac gradient background** (#E6D5F5 to #F5E6FA to #FAF0FF)
- **Redesigned with feminine icons** instead of emojis
  - Happy: Happy face icon (soft pink #FFB3D9)
  - Calm: Leaf icon (lavender #C7B0F8)
  - Sad: Rainy icon (blue #A8C5E6)
  - Energetic: Flash icon (peach #FFD4A3)
- **Icon-based mood selection** with elegant circular buttons
- White icon on colored background with soft shadows
- Border highlighting for selected mood
- **Add notes section** with expandable text input for detailed journaling
- **Save button** to store mood and notes together
- **Multiple entries per day** - users can track their mood multiple times throughout the day
- View past entries with mood icon and notes in elegant cards
- **Delete functionality** for each entry with icon buttons
- Chronological list of mood history sorted by date
- **Sparkling background** with gentle sparkle icons for magical atmosphere

### ⚙️ Settings Screen
- Personalize with your name
- Adjust average cycle length (21-45 days)
- Adjust average period length (2-10 days)
- Switch between English and Turkish languages
- **Heavy haptic feedback** on save for tactile confirmation
- Beautiful app branding

### 🎯 User Experience Enhancements
- **Heavy haptic feedback** on important actions:
  - Saving settings changes
  - Adding period start dates in calendar
- Smooth animations and transitions throughout
- Intuitive gesture controls

## Technical Stack

- **Framework**: Expo SDK 53 with React Native 0.76.7
- **Authentication**: Supabase Auth (email/password)
- **Database**: Supabase (PostgreSQL) with real-time sync
- **Navigation**: React Navigation (Bottom Tabs)
- **State Management**: Zustand with AsyncStorage persistence
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Date Handling**: date-fns
- **Icons**: Expo Vector Icons (Ionicons)
- **Graphics**: React Native SVG (for circular phase chart)
- **Haptics**: Expo Haptics (heavy impact feedback)
- **UI Components**: React Native Safe Area Context, Expo Linear Gradient

## Project Structure

```
/home/user/workspace/
├── src/
│   ├── components/
│   │   ├── StoreInitializer.tsx     # Handles Zustand hydration
│   │   ├── AuthWrapper.tsx          # Authentication flow wrapper
│   │   └── CircularPhaseChart.tsx   # Interactive circular cycle visualization
│   ├── screens/
│   │   ├── AuthScreen.tsx           # Login and signup screen
│   │   ├── OnboardingQuestionsScreen.tsx  # Post-auth onboarding questions
│   │   ├── TodayScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── DailyScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/
│   │   └── RootNavigator.tsx      # Bottom tab navigation
│   ├── state/
│   │   └── venusStore.ts          # Zustand store with Supabase sync
│   ├── types/
│   │   └── venus.ts               # TypeScript type definitions
│   ├── utils/
│   │   ├── cn.ts                  # className merger utility
│   │   ├── translations.ts        # English & Turkish translations + phase messages
│   │   ├── useTranslation.ts      # Translation hook
│   │   └── cycleCalculations.ts  # Cycle math & phase detection
│   ├── api/
│   │   ├── supabase-service.ts   # Supabase database operations
│   │   └── ...                    # Other API integrations (pre-built)
│   └── lib/
│       └── supabase.ts            # Supabase client initialization
├── App.tsx                        # App entry point with auth check
└── tailwind.config.js             # Custom pastel color palette

```

## Data Models

### User Authentication
- Managed by Supabase Auth
- Email and password authentication
- Automatic session persistence

### Settings
- `name`: User's name
- `cycleLength`: Average cycle length (default 28 days)
- `periodLength`: Average period duration (default 5 days)
- `language`: "en" or "tr"
- `hasCompletedOnboarding`: Boolean flag for onboarding completion

### Cycle
- `id`: Unique identifier
- `startDate`: Period start date (ISO string)
- `endDate`: Period end date (ISO string)
- Synced with Supabase in real-time

### DiaryEntry
- `id`: Unique identifier
- `date`: Entry date (ISO string)
- `moodTag`: "happy" | "calm" | "sad" | "energetic"
- `note`: Optional text note
- Synced with Supabase in real-time

## Cycle Calculations

The app uses sophisticated algorithms to calculate:

1. **Next Period Date**: Calculates from last period start, automatically adjusts if date has passed
   - Accounts for multiple missed cycles
   - Always returns a future date
2. **Ovulation Date**: Next period date - 14 days
3. **Current Day in Cycle**: Properly handles cycle wrapping
4. **Current Phase**:
   - **Menstrual**: Days 1 to period length
   - **Follicular**: After menstruation until ovulation
   - **Ovulation**: Ovulation day ± 1 day
   - **Luteal**: After ovulation until next period

## Color Palette

The app uses a luxurious pastel color scheme:

- **Pink**: Primary accent color (#FF6B95)
- **Beige**: Background and neutrals (#FDFAF7)
- **Lavender**: Secondary accent (#9771FF)
- **Peach**: Warm highlights (#FF9A6A)
- **Sage**: Calming accents (#77B296)

## Localization

Fully localized in:
- 🇬🇧 English
- 🇹🇷 Turkish

Includes 20+ phase-specific inspirational messages (5 per menstrual phase) designed to provide guidance and encouragement throughout the cycle.

Language automatically detected from device settings with manual override in Settings.

## Getting Started

The app is already running on port 8081. All changes are automatically reflected in the Vibecode preview app.

### Commands
- `bun start` - Start Expo dev server
- `bun run typecheck` - Run TypeScript type checking
- `bun run lint` - Run ESLint

### Recent Fixes
- **Fixed icon assets**: Created icon.png, splash.png, adaptive-icon.png, and favicon.png from background image
- **Implemented authentication**: Added email/password auth with Supabase before app access
- **Added onboarding questions**: 3-step setup after authentication for personalized experience
- **Fixed next period calculations**: Now properly handles cycles that have passed expected dates
- **Fixed ovulation calculations**: Always shows accurate future dates
- **Improved circular chart indicator**: Better positioning of the current day dot on the cycle ring
- **Updated app flow**: Auth → Onboarding Questions → Main App

## Design Philosophy

Venus is designed with a luxurious, feminine, and magical aesthetic inspired by premium wellness apps like Stardust, Reflectly, Flo, and Clover. Every element is polished to provide:

- **Intuitive UX**: Clear navigation, accessible controls, quick period entry
- **Beautiful UI**: Pastel gradients, soft shadows, rounded corners, emoji-enhanced interactions
- **Thoughtful Details**: Phase-specific colors, rotating inspirational messages, glowing heart backgrounds
- **Respectful Privacy**: All data stored locally on device
- **Personalized Experience**: Onboarding flow, customizable cycle settings, bilingual support

## Future Enhancements

Potential features for future versions:
- Symptom tracking (cramps, headaches, bloating, etc.)
- Push notifications and reminders
- Export data to CSV
- Insights and predictions based on historical data
- Widget support for quick glance at home screen
- Dark mode
- More mood options and custom tags
- Photo diary integration

---

Built with ❤️ using Vibecode
