import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Set notification handler
// Note: shouldShowAlert is deprecated, using shouldShowBanner and shouldShowList instead
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
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
  // Note: In development, you can test on simulator but notifications work best on physical devices
  // Removing the Device.isDevice check to allow testing, but keep in mind:
  // - iOS Simulator: Notifications may not work reliably
  // - Android Emulator: Notifications work but may behave differently
  // - Physical devices: Full functionality

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
 * Schedule notification for a specific day of the week (repeats weekly)
 * @param dayOfWeek 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
 */
export async function scheduleWeeklyNotification(
  dayOfWeek: number,
  time: NotificationTime
): Promise<string | null> {
  try {
    // Convert to 24-hour format
    const hour24 = convertTo24Hour(time.hour, time.period);
    const minute = time.minute;

    // Calculate the next occurrence of this day of week
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Convert to our format: 0 = Monday, 6 = Sunday
    const currentDayOfWeek = currentDay === 0 ? 6 : currentDay - 1;
    
    // Calculate days until target day
    let daysUntilTarget = dayOfWeek - currentDayOfWeek;
    if (daysUntilTarget < 0) {
      daysUntilTarget += 7; // Next week
    }
    
    // If it's today, check if the time has passed
    if (daysUntilTarget === 0) {
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      if (currentHour > hour24 || (currentHour === hour24 && currentMin >= minute)) {
        daysUntilTarget = 7; // Schedule for next week
      }
    }

    // Calculate target date
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysUntilTarget);
    targetDate.setHours(hour24, minute, 0, 0);

    // Schedule notification with date trigger
    // Note: For weekly repeating, we'll need to reschedule after each notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Yo Twin is calling! 📞",
        body: "It's time to start. Answer the call to show up for yourself.",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { 
          type: "incoming_call",
          screen: "/sessions/incoming-call",
          dayOfWeek: dayOfWeek,
          hour: time.hour,
          minute: time.minute,
          period: time.period,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: targetDate,
      },
    });

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    console.log(`✅ Weekly notification scheduled for ${dayNames[dayOfWeek]} at ${hour24}:${minute.toString().padStart(2, '0')} (ID: ${notificationId})`);
    console.log(`   Target date: ${targetDate.toLocaleString()}`);
    return notificationId;
  } catch (error) {
    console.error("Error scheduling weekly notification:", error);
    // Fallback: try with date-based trigger
    try {
      const hour24 = convertTo24Hour(time.hour, time.period);
      const min = time.minute;
      const now = new Date();
      const currentDay = now.getDay();
      const currentDayOfWeek = currentDay === 0 ? 6 : currentDay - 1;
      let daysUntilTarget = dayOfWeek - currentDayOfWeek;
      if (daysUntilTarget < 0) daysUntilTarget += 7;
      if (daysUntilTarget === 0) {
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        if (currentHour > hour24 || (currentHour === hour24 && currentMin >= min)) {
          daysUntilTarget = 7;
        }
      }
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + daysUntilTarget);
      targetDate.setHours(hour24, min, 0, 0);

      return await Notifications.scheduleNotificationAsync({
        content: {
          title: "Yo Twin is calling! 📞",
          body: "It's time to start. Answer the call to show up for yourself.",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { 
            type: "incoming_call",
            screen: "/sessions/incoming-call",
            dayOfWeek: dayOfWeek,
            hour: time.hour,
            minute: time.minute,
            period: time.period,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: targetDate,
        },
      });
    } catch (fallbackError) {
      console.error("Fallback scheduling also failed:", fallbackError);
      return null;
    }
  }
}

/**
 * Schedule daily notification at the specified time (for backward compatibility)
 * @deprecated Use scheduleWeeklyNotification for day-specific scheduling
 */
export async function scheduleDailyNotification(
  time: NotificationTime
): Promise<string | null> {
  try {
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

/**
 * Reschedule a weekly notification after it fires
 * This should be called when a notification is received or when app starts
 */
export async function rescheduleWeeklyNotification(
  dayOfWeek: number,
  time: NotificationTime
): Promise<string | null> {
  console.log(`🔄 Rescheduling weekly notification for day ${dayOfWeek}`);
  return scheduleWeeklyNotification(dayOfWeek, time);
}

/**
 * Reschedule all weekly notifications from stored onboarding data
 * Call this on app start to ensure notifications are always scheduled
 */
export async function rescheduleAllWeeklyNotifications(): Promise<void> {
  try {
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    const onboardingDataStr = await AsyncStorage.getItem("@yo_twin_onboarding_data");
    
    if (!onboardingDataStr) {
      console.log("ℹ️ No onboarding data found, skipping notification rescheduling");
      return;
    }

    const onboardingData = JSON.parse(onboardingDataStr);
    const selectedDays = onboardingData.selectedDays || [];

    // Check permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn("⚠️ Notification permissions not granted, cannot reschedule");
      return;
    }

    // Get existing scheduled notifications for debugging
    const existingNotifications = await getScheduledNotifications();
    console.log(`📋 Found ${existingNotifications.length} existing scheduled notification(s)`);

    // Cancel all existing notifications
    await cancelAllNotifications();
    console.log("🗑️ Cancelled all existing notifications");

    // Reschedule all selected days
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let scheduledCount = 0;

    for (const daySchedule of selectedDays) {
      if (daySchedule.selected && daySchedule.time) {
        const dayIndex = DAYS.indexOf(daySchedule.day);
        if (dayIndex !== -1) {
          const notificationId = await scheduleWeeklyNotification(dayIndex, daySchedule.time);
          if (notificationId) {
            scheduledCount++;
          } else {
            console.warn(`⚠️ Failed to schedule notification for ${daySchedule.day}`);
          }
        }
      }
    }

    // Verify scheduled notifications
    const newNotifications = await getScheduledNotifications();
    console.log(`✅ Rescheduled ${scheduledCount} weekly notification(s)`);
    console.log(`📋 Total scheduled notifications: ${newNotifications.length}`);
    
    // Log all scheduled notifications for debugging
    newNotifications.forEach((notif, index) => {
      const trigger = notif.trigger as any;
      const date = trigger?.date ? new Date(trigger.date) : null;
      console.log(`   ${index + 1}. ${date ? date.toLocaleString() : 'Unknown date'}`);
    });
  } catch (error) {
    console.error("❌ Error rescheduling weekly notifications:", error);
  }
}


