import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Haptics from "expo-haptics";

import useVenusStore from "../state/venusStore";
import { useTranslation } from "../utils/useTranslation";
import { signOutUser, getCurrentUser } from "../api/supabase-service";

export default function SettingsScreen() {
  const { t } = useTranslation();

  const settings = useVenusStore((s) => s.settings);
  const updateSettings = useVenusStore((s) => s.updateSettings);
  const loadSettingsFromSupabase = useVenusStore((s) => s.loadSettingsFromSupabase);
  const setUserId = useVenusStore((s) => s.setUserId);

  const [name, setName] = useState(settings.name);
  const [cycleLength, setCycleLength] = useState(settings.cycleLength.toString());
  const [periodLength, setPeriodLength] = useState(settings.periodLength.toString());
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load settings from Supabase on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserEmail(user.email || null);
        }
        
        await loadSettingsFromSupabase();
        // Update local state with loaded settings
        setName(settings.name);
        setCycleLength(settings.cycleLength.toString());
        setPeriodLength(settings.periodLength.toString());
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setInitializing(false);
      }
    };
    
    loadSettings();
  }, []);

  // Update local state when settings change
  useEffect(() => {
    setName(settings.name);
    setCycleLength(settings.cycleLength.toString());
    setPeriodLength(settings.periodLength.toString());
  }, [settings]);

  const handleSave = async () => {
    const cycleLengthNum = parseInt(cycleLength, 10);
    const periodLengthNum = parseInt(periodLength, 10);

    if (cycleLengthNum < 21 || cycleLengthNum > 45) {
      alert(t("invalidCycleLength"));
      return;
    }

    if (periodLengthNum < 2 || periodLengthNum > 10) {
      alert(t("invalidPeriodLength"));
      return;
    }

    setLoading(true);

    try {
      // Trigger heavy haptic feedback for save action
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      await updateSettings({
        name,
        cycleLength: cycleLengthNum,
        periodLength: periodLengthNum,
        language: "en",
      });

      console.log('📊 Settings saved:', {
        cycleLength: cycleLengthNum,
        periodLength: periodLengthNum,
      });

      alert("Settings saved successfully!");
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUserId(null);
      alert("You have been signed out successfully");
      // The app should redirect to auth screen via AuthWrapper
    } catch (error) {
      console.error('Failed to sign out:', error);
      alert("Failed to sign out. Please try again.");
    }
  };

  if (initializing) {
    return (
      <SafeAreaView className="flex-1 bg-venus-pink-50" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B95" />
          <Text className="text-gray-600 mt-4">Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-venus-pink-50" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text className="text-3xl font-bold text-gray-800">{t("settings")}</Text>
          </View>

          {/* Settings Form */}
          <View className="px-6 pb-8">
            {/* Name */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                {t("yourName")}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t("namePlaceholder")}
                className="bg-white rounded-2xl p-4 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Cycle Length */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                {t("averageCycleLength")}
              </Text>
              <View className="bg-white rounded-2xl overflow-hidden">
                <Picker
                  selectedValue={cycleLength}
                  onValueChange={(value) => setCycleLength(value)}
                  style={{ height: 200 }}
                >
                  {Array.from({ length: 25 }, (_, i) => i + 21).map((num) => (
                    <Picker.Item
                      key={num}
                      label={`${num} ${t("days")}`}
                      value={num.toString()}
                    />
                  ))}
                </Picker>
              </View>
              <Text className="text-sm text-gray-500 mt-2">Range: 21-45 days</Text>
            </View>

            {/* Period Length */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                {t("averagePeriodLength")}
              </Text>
              <View className="bg-white rounded-2xl overflow-hidden">
                <Picker
                  selectedValue={periodLength}
                  onValueChange={(value) => setPeriodLength(value)}
                  style={{ height: 200 }}
                >
                  {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
                    <Picker.Item
                      key={num}
                      label={`${num} ${t("days")}`}
                      value={num.toString()}
                    />
                  ))}
                </Picker>
              </View>
              <Text className="text-sm text-gray-500 mt-2">Range: 2-10 days</Text>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              disabled={loading}
              className="bg-venus-rose-500 rounded-2xl p-4 items-center shadow-lg"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold text-lg">{t("save")}</Text>
              )}
            </Pressable>
          </View>

          {/* User Info & Sign Out */}
          <View className="px-6 pb-8">
            {userEmail && (
              <View className="bg-white rounded-2xl p-4 mb-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="person-circle-outline" size={24} color="#FF6B95" />
                  <Text className="text-base font-semibold text-gray-800 ml-2">Account</Text>
                </View>
                <Text className="text-sm text-gray-600 mb-4">{userEmail}</Text>
                
                <Pressable
                  onPress={handleSignOut}
                  className="bg-red-50 rounded-xl p-3 flex-row items-center justify-center"
                >
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  <Text className="text-red-600 font-semibold ml-2">Sign Out</Text>
                </Pressable>
              </View>
            )}

            {/* App Info */}
            <View className="items-center mt-4">
              <View className="w-16 h-16 rounded-full bg-venus-rose-100 items-center justify-center mb-3">
                <Ionicons name="sparkles" size={32} color="#FF809F" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-1">Venus</Text>
              <Text className="text-sm text-gray-500">Your cycle companion</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
