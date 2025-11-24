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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { signInUser, signUpUser, createUserProfile, saveUserSettings } from "../api/supabase-service";
import useVenusStore from "../state/venusStore";

type AuthMode = "login" | "signup";

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const setUserId = useVenusStore((s) => s.setUserId);
  const syncFromSupabase = useVenusStore((s) => s.syncFromSupabase);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    setError("");

    // Validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const data = await signUpUser(email, password);
        if (data.user) {
          setUserId(data.user.id);
          
          // Create user profile in database
          try {
            await createUserProfile(data.user.id, email);
            console.log('✅ User profile created');
            
            // Create default settings for new user
            await saveUserSettings({
              user_id: data.user.id,
              cycle_length: 28,
              period_length: 5,
              language: 'en',
            });
            console.log('✅ Default settings created');
          } catch (profileError) {
            console.error('⚠️ Failed to create user profile:', profileError);
            // Continue anyway - auth was successful
          }
          
          onAuthSuccess();
        }
      } else {
        const data = await signInUser(email, password);
        if (data.user) {
          setUserId(data.user.id);
          await syncFromSupabase();
          onAuthSuccess();
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setPassword("");
    setConfirmPassword("");
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
                {/* Logo/Icon Section */}
                <View className="items-center mb-12">
                  <View className="w-24 h-24 rounded-full bg-pink-100 items-center justify-center mb-6">
                    <Ionicons name="flower" size={48} color="#FF6B95" />
                  </View>
                  <Text className="text-4xl font-bold text-gray-800 mb-2">
                    Venus
                  </Text>
                  <Text className="text-lg text-gray-500 text-center">
                    Track your cycle with grace
                  </Text>
                </View>

                {/* Auth Form */}
                <View className="mb-8">
                  <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                  </Text>

                  {/* Email Input */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </Text>
                    <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center border-2 border-gray-100">
                      <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-3 text-base text-gray-800"
                        placeholder="your@email.com"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoCorrect={false}
                        editable={!loading}
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </Text>
                    <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center border-2 border-gray-100">
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#9CA3AF"
                      />
                      <TextInput
                        className="flex-1 ml-3 text-base text-gray-800"
                        placeholder="Enter your password"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                      />
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#9CA3AF"
                        />
                      </Pressable>
                    </View>
                  </View>

                  {/* Confirm Password (Sign Up only) */}
                  {mode === "signup" && (
                    <View className="mb-4">
                      <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </Text>
                      <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center border-2 border-gray-100">
                        <Ionicons
                          name="lock-closed-outline"
                          size={20}
                          color="#9CA3AF"
                        />
                        <TextInput
                          className="flex-1 ml-3 text-base text-gray-800"
                          placeholder="Confirm your password"
                          placeholderTextColor="#9CA3AF"
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                          editable={!loading}
                        />
                      </View>
                    </View>
                  )}

                  {/* Error Message */}
                  {error ? (
                    <View className="bg-red-50 rounded-xl p-3 mb-4">
                      <Text className="text-red-600 text-sm text-center">
                        {error}
                      </Text>
                    </View>
                  ) : null}

                  {/* Auth Button */}
                  <Pressable
                    onPress={handleAuth}
                    disabled={loading}
                    className="bg-pink-500 rounded-2xl py-4 items-center justify-center mb-4"
                    style={{
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text className="text-white text-lg font-bold">
                        {mode === "login" ? "Sign In" : "Create Account"}
                      </Text>
                    )}
                  </Pressable>

                  {/* Switch Mode */}
                  <Pressable onPress={switchMode} disabled={loading}>
                    <Text className="text-center text-gray-600">
                      {mode === "login"
                        ? "Don't have an account? "
                        : "Already have an account? "}
                      <Text className="text-pink-500 font-semibold">
                        {mode === "login" ? "Sign Up" : "Sign In"}
                      </Text>
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
