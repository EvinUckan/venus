import React, { useMemo, useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { format, addDays, startOfDay, parseISO, differenceInDays } from "date-fns";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import useVenusStore from "../state/venusStore";
import { useTranslation } from "../utils/useTranslation";
import { getRandomPhaseMessage } from "../utils/translations";
import { getPhaseInfo, getCurrentDayInCycle } from "../utils/cycleCalculations";
import { RootStackParamList } from "../navigation/RootNavigator";
import CircularPhaseChart from "../components/CircularPhaseChart";
import { 
  getCurrentUser, 
  subscribeToCyclesChanges,
  fetchUserCycles 
} from "../api/supabase-service";

type TodayScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Today">;

export default function TodayScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<TodayScreenNavigationProp>();

  const cycles = useVenusStore((s) => s.cycles);
  const settings = useVenusStore((s) => s.settings);
  const deleteCycle = useVenusStore((s) => s.deleteCycle);
  const updateCycle = useVenusStore((s) => s.updateCycle);
  const setCycles = useVenusStore((s) => s.setCycles);

  const [editingCycle, setEditingCycle] = useState<{ id: string; startDate: string; endDate: string } | null>(null);
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

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

          console.log("🔄 Fetching cycles for TodayScreen...");
          const remoteCycles = await fetchUserCycles(user.id);

          // Transform and update local state
          const transformedCycles = remoteCycles.map((cycle) => ({
            id: cycle.id!,
            startDate: cycle.start_date,
            endDate: cycle.end_date,
          }));

          setCycles(transformedCycles);
          console.log("✅ Cycles fetched successfully");
        } catch (error) {
          console.error("⚠️ Failed to fetch cycles:", error);
        }
      };

      fetchData();
    }, [])
  );

  // Subscribe to real-time changes
  useEffect(() => {
    let cyclesSubscription: any;

    const setupSubscriptions = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        console.log("🔔 Setting up real-time subscriptions for TodayScreen...");

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
      } catch (error) {
        console.error("⚠️ Failed to setup subscriptions:", error);
      }
    };

    setupSubscriptions();

    return () => {
      cyclesSubscription?.unsubscribe();
      console.log("🔕 Unsubscribed from real-time changes");
    };
  }, [cycles]);

  const phaseInfo = getPhaseInfo(cycles, settings.cycleLength, settings.periodLength);
  const currentDay = getCurrentDayInCycle(cycles, settings.cycleLength);

  // Get a random phase message when the phase changes
  const phaseMessage = useMemo(
    () => getRandomPhaseMessage(phaseInfo.phase, settings.language),
    [phaseInfo.phase, settings.language]
  );

  const today = startOfDay(new Date());
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));

  const getPhaseColor = (): [string, string] => {
    switch (phaseInfo.phase) {
      case "menstrual":
        return ["#FFA0CC", "#FF8EC3"];
      case "follicular":
        return ["#C199FF", "#CDADFF"];
      case "ovulation":
        return ["#66FFC0", "#85FFCD"];
      case "luteal":
        return ["#FFB999", "#FFC7AD"];
      default:
        return ["#FFB2D5", "#FFC4DE"];
    }
  };

  const getPhaseIcon = () => {
    switch (phaseInfo.phase) {
      case "menstrual":
        return "water";
      case "follicular":
        return "flower";
      case "ovulation":
        return "sparkles";
      case "luteal":
        return "moon";
      default:
        return "ellipse";
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FDEEF4" }} edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-4xl font-bold text-venus-rose-500 mb-2">
            Venera
          </Text>
          <View className="flex-row items-center">
            <Text className="text-3xl font-bold text-gray-800">
              {settings.name ? `Hello, ${settings.name}` : t("today")}
            </Text>
            {settings.name && (
              <View style={{ marginLeft: 8 }}>
                <Ionicons name="sparkles" size={24} color="#FFFFFF" style={{
                  shadowColor: "#FFB3D9",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                }} />
              </View>
            )}
          </View>
        </View>

        {/* 7-Day Mini Calendar - Moved to top */}
        <View className="px-6 mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {weekDates.map((date, index) => {
              const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
              return (
                <Pressable
                  key={index}
                  onPress={() => navigation.navigate("Calendar")}
                  className="items-center mr-3"
                >
                  <View
                    className={`w-16 h-20 rounded-2xl items-center justify-center ${
                      isToday
                        ? "bg-venus-rose-500"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium mb-1 ${
                        isToday ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {format(date, "EEE")}
                    </Text>
                    <Text
                      className={`text-2xl font-bold ${
                        isToday ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {format(date, "d")}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Circular Phase Chart */}
        <View className="px-6 mb-6">
          <CircularPhaseChart
            currentDay={currentDay}
            cycleLength={settings.cycleLength}
            periodLength={settings.periodLength}
            currentPhase={phaseInfo.phase}
            phaseMessage={phaseMessage}
          />
        </View>

        {/* Phase Card */}
        <View className="mx-6 mb-6 rounded-3xl overflow-hidden shadow-lg">
          <LinearGradient
            colors={getPhaseColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 24 }}
          >
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-white/30 items-center justify-center mr-3">
                <Ionicons name={getPhaseIcon()} size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white/80 text-sm font-medium mb-1">
                  {t("currentPhase")}
                </Text>
                <Text className="text-white text-2xl font-bold">
                  {t(phaseInfo.phase)}
                </Text>
              </View>
            </View>

            <Text className="text-white/90 text-base leading-6 mb-6">
              {phaseMessage}
            </Text>

            <View className="flex-row space-x-4">
              <View className="flex-1 bg-white/20 rounded-2xl p-4">
                <Text className="text-white/80 text-xs font-medium mb-1">
                  {t("nextPeriodIn")}
                </Text>
                <Text className="text-white text-3xl font-bold">
                  {phaseInfo.daysUntilNextPeriod < 0 ? 0 : phaseInfo.daysUntilNextPeriod}
                </Text>
                <Text className="text-white/80 text-xs font-medium">
                  {(phaseInfo.daysUntilNextPeriod < 0 ? 0 : phaseInfo.daysUntilNextPeriod) === 1 ? t("day") : t("days")}
                </Text>
              </View>

              {phaseInfo.daysUntilOvulation !== null && (
                <View className="flex-1 bg-white/20 rounded-2xl p-4">
                  <Text className="text-white/80 text-xs font-medium mb-1">
                    {t("ovulationIn")}
                  </Text>
                  <Text className="text-white text-3xl font-bold">
                    {phaseInfo.daysUntilOvulation < 0 ? 0 : phaseInfo.daysUntilOvulation}
                  </Text>
                  <Text className="text-white/80 text-xs font-medium">
                    {(phaseInfo.daysUntilOvulation < 0 ? 0 : phaseInfo.daysUntilOvulation) === 1 ? t("day") : t("days")}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View className="px-6 pb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>

          <Pressable
            onPress={() => navigation.navigate("Calendar")}
            className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
          >
            <View className="w-12 h-12 rounded-full bg-venus-pink-100 items-center justify-center mr-4">
              <Ionicons name="calendar" size={24} color="#FF6B95" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                {t("calendar")}
              </Text>
              <Text className="text-sm text-gray-500">Track your cycle</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Daily")}
            className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm"
          >
            <View className="w-12 h-12 rounded-full bg-venus-lavender-100 items-center justify-center mr-4">
              <Ionicons name="heart" size={24} color="#9771FF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                {t("daily")}
              </Text>
              <Text className="text-sm text-gray-500">Log your mood</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </Pressable>
        </View>

        {/* History Section */}
        <View className="px-6 pb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">Cycle History</Text>

          {cycles.length === 0 ? (
            <View className="items-center justify-center py-8 bg-white rounded-2xl">
              <Ionicons name="time-outline" size={48} color="#D1D5DB" />
              <Text className="text-center text-gray-500 mt-3">No cycle history yet</Text>
            </View>
          ) : (
            <View>
              {cycles.slice(0, 5).map((cycle, index) => {
                const startDate = parseISO(cycle.startDate);
                const endDate = parseISO(cycle.endDate);
                const periodLength = differenceInDays(endDate, startDate) + 1;

                // Calculate cycle length
                let cycleLength = settings.cycleLength;
                if (index < cycles.length - 1) {
                  const nextCycle = cycles[index + 1];
                  cycleLength = differenceInDays(
                    parseISO(nextCycle.startDate),
                    startDate
                  );
                }

                return (
                  <View
                    key={cycle.id}
                    className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                  >
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-800 mb-1">
                          {format(startDate, "MMM d, yyyy")}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Started {format(startDate, "MMM d")} • Ended {format(endDate, "MMM d")}
                        </Text>
                      </View>
                      <View className="flex-row">
                        <Pressable
                          onPress={() => {
                            setEditingCycle(cycle);
                            setEditStartDate(cycle.startDate);
                            setEditEndDate(cycle.endDate);
                          }}
                          className="p-2 mr-1"
                        >
                          <Ionicons name="create-outline" size={20} color="#6B7280" />
                        </Pressable>
                        <Pressable
                          onPress={async () => await deleteCycle(cycle.id)}
                          className="p-2"
                        >
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </Pressable>
                      </View>
                    </View>

                    <View className="flex-row space-x-2">
                      <View className="flex-1 bg-pink-50 rounded-xl p-3">
                        <Text className="text-xs text-gray-600 mb-0.5">Period</Text>
                        <Text className="text-lg font-bold text-pink-600">
                          {periodLength}d
                        </Text>
                      </View>

                      <View className="flex-1 bg-purple-50 rounded-xl p-3">
                        <Text className="text-xs text-gray-600 mb-0.5">
                          Cycle
                        </Text>
                        <Text className="text-lg font-bold text-purple-600">
                          {cycleLength}d
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Edit Cycle Modal */}
        <Modal
          visible={editingCycle !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setEditingCycle(null)}
        >
          <Pressable
            className="flex-1 bg-black/50 justify-center items-center px-6"
            onPress={() => setEditingCycle(null)}
          >
            <Pressable
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
              onPress={(e) => e.stopPropagation()}
            >
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Edit Cycle
              </Text>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Start Date (YYYY-MM-DD)
                </Text>
                <TextInput
                  value={editStartDate}
                  onChangeText={setEditStartDate}
                  placeholder="2024-01-01"
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  End Date (YYYY-MM-DD)
                </Text>
                <TextInput
                  value={editEndDate}
                  onChangeText={setEditEndDate}
                  placeholder="2024-01-05"
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                />
              </View>

              <View className="flex-row space-x-3">
                <Pressable
                  onPress={() => setEditingCycle(null)}
                  className="flex-1 bg-gray-200 rounded-2xl p-4 items-center"
                >
                  <Text className="text-gray-800 font-semibold text-base">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={async () => {
                    if (editingCycle) {
                      await updateCycle(editingCycle.id, {
                        startDate: editStartDate,
                        endDate: editEndDate,
                      });
                      setEditingCycle(null);
                    }
                  }}
                  className="flex-1 bg-venus-rose-500 rounded-2xl p-4 items-center"
                >
                  <Text className="text-white font-semibold text-base">Save</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
