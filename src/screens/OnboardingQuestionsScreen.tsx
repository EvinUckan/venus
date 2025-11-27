import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useVenusStore from "../state/venusStore";

interface OnboardingQuestionsScreenProps {
  onComplete: () => void;
}

export default function OnboardingQuestionsScreen({
  onComplete,
}: OnboardingQuestionsScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");
  const [error, setError] = useState("");

  const updateSettings = useVenusStore((s) => s.updateSettings);

  const handleNext = () => {
    setError("");

    if (step === 1) {
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const cycle = parseInt(cycleLength);
      if (isNaN(cycle) || cycle < 21 || cycle > 45) {
        setError("Please enter a cycle length between 21-45 days");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const period = parseInt(periodLength);
      if (isNaN(period) || period < 2 || period > 10) {
        setError("Please enter a period length between 2-10 days");
        return;
      }
      // Save all settings and complete onboarding
      updateSettings({
        name: name.trim(),
        cycleLength: parseInt(cycleLength),
        periodLength: parseInt(periodLength),
        hasCompletedOnboarding: true,
      });
      onComplete();
    }
  };

  const handleBack = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-pink-100 items-center justify-center mb-4">
                <Ionicons name="person" size={36} color="#FF6B95" />
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Welcome to Venus
              </Text>
              <Text className="text-lg text-gray-600 text-center px-4">
                {"Let's personalize your experience"}
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-700 mb-3 text-center">
                What is your name?
              </Text>
              <View className="bg-white rounded-2xl px-4 py-4 border-2 border-gray-100">
                <TextInput
                  className="text-base text-gray-800 text-center"
                  placeholder="Enter your name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                />
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-pink-100 items-center justify-center mb-4">
                <Ionicons name="calendar" size={36} color="#FF6B95" />
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Your Cycle
              </Text>
              <Text className="text-lg text-gray-600 text-center px-4">
                Help us understand your body better
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-700 mb-3 text-center">
                What is your average cycle length?
              </Text>
              <Text className="text-sm text-gray-500 mb-4 text-center">
                (Number of days from first day of period to first day of next
                period)
              </Text>
              <View className="bg-white rounded-2xl px-4 py-4 border-2 border-gray-100 flex-row items-center justify-center">
                <TextInput
                  className="text-2xl font-bold text-gray-800 text-center"
                  placeholder="28"
                  placeholderTextColor="#9CA3AF"
                  value={cycleLength}
                  onChangeText={setCycleLength}
                  keyboardType="number-pad"
                  autoFocus
                  maxLength={2}
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                />
                <Text className="text-2xl font-semibold text-gray-500 ml-2">
                  days
                </Text>
              </View>
              <Text className="text-xs text-gray-400 mt-2 text-center">
                Typical range: 21-45 days
              </Text>
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-pink-100 items-center justify-center mb-4">
                <Ionicons name="water" size={36} color="#FF6B95" />
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Your Period
              </Text>
              <Text className="text-lg text-gray-600 text-center px-4">
                Almost done!
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-700 mb-3 text-center">
                What is your average period length?
              </Text>
              <Text className="text-sm text-gray-500 mb-4 text-center">
                (The number of days your period typically lasts)
              </Text>
              <View className="bg-white rounded-2xl px-4 py-4 border-2 border-gray-100 flex-row items-center justify-center">
                <TextInput
                  className="text-2xl font-bold text-gray-800 text-center"
                  placeholder="5"
                  placeholderTextColor="#9CA3AF"
                  value={periodLength}
                  onChangeText={setPeriodLength}
                  keyboardType="number-pad"
                  autoFocus
                  maxLength={2}
                  returnKeyType="done"
                  onSubmitEditing={handleNext}
                />
                <Text className="text-2xl font-semibold text-gray-500 ml-2">
                  days
                </Text>
              </View>
              <Text className="text-xs text-gray-400 mt-2 text-center">
                Typical range: 2-10 days
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <LinearGradient
        colors={["#FFE5F0", "#FFF0F8", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="flex-1 px-8 justify-center">
                {/* Progress Dots */}
                <View className="flex-row justify-center mb-8">
                  {[1, 2, 3].map((dotStep) => (
                    <View
                      key={dotStep}
                      className={`w-3 h-3 rounded-full mx-1.5 ${
                        dotStep === step
                          ? "bg-pink-500"
                          : dotStep < step
                          ? "bg-pink-300"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </View>

                {/* Step Content */}
                {renderStep()}

                {/* Error Message */}
                {error ? (
                  <View className="bg-red-50 rounded-xl p-3 mb-4">
                    <Text className="text-red-600 text-sm text-center">
                      {error}
                    </Text>
                  </View>
                ) : null}

                {/* Navigation Buttons */}
                <View className="flex-row justify-between items-center mt-8">
                  {/* Back Button */}
                  {step > 1 ? (
                    <Pressable
                      onPress={handleBack}
                      className="flex-row items-center py-3 px-6"
                    >
                      <Ionicons
                        name="chevron-back"
                        size={20}
                        color="#9CA3AF"
                      />
                      <Text className="text-gray-600 text-base font-semibold ml-1">
                        Back
                      </Text>
                    </Pressable>
                  ) : (
                    <View />
                  )}

                  {/* Next/Finish Button */}
                  <Pressable
                    onPress={handleNext}
                    className="bg-pink-500 rounded-2xl py-3 px-8 flex-row items-center"
                  >
                    <Text className="text-white text-base font-bold mr-1">
                      {step === 3 ? "Finish" : "Next"}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                  </Pressable>
                </View>

                {/* Step Indicator Text */}
                <Text className="text-center text-gray-400 text-sm mt-6">
                  Step {step} of 3
                </Text>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
