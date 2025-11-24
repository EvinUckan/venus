import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Settings, Cycle, DiaryEntry } from "../types/venus";
import { v4 as uuidv4 } from "uuid";
import { 
  addCycleToSupabase, 
  updateCycleInSupabase, 
  deleteCycleFromSupabase,
  addDiaryToSupabase,
  updateDiaryInSupabase,
  deleteDiaryFromSupabase,
  fetchUserCycles,
  fetchUserDiaries,
  getCurrentUser,
  fetchUserSettings,
  saveUserSettings,
  createUserProfile
} from "../api/supabase-service";

interface VenusStore {
  settings: Settings;
  cycles: Cycle[];
  diaries: DiaryEntry[];
  userId: string | null;

  // Settings actions
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  loadSettingsFromSupabase: () => Promise<void>;
  setUserId: (userId: string | null) => void;

  // Cycle actions
  addCycle: (cycle: Omit<Cycle, "id">) => Promise<void>;
  updateCycle: (id: string, cycle: Partial<Cycle>) => Promise<void>;
  deleteCycle: (id: string) => Promise<void>;

  // Diary actions
  addDiary: (diary: Omit<DiaryEntry, "id">) => Promise<void>;
  updateDiary: (id: string, diary: Partial<DiaryEntry>) => Promise<void>;
  deleteDiary: (id: string) => Promise<void>;

  // Sync actions
  syncFromSupabase: () => Promise<void>;
  setCycles: (cycles: Cycle[]) => void;
  setDiaries: (diaries: DiaryEntry[]) => void;
}

