import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO, differenceInDays } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";

import useVenusStore from "../state/venusStore";
import { useTranslation } from "../utils/useTranslation";
import { getOvulationDate } from "../utils/cycleCalculations";
import { MoodTag } from "../types/venus";
import { 
  getCurrentUser, 
  subscribeToCyclesChanges, 
  subscribeToDiariesChanges,
  fetchUserCycles,
  fetchUserDiaries 
} from "../api/supabase-service";

const MOODS: { tag: MoodTag; icon: keyof typeof Ionicons.glyphMap; label: string; color: string }[] = [
  { tag: "happy", icon: "happy", label: "Happy", color: "#FFB3D9" },
  { tag: "calm", icon: "leaf", label: "Calm", color: "#C7B0F8" },
  { tag: "sad", icon: "rainy", label: "Sad", color: "#A8C5E6" },
  { tag: "energetic", icon: "flash", label: "Energetic", color: "#FFD4A3" },
];

export default function HistoryScreen() {
  const { t } = useTranslation();

  const cycles = useVenusStore((s) => s.cycles);
  const diaries = useVenusStore((s) => s.diaries);
  const settings = useVenusStore((s) => s.settings);
  const deleteCycle = useVenusStore((s) => s.deleteCycle);
  const deleteDiary = useVenusStore((s) => s.deleteDiary);
  const setCycles = useVenusStore((s) => s.setCycles);
  const setDiaries = useVenusStore((s) => s.setDiaries);

  // Fetch data from Supabase on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const user = await getCurrentUser();
          if (!user) {
            console.log("ℹ️ No user logged in");
            return;
          }

          console.log("🔄 Fetching data for HistoryScreen...");
          const [remoteCycles, remoteDiaries] = await Promise.all([
            fetchUserCycles(user.id),
            fetchUserDiaries(user.id),
          ]);

          // Transform and update local state
          const transformedCycles = remoteCycles.map((cycle) => ({
            id: cycle.id!,
            startDate: cycle.start_date,
            endDate: cycle.end_date,
          }));

          const transformedDiaries = remoteDiaries.map((diary) => ({
            id: diary.id!,
            date: diary.date,
            moodTag: diary.mood as MoodTag,
            note: diary.notes,
          }));

          setCycles(transformedCycles);
          setDiaries(transformedDiaries);
          console.log("✅ Data fetched successfully");
        } catch (error) {
          console.error("⚠️ Failed to fetch data:", error);
        }
      };

      fetchData();
    }, [])
  );

  // Subscribe to real-time changes
  useEffect(() => {
    let cyclesSubscription: any;
    let diariesSubscription: any;

    const setupSubscriptions = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        console.log("🔔 Setting up real-time subscriptions for HistoryScreen...");

        // Subscribe to cycles changes
        cyclesSubscription = subscribeToCyclesChanges(user.id, (payload) => {
          console.log("🔔 Cycle changed:", payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newCycle = {
              id: payload.new.id,
              startDate: payload.new.start_date,
              endDate: payload.new.end_date,
            };
            setCycles([...cycles, newCycle].sort(
              (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            ));
          } else if (payload.eventType === 'UPDATE') {
            setCycles(cycles.map((cycle) =>
              cycle.id === payload.new.id
                ? {
                    id: payload.new.id,
                    startDate: payload.new.start_date,
                    endDate: payload.new.end_date,
                  }
                : cycle
            ));
          } else if (payload.eventType === 'DELETE') {
            setCycles(cycles.filter((cycle) => cycle.id !== payload.old.id));
          }
        });

        // Subscribe to diaries changes
        diariesSubscription = subscribeToDiariesChanges(user.id, (payload) => {
          console.log("🔔 Diary changed:", payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newDiary = {
              id: payload.new.id,
              date: payload.new.date,
              moodTag: payload.new.mood as MoodTag,
              note: payload.new.notes,
            };
            setDiaries([...diaries, newDiary].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
          } else if (payload.eventType === 'UPDATE') {
            setDiaries(diaries.map((diary) =>
              diary.id === payload.new.id
                ? {
                    id: payload.new.id,
                    date: payload.new.date,
                    moodTag: payload.new.mood as MoodTag,
                    note: payload.new.notes,
                  }
                : diary
            ));
          } else if (payload.eventType === 'DELETE') {
            setDiaries(diaries.filter((diary) => diary.id !== payload.old.id));
          }
        });
      } catch (error) {
        console.error("⚠️ Failed to setup subscriptions:", error);
      }
    };

    setupSubscriptions();

    return () => {
      cyclesSubscription?.unsubscribe();
      diariesSubscription?.unsubscribe();
      console.log("🔕 Unsubscribed from real-time changes");
    };
  }, [cycles, diaries]);

  const getMoodColor = (mood: MoodTag) => {
    return MOODS.find((m) => m.tag === mood)?.color || "#FFB3C6";
  };

  const getMoodIcon = (mood: MoodTag) => {
    return MOODS.find((m) => m.tag === mood)?.icon || "happy";
  };

  const getMoodLabel = (mood: MoodTag) => {
    return MOODS.find((m) => m.tag === mood)?.label || "Happy";
  };

  return (
    <SafeAreaView className="flex-1 bg-venus-pink-50" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-800">{t("history")}</Text>
        </View>

        {/* Period History Section */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">{t("pastCycles")}</Text>

          {cycles.length === 0 ? (
            <View className="items-center justify-center py-12 bg-white rounded-2xl">
              <Ionicons name="time-outline" size={64} color="#D1D5DB" />
              <Text className="text-center text-gray-500 mt-4">{t("noCycles")}</Text>
            </View>
          ) : (
            <View>
              {cycles.map((cycle, index) => {
                const startDate = parseISO(cycle.startDate);
                const endDate = parseISO(cycle.endDate);
                const periodLength = differenceInDays(endDate, startDate) + 1;

                // Calculate cycle length (days between this cycle and the next)
                let cycleLength = settings.cycleLength;
                if (index < cycles.length - 1) {
                  const nextCycle = cycles[index + 1];
                  cycleLength = differenceInDays(
                    parseISO(nextCycle.startDate),
                    startDate
                  );
                }

                // Calculate estimated ovulation for this cycle
                const nextPeriodForThisCycle = new Date(
                  startDate.getTime() + cycleLength * 24 * 60 * 60 * 1000
                );
                const estimatedOvulation = getOvulationDate(nextPeriodForThisCycle);

                return (
                  <View
                    key={cycle.id}
                    className="bg-white rounded-2xl p-5 mb-3 shadow-sm"
                  >
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                          {format(startDate, "MMM d, yyyy")}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {t("started")}: {format(startDate, "MMM d")} • {t("ended")}:{" "}
                          {format(endDate, "MMM d")}
                        </Text>
                      </View>
                      <Pressable
                        onPress={async () => await deleteCycle(cycle.id)}
                        className="p-2"
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </Pressable>
                    </View>

                    <View className="flex-row space-x-3">
                      <View className="flex-1 bg-venus-pink-50 rounded-xl p-3">
                        <Text className="text-xs text-gray-600 mb-1">Period</Text>
                        <Text className="text-xl font-bold text-venus-pink-600">
                          {periodLength}d
                        </Text>
                      </View>

                      <View className="flex-1 bg-venus-lavender-50 rounded-xl p-3">
                        <Text className="text-xs text-gray-600 mb-1">
                          {t("cycleLength")}
                        </Text>
                        <Text className="text-xl font-bold text-venus-lavender-500">
                          {cycleLength}d
                        </Text>
                      </View>

                      {estimatedOvulation && (
                        <View className="flex-1 bg-venus-peach-50 rounded-xl p-3">
                          <Text className="text-xs text-gray-600 mb-1">
                            {t("estimatedOvulation")}
                          </Text>
                          <Text className="text-sm font-bold text-venus-peach-500">
                            {format(estimatedOvulation, "MMM d")}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Diary History Section */}
        <View className="px-6 pb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Diary History</Text>

          {diaries.length === 0 ? (
            <View className="items-center justify-center py-12 bg-white rounded-2xl">
              <Ionicons name="sparkles" size={64} color="#D1D5DB" />
              <Text className="text-center text-gray-500 mt-4">No diary entries yet. Start tracking your mood!</Text>
            </View>
          ) : (
            <View>
              {diaries.map((entry) => (
                <View
                  key={entry.id}
                  className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center flex-1">
                      <View
                        className="rounded-full items-center justify-center mr-3"
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: getMoodColor(entry.moodTag),
                          shadowColor: getMoodColor(entry.moodTag),
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 3,
                        }}
                      >
                        <Ionicons
                          name={getMoodIcon(entry.moodTag)}
                          size={28}
                          color="white"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800">
                          {getMoodLabel(entry.moodTag)}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {format(parseISO(entry.date), "MMM d, yyyy")}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => deleteDiary(entry.id)}
                      className="p-2"
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </Pressable>
                  </View>

                  {entry.note && (
                    <View className="mt-2 p-3 bg-gray-50 rounded-xl">
                      <Text className="text-sm text-gray-700 italic">{entry.note}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
