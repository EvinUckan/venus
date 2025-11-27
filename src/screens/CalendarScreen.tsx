import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "@react-navigation/native";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  parseISO,
  addDays,
  differenceInDays,
  startOfDay,
} from "date-fns";

import useVenusStore from "../state/venusStore";
import { useTranslation } from "../utils/useTranslation";
import { isDateInPeriod, getCycleForDate, checkCycleOverlap, getLastPeriodStart, getNextPeriodDate, getOvulationDate } from "../utils/cycleCalculations";
import { Phase } from "../types/venus";
import { 
  getCurrentUser, 
  subscribeToCyclesChanges,
  fetchUserCycles 
} from "../api/supabase-service";

export default function CalendarScreen() {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const cycles = useVenusStore((s) => s.cycles);
  const settings = useVenusStore((s) => s.settings);
  const addCycle = useVenusStore((s) => s.addCycle);
  const deleteCycle = useVenusStore((s) => s.deleteCycle);
  const setCycles = useVenusStore((s) => s.setCycles);

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

          console.log("🔄 Fetching cycles for CalendarScreen...");
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

        console.log("🔔 Setting up real-time subscriptions for CalendarScreen...");

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

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddPeriodStart = async () => {
    if (!selectedDate) return;

    // Trigger heavy haptic feedback for period start action
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const existingCycle = getCycleForDate(selectedDate, cycles);

    if (existingCycle) {
      Alert.alert("Error", "A cycle already exists for this date");
      return;
    }

    // Use period length from settings
    const endDate = format(
      addDays(selectedDate, settings.periodLength - 1),
      "yyyy-MM-dd"
    );

    if (checkCycleOverlap(dateStr, endDate, cycles)) {
      Alert.alert("Error", t("overlappingPeriods"));
      return;
    }

    await addCycle({ startDate: dateStr, endDate });
    setSelectedDate(null);
  };

  const handleDeleteCycle = async () => {
    if (!selectedDate) return;

    const cycle = getCycleForDate(selectedDate, cycles);
    if (cycle) {
      await deleteCycle(cycle.id);
      setSelectedDate(null);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Determine phase for a given date
  const getPhaseForDate = (date: Date): Phase | null => {
    const lastPeriodStart = getLastPeriodStart(cycles);
    if (!lastPeriodStart) return null;

    const targetDate = startOfDay(date);
    const daysSinceLastPeriod = differenceInDays(targetDate, lastPeriodStart);

    // If date is before last period, return null
    if (daysSinceLastPeriod < 0) return null;

    const nextPeriodDate = getNextPeriodDate(lastPeriodStart, settings.cycleLength);
    const ovulationDate = getOvulationDate(nextPeriodDate);

    // Menstrual phase: Day 1 to periodLength
    if (daysSinceLastPeriod >= 0 && daysSinceLastPeriod < settings.periodLength) {
      return "menstrual";
    }

    // Calculate follicular end (ovulation start)
    if (ovulationDate) {
      const daysUntilOvulation = differenceInDays(ovulationDate, targetDate);

      // Ovulation phase: ovulation day (±1 day)
      if (daysUntilOvulation >= -1 && daysUntilOvulation <= 1) {
        return "ovulation";
      }

      // Follicular phase: after menstrual and before ovulation
      if (daysUntilOvulation > 1) {
        return "follicular";
      }
    }

    // Luteal phase: after ovulation until next period
    return "luteal";
  };

  const getPhaseColor = (phase: Phase | null, isInPeriod: boolean): string => {
    if (isInPeriod) return "bg-venus-rose-400";

    switch (phase) {
      case "menstrual":
        return "bg-venus-pink-200";
      case "follicular":
        return "bg-venus-lavender-200";
      case "ovulation":
        return "bg-venus-mint-200";
      case "luteal":
        return "bg-venus-peach-200";
      default:
        return "";
    }
  };

  const existingCycle = selectedDate ? getCycleForDate(selectedDate, cycles) : null;

  return (
    <SafeAreaView className="flex-1 bg-venus-pink-50" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-800">{t("calendar")}</Text>
        </View>

        {/* Month Navigation */}
        <View className="flex-row items-center justify-between px-6 mb-6">
          <Pressable onPress={goToPreviousMonth} className="p-2">
            <Ionicons name="chevron-back" size={24} color="#6B7280" />
          </Pressable>
          <Text className="text-xl font-bold text-gray-800">
            {format(currentMonth, "MMMM yyyy")}
          </Text>
          <Pressable onPress={goToNextMonth} className="p-2">
            <Ionicons name="chevron-forward" size={24} color="#6B7280" />
          </Pressable>
        </View>

        {/* Calendar Grid */}
        <View className="px-6 mb-6">
          {/* Day Labels */}
          <View className="flex-row mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <View key={index} className="flex-1 items-center">
                <Text className="text-sm font-semibold text-gray-500">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View className="flex-row flex-wrap">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const isInPeriod = isDateInPeriod(day, cycles);
              const phase = getPhaseForDate(day);
              const phaseColor = getPhaseColor(phase, isInPeriod);

              return (
                <Pressable
                  key={index}
                  onPress={() => handleDatePress(day)}
                  className="w-[14.28%] aspect-square p-1"
                >
                  <View
                    className={`flex-1 items-center justify-center rounded-xl ${
                      isSelected
                        ? "bg-venus-rose-500"
                        : phaseColor
                        ? phaseColor
                        : isToday
                        ? "border-2 border-venus-pink-500"
                        : ""
                    }`}
                  >
                    <Text
                      className={`text-base font-medium ${
                        isSelected
                          ? "text-white"
                          : !isCurrentMonth
                          ? "text-gray-300"
                          : isToday && !phaseColor
                          ? "text-venus-pink-600"
                          : "text-gray-800"
                      }`}
                    >
                      {format(day, "d")}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Selected Date Actions - Moved above Phase Legend */}
        {selectedDate && (
          <View className="mx-6 mb-6 bg-white rounded-3xl p-6 shadow-lg">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              {format(selectedDate, "MMMM d, yyyy")}
            </Text>

            {existingCycle ? (
              <View>
                <Text className="text-sm text-gray-600 mb-4">
                  {t("periodRange")}: {format(parseISO(existingCycle.startDate), "MMM d")} -{" "}
                  {format(parseISO(existingCycle.endDate), "MMM d")}
                </Text>
                <Pressable
                  onPress={handleDeleteCycle}
                  className="bg-red-500 rounded-2xl p-4 items-center"
                >
                  <Text className="text-white font-semibold">{t("delete")}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handleAddPeriodStart}
                className="bg-venus-rose-500 rounded-2xl p-4 items-center"
              >
                <Text className="text-white font-semibold">{t("addPeriodStart")}</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Phase Legend */}
        <View className="mx-6 mb-6 bg-white rounded-3xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            {t("phasesOfCycle")}
          </Text>

          <View className="space-y-3">
            {/* Menstrual */}
            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-lg bg-venus-rose-400 mr-3 mt-0.5" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  {t("menstrual")}
                </Text>
                <Text className="text-sm text-gray-600">
                  Day one of your period is the first day that any vaginal bleeding occurs.
                </Text>
              </View>
            </View>

            {/* Follicular */}
            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-lg bg-venus-lavender-200 mr-3 mt-0.5" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  {t("follicular")}
                </Text>
                <Text className="text-sm text-gray-600">
                  This is the phase where your ovaries prepare eggs for ovulation. One follicle develops into the most dominant follicle and releases an egg that cycle.
                </Text>
              </View>
            </View>

            {/* Ovulation */}
            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-lg bg-venus-mint-200 mr-3 mt-0.5" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  {t("ovulation")}
                </Text>
                <Text className="text-sm text-gray-600">
                  Your ovary releases the egg that developed during the follicular phase.
                </Text>
              </View>
            </View>

            {/* Luteal */}
            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-lg bg-venus-peach-200 mr-3 mt-0.5" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  {t("luteal")}
                </Text>
                <Text className="text-sm text-gray-600">
                  The luteal phase begins when the egg starts its journey to your uterus. It ends when you get your period (menstruation).
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Selected Date Actions */}
        {selectedDate && (
          <View className="mx-6 mb-6 bg-white rounded-3xl p-6 shadow-lg">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              {format(selectedDate, "MMMM d, yyyy")}
            </Text>

            {existingCycle ? (
              <View>
                <Text className="text-sm text-gray-600 mb-4">
                  {t("periodRange")}: {format(parseISO(existingCycle.startDate), "MMM d")} -{" "}
                  {format(parseISO(existingCycle.endDate), "MMM d")}
                </Text>
                <Pressable
                  onPress={handleDeleteCycle}
                  className="bg-red-500 rounded-2xl p-4 items-center"
                >
                  <Text className="text-white font-semibold">{t("delete")}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handleAddPeriodStart}
                className="bg-venus-rose-500 rounded-2xl p-4 items-center"
              >
                <Text className="text-white font-semibold">{t("addPeriodStart")}</Text>
              </Pressable>
            )}
          </View>
        )}

        {cycles.length === 0 && !selectedDate && (
          <View className="items-center justify-center px-6 py-12">
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text className="text-center text-gray-500 mt-4">{t("noPeriodData")}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
