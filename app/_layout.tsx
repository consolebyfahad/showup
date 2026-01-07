import * as Notifications from "expo-notifications";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { rescheduleAllWeeklyNotifications } from "../utils/notifications";
import NotificationHandler from "../components/navigation/NotificationHandler";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Configure notification handler
// Note: shouldShowAlert is deprecated, using shouldShowBanner and shouldShowList instead
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);

  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    "Avenir-Regular": require("../assets/fonts/Avenir Regular.ttf"),
    "Avenir-Light": require("../assets/fonts/Avenir Light.ttf"),
    "Avenir-Book": require("../assets/fonts/Avenir Book.ttf"),
    "Avenir-Heavy": require("../assets/fonts/Avenir Heavy.ttf"),
    "Avenir-Black": require("../assets/fonts/Avenir Black.ttf"),
    "SlacksideOne-Regular": require("../assets/fonts/SlacksideOne-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Reschedule all weekly notifications on app start
    // This ensures notifications are always scheduled even if they were missed
    rescheduleAllWeeklyNotifications();

    // Listen for notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        console.log("📬 Notification received:", notification);
        const data = notification.request.content.data;

        // Reschedule the notification for next week
        if (data?.dayOfWeek !== undefined && data?.time) {
          // Note: We need to reconstruct the time from the notification data
          // For now, we'll reschedule all notifications when app starts
          // A better approach would be to store the time in the notification data
          console.log(
            "🔄 Notification fired, will reschedule on next app start"
          );
        }
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
    };
  }, [fontsLoaded, fontError]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.backgroundAccent,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