const useVenusStore = create<VenusStore>()(
  persist(
    (set, get) => ({
      settings: {
        name: "",
        cycleLength: 28,
        periodLength: 5,
        language: "en",
      },
      cycles: [],
      diaries: [],
      userId: null,

      // Settings actions
      updateSettings: async (newSettings) => {
        // Update local state immediately
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));

        // Try to sync to Supabase
        try {
          const user = await getCurrentUser();
          if (user) {
            const currentSettings = get().settings;
            await saveUserSettings({
              user_id: user.id,
              cycle_length: newSettings.cycleLength ?? currentSettings.cycleLength,
              period_length: newSettings.periodLength ?? currentSettings.periodLength,
              language: newSettings.language ?? currentSettings.language,
            });
            console.log('✅ Settings synced to Supabase');
          } else {
            console.log('ℹ️ No user logged in, settings saved locally only');
          }
        } catch (error) {
          console.error('⚠️ Failed to sync settings to Supabase:', error);
          // Continue anyway - data is saved locally
        }
      },

      loadSettingsFromSupabase: async () => {
        try {
          const user = await getCurrentUser();
          if (!user) {
            console.log('ℹ️ No user logged in, using local settings');
            return;
          }

          console.log('🔄 Loading settings from Supabase...');
          const remoteSettings = await fetchUserSettings(user.id);

          if (remoteSettings) {
            // Update local state with remote settings
            set((state) => ({
              settings: {
                ...state.settings,
                cycleLength: remoteSettings.cycle_length,
                periodLength: remoteSettings.period_length,
                language: remoteSettings.language,
              },
            }));
            console.log('✅ Settings loaded from Supabase');
          } else {
            // No remote settings exist, save current local settings to Supabase
            const currentSettings = get().settings;
            await saveUserSettings({
              user_id: user.id,
              cycle_length: currentSettings.cycleLength,
              period_length: currentSettings.periodLength,
              language: currentSettings.language,
            });
            console.log('✅ Local settings synced to Supabase');
          }
        } catch (error) {
          console.error('⚠️ Failed to load settings from Supabase:', error);
        }
      },

      setUserId: (userId) =>
        set({ userId }),

      // Cycle actions
      addCycle: async (cycle) => {
        const newCycle = { ...cycle, id: uuidv4() };
        
        // Add to local state immediately
        set((state) => ({
          cycles: [...state.cycles, newCycle].sort(
            (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          ),
        }));

        // Try to sync to Supabase
        try {
          const user = await getCurrentUser();
          if (user) {
            const settings = get().settings;
            await addCycleToSupabase({
              user_id: user.id,
              start_date: newCycle.startDate,
              end_date: newCycle.endDate,
              cycle_length: settings.cycleLength,
              period_length: settings.periodLength,
            });
            console.log("✅ Cycle synced to Supabase:", newCycle.id);
          } else {
            console.log("ℹ️ No user logged in, cycle saved locally only");
          }
        } catch (error) {
          console.error("⚠️ Failed to sync cycle to Supabase:", error);
          // Continue anyway - data is saved locally
        }
      },

      updateCycle: async (id, updates) => {
        // Update local state immediately
        set((state) => ({
          cycles: state.cycles
            .map((cycle) =>
              cycle.id === id ? { ...cycle, ...updates } : cycle
            )
            .sort(
              (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            ),
        }));

        // Try to sync to Supabase
        try {
          const user = await getCurrentUser();
          if (user) {
            const supabaseUpdates: any = {};
            if (updates.startDate) supabaseUpdates.start_date = updates.startDate;
            if (updates.endDate) supabaseUpdates.end_date = updates.endDate;
            
            await updateCycleInSupabase(id, supabaseUpdates);
            console.log("✅ Cycle update synced to Supabase:", id);
          }
        } catch (error) {
          console.error("⚠️ Failed to sync cycle update to Supabase:", error);
          // Continue anyway - data is updated locally
        }
      },

      deleteCycle: async (id) => {
        // Delete from local state immediately
        set((state) => ({
          cycles: state.cycles.filter((cycle) => cycle.id !== id),
        }));

        // Try to sync to Supabase
        try {
          const user = await getCurrentUser();
          if (user) {
            await deleteCycleFromSupabase(id);
            console.log("✅ Cycle deletion synced to Supabase:", id);
          }
        } catch (error) {
          console.error("⚠️ Failed to sync cycle deletion to Supabase:", error);
          // Continue anyway - data is deleted locally
        }
      },

      // Diary actions
      addDiary: async (diary) => {
        const newDiary = { ...diary, id: uuidv4() };
        
        // Add to local state immediately
        set((state) => ({
          diaries: [...state.diaries, newDiary].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));

        // Try to sync to Supabase
        try {
          const user = await getCurrentUser();
          if (user) {
            await addDiaryToSupabase({
              user_id: user.id,
              date: newDiary.date,
              mood: newDiary.moodTag,
              symptoms: [],
              notes: newDiary.note || "",
            });
            console.log("✅ Diary entry synced to Supabase:", newDiary.id);
          } else {
            console.log("ℹ️ No user logged in, diary saved locally only");
          }
        } catch (error) {
          console.error("⚠️ Failed to sync diary to Supabase:", error);
          // Continue anyway - data is saved locally
        }
      },

      updateDiary: async (id, updates) => {
        // Update local state immediately
        set((state) => ({
          diaries: state.diaries
            .map((diary) =>
              diary.id === id ? { ...diary, ...updates } : diary
            )
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
        }));

        // Try to sync to Supabase
        try {
          const user = await getCurrentUser();
          if (user) {
            const supabaseUpdates: any = {};
            if (updates.date) supabaseUpdates.date = updates.date;
            if (updates.moodTag) supabaseUpdates.mood = updates.moodTag;
            if (updates.note !== undefined) supabaseUpdates.notes = updates.note;
            
            await updateDiaryInSupabase(id, supabaseUpdates);
            console.log("✅ Diary update synced to Supabase:", id);
          }
        } catch (error) {
          console.error("⚠️ Failed to sync diary update to Supabase:", error);
          // Continue anyway - data is updated locally
        }
      },

      deleteDiary: async (id) => {
        // Delete from local state immediately
        set((state) => ({
          diaries: state.diaries.filter((diary) => diary.id !== id),
        }));

        // Try to sync to Supabase
        try {
          const user = await getCurrentUser();
          if (user) {
            await deleteDiaryFromSupabase(id);
            console.log("✅ Diary deletion synced to Supabase:", id);
          }
        } catch (error) {
          console.error("⚠️ Failed to sync diary deletion to Supabase:", error);
          // Continue anyway - data is deleted locally
        }
      },

      // Sync actions
      syncFromSupabase: async () => {
        try {
          const user = await getCurrentUser();
          if (!user) {
            console.log("ℹ️ No user logged in, skipping sync");
            return;
          }

          console.log("🔄 Syncing data from Supabase...");
          
          // Fetch all data from Supabase
          const [remoteCycles, remoteDiaries, remoteSettings] = await Promise.all([
            fetchUserCycles(user.id),
            fetchUserDiaries(user.id),
            fetchUserSettings(user.id),
          ]);

          // Transform Supabase data to match local format
          const transformedCycles: Cycle[] = remoteCycles.map((cycle) => ({
            id: cycle.id!,
            startDate: cycle.start_date,
            endDate: cycle.end_date,
          }));

          const transformedDiaries: DiaryEntry[] = remoteDiaries.map((diary) => ({
            id: diary.id!,
            date: diary.date,
            moodTag: diary.mood as any,
            note: diary.notes,
          }));

          // Update local state with remote data
          const updates: any = {
            cycles: transformedCycles,
            diaries: transformedDiaries,
          };

          // Update settings if they exist
          if (remoteSettings) {
            updates.settings = {
              ...get().settings,
              cycleLength: remoteSettings.cycle_length,
              periodLength: remoteSettings.period_length,
              language: remoteSettings.language,
            };
          }

          set(updates);

          console.log("✅ Synced from Supabase:", {
            cycles: transformedCycles.length,
            diaries: transformedDiaries.length,
            settings: remoteSettings ? 'loaded' : 'none',
          });
        } catch (error) {
          console.error("⚠️ Failed to sync from Supabase:", error);
        }
      },

      setCycles: (cycles) => set({ cycles }),
      setDiaries: (diaries) => set({ diaries }),
    }),
    {
      name: "venus-storage",
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: true,
    }
  )
);

export default useVenusStore;
