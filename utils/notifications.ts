import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationTime {
  hour: number;
  minute: number;
  period: "AM" | "PM";
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn("Must use physical device for Push Notifications");
    return false;
  }

  // Android: Set up notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("yo-twin-reminders", {
      name: "Yo Twin Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#13204B",
      sound: "default",
    });
  }

  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Failed to get push token for push notification!");
    return false;
  }

  return true;
}

/**
 * Convert 12-hour time to 24-hour format
 */
function convertTo24Hour(hour: number, period: "AM" | "PM"): number {
  if (period === "AM") {
    return hour === 12 ? 0 : hour;
  } else {
    return hour === 12 ? 12 : hour + 12;
  }
}

/**
 * Schedule daily notification at the specified time
 */
export async function scheduleDailyNotification(
  time: NotificationTime
): Promise<string | null> {
  try {
    // Cancel any existing daily notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Convert to 24-hour format
    const hour24 = convertTo24Hour(time.hour, time.period);
    const minute = time.minute;

    // Schedule daily notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Yo Twin is calling! 📞",
        body: "It's time to start. Answer the call to show up for yourself.",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { 
          type: "incoming_call",
          screen: "/sessions/incoming-call"
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hour24,
        minute: minute,
        repeats: true,
      },
    });

    console.log("Daily notification scheduled:", notificationId);
    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

