import React from "react";
import useVenusStore from "../state/venusStore";
import OnboardingScreen from "../screens/OnboardingScreen";

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export default function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const hasCompletedOnboarding = useVenusStore((s) => s.settings.hasCompletedOnboarding);

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen />;
  }

  return <>{children}</>;
}
