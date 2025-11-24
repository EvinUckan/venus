import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";

import useVenusStore from "../state/venusStore";
import { useTranslation } from "../utils/useTranslation";
import { MoodTag } from "../types/venus";
import { 
  getCurrentUser, 
  subscribeToDiariesChanges,
  fetchUserDiaries 
} from "../api/supabase-service";
const MOODS: { tag: MoodTag; icon: keyof typeof Ionicons.glyphMap; label: string; color: string }[] = [
  { tag: "happy", icon: "happy", label: "Happy", color: "#FFB3D9" },
  { tag: "calm", icon: "leaf", label: "Calm", color: "#C7B0F8" },
  { tag: "sad", icon: "rainy", label: "Sad", color: "#A8C5E6" },
  { tag: "energetic", icon: "flash", label: "Energetic", color: "#FFD4A3" },
];

export default function DailyScreen() {
  const { t } = useTranslation();
  const [selectedMood, setSelectedMood] = useState<MoodTag | null>(null);
  const [note, setNote] = useState("");

  const diaries = useVenusStore((s) => s.diaries);
  const addDiary = useVenusStore((s) => s.addDiary);
  const updateDiary = useVenusStore((s) => s.updateDiary);
  const deleteDiary = useVenusStore((s) => s.deleteDiary);
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

          console.log("🔄 Fetching diaries for DailyScreen...");
          const remoteDiaries = await fetchUserDiaries(user.id);

          // Transform and update local state
          const transformedDiaries = remoteDiaries.map((diary) => ({
            id: diary.id!,
            date: diary.date,
            moodTag: diary.mood as MoodTag,
            note: diary.notes,
          }));

          setDiaries(transformedDiaries);
          console.log("✅ Diaries fetched successfully");
        } catch (error) {
          console.error("⚠️ Failed to fetch diaries:", error);
        }
      };

      fetchData();
    }, [])
  );

  // Subscribe to real-time changes
  useEffect(() => {
    let diariesSubscription: any;

    const setupSubscriptions = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        console.log("🔔 Setting up real-time subscriptions for DailyScreen...");

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
      diariesSubscription?.unsubscribe();
      console.log("🔕 Unsubscribed from real-time changes");
    };
  }, [diaries]);

  const today = format(new Date(), "yyyy-MM-dd");

  const handleSave = async () => {
    if (!selectedMood) return;

    // Always add a new entry (multiple entries per day)
    await addDiary({ date: today, moodTag: selectedMood, note });

    setSelectedMood(null);
    setNote("");
  };

  const handleEdit = (id: string, moodTag: MoodTag, existingNote?: string) => {
    setSelectedMood(moodTag);
    setNote(existingNote || "");
    deleteDiary(id);
  };

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
    <View className="flex-1">
      <LinearGradient
        colors={["#E6D5F5", "#F5E6FA", "#FAF0FF"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <SafeAreaView className="flex-1" edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Glowing Sparkles Background */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <View style={{ position: "absolute", top: "10%", left: "10%" }}>
              <Ionicons name="sparkles" size={40} color="#C7B0F8" style={{ opacity: 0.2 }} />
            </View>
            <View style={{ position: "absolute", top: "25%", right: "15%" }}>
              <Ionicons name="sparkles" size={50} color="#D4C5F9" style={{ opacity: 0.15 }} />
            </View>
            <View style={{ position: "absolute", top: "45%", left: "20%" }}>
              <Ionicons name="sparkles" size={35} color="#C7B0F8" style={{ opacity: 0.12 }} />
            </View>
            <View style={{ position: "absolute", top: "60%", right: "10%" }}>
              <Ionicons name="sparkles" size={45} color="#D4C5F9" style={{ opacity: 0.18 }} />
            </View>
            <View style={{ position: "absolute", top: "80%", left: "15%" }}>
              <Ionicons name="sparkles" size={38} color="#C7B0F8" style={{ opacity: 0.14 }} />
            </View>
            <View style={{ position: "absolute", top: "35%", right: "25%" }}>
              <Ionicons name="sparkles" size={42} color="#D4C5F9" style={{ opacity: 0.12 }} />
            </View>
          </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} style={{ zIndex: 1 }}>
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text className="text-3xl font-bold text-gray-800">{t("daily")}</Text>
          </View>

          {/* Mood Selection */}
          <View className="px-6 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              {t("howAreYouFeeling")}
            </Text>

            <View className="flex-row justify-between flex-wrap">
              {MOODS.map((mood) => (
                <Pressable
                  key={mood.tag}
                  onPress={() => setSelectedMood(mood.tag)}
                  className="items-center mb-4"
                  style={{ width: "22%" }}
                >
                  <View
                    className="rounded-full items-center justify-center mb-2"
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: selectedMood === mood.tag ? mood.color : `${mood.color}80`,
                      borderWidth: selectedMood === mood.tag ? 3 : 0,
                      borderColor: "#FFFFFF",
                      transform: [{ scale: selectedMood === mood.tag ? 1.1 : 1 }],
                      shadowColor: mood.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: selectedMood === mood.tag ? 0.4 : 0.2,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <Ionicons
                      name={mood.icon}
                      size={40}
                      color="white"
                    />
                  </View>
                  <Text
                    className="text-xs font-semibold text-center"
                    style={{
                      color: selectedMood === mood.tag ? "#1F2937" : "#6B7280",
                    }}
                  >
                    {mood.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Note Input */}
          {selectedMood && (
            <View className="px-6 mb-6">
              <Text className="text-base font-medium text-gray-700 mb-2">
                {t("addNote")}
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={t("addNote")}
                multiline
                numberOfLines={4}
                className="bg-white/80 rounded-2xl p-4 text-base text-gray-800 shadow-sm"
                placeholderTextColor="#9CA3AF"
                style={{ minHeight: 100, textAlignVertical: "top" }}
              />

              <Pressable
                onPress={handleSave}
                className="rounded-2xl p-4 items-center mt-4 shadow-lg active:opacity-80"
                style={{ backgroundColor: "#FF6B95" }}
              >
                <Text className="text-white font-semibold text-base">{t("saveEntry")}</Text>
              </Pressable>
            </View>
          )}

          {/* Diary Entries */}
          <View className="px-6 pb-8">
            <Text className="text-lg font-bold text-gray-800 mb-4">{t("yourEntries")}</Text>

            {diaries.length === 0 ? (
              <View className="items-center justify-center py-12 bg-white/60 rounded-3xl">
                <Text style={{ fontSize: 64, marginBottom: 12 }}>💖</Text>
                <Text className="text-center text-gray-500">{t("noEntries")}</Text>
              </View>
            ) : (
              <View>
                {diaries.map((entry) => (
                  <View
                    key={entry.id}
                    className="bg-white/80 rounded-2xl p-4 mb-3 shadow-sm"
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
                            {format(new Date(entry.date), "MMM d, yyyy")}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row">
                        <Pressable
                          onPress={() => handleEdit(entry.id, entry.moodTag, entry.note)}
                          className="p-2 mr-1"
                        >
                          <Text style={{ fontSize: 20 }}>✏️</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => deleteDiary(entry.id)}
                          className="p-2"
                        >
                          <Text style={{ fontSize: 20 }}>🗑️</Text>
                        </Pressable>
                      </View>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
    </View>
  );
}
