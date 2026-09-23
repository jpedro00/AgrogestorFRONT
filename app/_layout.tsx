import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/auth/AuthContext";
import { ExperienceProvider } from "../src/contexts/ExperienceContext";
import { MarketplaceProvider } from "../src/contexts/MarketplaceContext";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ExperienceProvider>
          <MarketplaceProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, animation: "none" }} />
          </MarketplaceProvider>
        </ExperienceProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
