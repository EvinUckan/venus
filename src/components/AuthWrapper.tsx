import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { getCurrentUser } from "../api/supabase-service";
import useVenusStore from "../state/venusStore";
import AuthScreen from "../screens/AuthScreen";
import OnboardingQuestionsScreen from "../screens/OnboardingQuestionsScreen";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const userId = useVenusStore((s) => s.userId);
  const setUserId = useVenusStore((s) => s.setUserId);
  const syncFromSupabase = useVenusStore((s) => s.syncFromSupabase);
  const settings = useVenusStore((s) => s.settings);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
        setIsAuthenticated(true);
        await syncFromSupabase();

        // Check if onboarding is complete
        if (!settings.hasCompletedOnboarding) {
          setShowOnboarding(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleAuthSuccess = async () => {
    setIsAuthenticated(true);
    // After successful auth, show onboarding questions
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Show loading spinner while checking auth
  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" }}>
        <ActivityIndicator size="large" color="#FF6B95" />
      </View>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Show onboarding questions if authenticated but not completed onboarding
  if (showOnboarding) {
    return <OnboardingQuestionsScreen onComplete={handleOnboardingComplete} />;
  }

  // Show main app if authenticated and onboarding complete
  return <>{children}</>;
}
