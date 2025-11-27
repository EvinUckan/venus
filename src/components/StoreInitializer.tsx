import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import useVenusStore from "../state/venusStore";
import { initializeAuth } from "../api/auth-helper";

interface StoreInitializerProps {
  children: React.ReactNode;
}

export default function StoreInitializer({ children }: StoreInitializerProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Manually trigger hydration and auth initialization
    const hydrate = async () => {
      try {
        // Initialize store
        if (useVenusStore.persist?.rehydrate) {
          await useVenusStore.persist.rehydrate();
        }
        
        // Initialize authentication
        console.log("[StoreInitializer] Initializing authentication...");
        await initializeAuth();
        console.log("[StoreInitializer] ✅ Authentication initialized");
      } catch (error) {
        console.error("[StoreInitializer] Failed to initialize:", error);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrate();
  }, []);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FDFAF7" }}>
        <ActivityIndicator size="large" color="#FF6B95" />
      </View>
    );
  }

  return <>{children}</>;
}
