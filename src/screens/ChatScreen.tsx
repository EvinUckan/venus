import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useVenusStore from "../state/venusStore";
import { getPhaseInfo } from "../utils/cycleCalculations";
import { getOpenAITextResponse, getGPT5MiniTextResponse } from "../api/chat-service";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

type AIModel = "gpt-4o" | "gpt-5-mini";

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Venus is here to help you.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>("gpt-4o");
  const scrollViewRef = useRef<ScrollView>(null);

  const cycles = useVenusStore((s) => s.cycles);
  const settings = useVenusStore((s) => s.settings);

  const phaseInfo = getPhaseInfo(cycles, settings.cycleLength, settings.periodLength);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // Build conversation history for AI API
      const conversationHistory = [
        {
          role: "system" as const,
          content: `You are a supportive AI companion for a menstrual cycle tracking app called Venus. The user is currently in their ${phaseInfo.phase} phase, on day ${phaseInfo.daysUntilNextPeriod === 0 ? 1 : settings.cycleLength - phaseInfo.daysUntilNextPeriod} of their cycle. Provide empathetic, personalized advice based on their cycle phase. Be warm, understanding, and supportive. Keep responses concise (2-3 sentences) and encouraging.`,
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        {
          role: "user" as const,
          content: userMessage.content,
        },
      ];

      const response = selectedModel === "gpt-5-mini"
        ? await getGPT5MiniTextResponse(conversationHistory, {
            maxTokens: 500,
          })
        : await getOpenAITextResponse(conversationHistory, {
            model: "gpt-4o",
            maxTokens: 500,
            temperature: 0.9,
          });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "There was an error connecting to the AI. If using OpenAI models, your API key may have exceeded its quota. Please try switching to Grok or add credits at platform.openai.com/settings/organization/billing.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPhaseColor = (): [string, string] => {
    switch (phaseInfo.phase) {
      case "menstrual":
        return ["#F7B2D9", "#FFD4E8"];
      case "follicular":
        return ["#C7B0F8", "#E0D4FF"];
      case "ovulation":
        return ["#9CF7D1", "#C9FFE8"];
      case "luteal":
        return ["#F7C8A5", "#FFE4CE"];
      default:
        return ["#F7B2D9", "#FFD4E8"];
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FDEEF4" }} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <LinearGradient
          colors={getPhaseColor()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 24, paddingVertical: 20 }}
        >
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-white/40 items-center justify-center mr-3">
              <Ionicons name="sparkles" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">AI Support</Text>
              <Text className="text-white/90 text-sm">
                Your {phaseInfo.phase} phase companion
              </Text>
            </View>
          </View>

          {/* Model Selector */}
          <View className="mt-3">
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setSelectedModel("gpt-5-mini")}
                className={`flex-1 py-2 px-3 rounded-full ${selectedModel === "gpt-5-mini" ? "bg-white" : "bg-white/30"}`}
              >
                <Text className={`text-center text-xs font-semibold ${selectedModel === "gpt-5-mini" ? "text-pink-500" : "text-white"}`}>
                  GPT-5 Mini
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedModel("gpt-4o")}
                className={`flex-1 py-2 px-3 rounded-full ${selectedModel === "gpt-4o" ? "bg-white" : "bg-white/30"}`}
              >
                <Text className={`text-center text-xs font-semibold ${selectedModel === "gpt-4o" ? "text-pink-500" : "text-white"}`}>
                  GPT-4o
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              className={`mb-4 ${message.role === "user" ? "items-end" : "items-start"}`}
            >
              <View
                className={`max-w-[80%] rounded-3xl px-5 py-3 ${
                  message.role === "user"
                    ? "bg-pink-500"
                    : "bg-white border border-gray-100"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text
                  className={`text-base leading-6 ${
                    message.role === "user" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View className="items-start mb-4">
              <View className="bg-white border border-gray-100 rounded-3xl px-5 py-4">
                <ActivityIndicator size="small" color="#FF6B95" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View
          className="px-6 pb-6 pt-4 bg-white border-t border-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View className="flex-row items-center bg-gray-50 rounded-full px-5 py-3">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Share how you're feeling..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-base text-gray-800"
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <Pressable
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className={`w-10 h-10 rounded-full items-center justify-center ml-2 ${
                inputText.trim() && !isLoading ? "bg-pink-500" : "bg-gray-300"
              }`}
            >
              <Ionicons
                name="send"
                size={18}
                color="white"
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
