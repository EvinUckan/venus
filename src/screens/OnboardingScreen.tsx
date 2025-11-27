import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useVenusStore from "../state/venusStore";

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");

  const updateSettings = useVenusStore((s) => s.updateSettings);

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && cycleLength) {
      setStep(3);
    }
  };

  const handleComplete = () => {
    const cycle = parseInt(cycleLength);
    const period = parseInt(periodLength);

    // Save settings with default values if invalid
    updateSettings({
      name: name.trim() || "User",
      cycleLength: cycle >= 21 && cycle <= 45 ? cycle : 28,
      periodLength: period >= 2 && period <= 10 ? period : 5,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FDEEF4" }} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Progress Dots */}
          <View className="flex-row justify-center mb-12">
            <View
              className={`w-2 h-2 rounded-full mx-1 ${step >= 1 ? "bg-pink-500" : "bg-gray-300"}`}
            />
            <View
              className={`w-2 h-2 rounded-full mx-1 ${step >= 2 ? "bg-pink-500" : "bg-gray-300"}`}
            />
            <View
              className={`w-2 h-2 rounded-full mx-1 ${step >= 3 ? "bg-pink-500" : "bg-gray-300"}`}
            />
          </View>

          {/* Step 1: Name */}
          {step === 1 && (
            <View>
              <Text className="text-4xl font-bold text-gray-800 mb-4">
                Hello, welcome to Venus
              </Text>
              <Text className="text-lg text-gray-600 mb-8">
                What is your name?
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                className="bg-white rounded-2xl px-6 py-5 text-xl text-gray-800 mb-6"
                autoCapitalize="words"
                autoFocus
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              />
              <Pressable
                onPress={handleNext}
                disabled={!name.trim()}
                className={`rounded-2xl p-5 items-center ${
                  name.trim() ? "bg-pink-500" : "bg-gray-300"
                }`}
              >
                <Text className="text-white font-bold text-lg">Next</Text>
              </Pressable>
            </View>
          )}

          {/* Step 2: Cycle Length */}
          {step === 2 && (
            <View>
              <Text className="text-4xl font-bold text-gray-800 mb-4">
                Average cycle length
              </Text>
              <Text className="text-lg text-gray-600 mb-2">
                How many days is your cycle?
              </Text>
              <Text className="text-sm text-gray-500 mb-8">
                Usually between 21-45 days
              </Text>
              <TextInput
                value={cycleLength}
                onChangeText={setCycleLength}
                placeholder="28"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                className="bg-white rounded-2xl px-6 py-5 text-xl text-gray-800 mb-6"
                autoFocus
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              />
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={() => setStep(1)}
                  className="flex-1 bg-gray-200 rounded-2xl p-5 items-center"
                >
                  <Text className="text-gray-800 font-semibold text-lg">Back</Text>
                </Pressable>
                <Pressable
                  onPress={handleNext}
                  disabled={!cycleLength}
                  className={`flex-1 rounded-2xl p-5 items-center ${
                    cycleLength ? "bg-pink-500" : "bg-gray-300"
                  }`}
                >
                  <Text className="text-white font-bold text-lg">Next</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Step 3: Period Length */}
          {step === 3 && (
            <View>
              <Text className="text-4xl font-bold text-gray-800 mb-4">
                Average period length
              </Text>
              <Text className="text-lg text-gray-600 mb-2">
                How many days does your period last?
              </Text>
              <Text className="text-sm text-gray-500 mb-8">
                Usually between 2-10 days
              </Text>
              <TextInput
                value={periodLength}
                onChangeText={setPeriodLength}
                placeholder="5"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                className="bg-white rounded-2xl px-6 py-5 text-xl text-gray-800 mb-6"
                autoFocus
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              />
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={() => setStep(2)}
                  className="flex-1 bg-gray-200 rounded-2xl p-5 items-center"
                >
                  <Text className="text-gray-800 font-semibold text-lg">Back</Text>
                </Pressable>
                <Pressable
                  onPress={handleComplete}
                  className="flex-1 bg-pink-500 rounded-2xl p-5 items-center"
                >
                  <Text className="text-white font-bold text-lg">Get Started</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
