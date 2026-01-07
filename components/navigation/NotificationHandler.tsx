import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef } from "react";

const HANDLED_NOTIFICATIONS_KEY = "@yo_twin_handled_notifications";

/**
 * Component that handles navigation when notifications are tapped
 * Must be rendered inside router context
 */
export default function NotificationHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const hasHandledInitialNotification = useRef(false);
  const handledNotificationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Load previously handled notifications
    AsyncStorage.getItem(HANDLED_NOTIFICATIONS_KEY).then((stored) => {
      if (stored) {
        try {
          const ids = JSON.parse(stored) as string[];
          handledNotificationsRef.current = new Set(ids);
        } catch {
          handledNotificationsRef.current = new Set();
        }
      }
    });

    // Check for initial notification (app opened from notification)
    // Only check once on mount
    if (!hasHandledInitialNotification.current) {
      hasHandledInitialNotification.current = true;

      Notifications.getLastNotificationResponseAsync().then((response) => {
        if (response) {
          const data = response.notification.request.content.data;
          const notificationId = response.notification.request.identifier;
          const notificationDate = response.notification.date;

          // Only handle notifications from the last 5 minutes
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          if (notificationDate < fiveMinutesAgo) {
            return;
          }

          // Don't navigate if we've already handled this notification
          if (handledNotificationsRef.current.has(notificationId)) {
            return;
          }

          if (
            data?.type === "incoming_call" ||
            data?.screen === "/sessions/incoming-call"
          ) {
            // Mark as handled
            handledNotificationsRef.current.add(notificationId);
            AsyncStorage.setItem(
              HANDLED_NOTIFICATIONS_KEY,
              JSON.stringify(Array.from(handledNotificationsRef.current))
            );

            setTimeout(() => {
              // Check current pathname right before navigating
              const currentPath = pathname;
              if (
                currentPath !== "/sessions/incoming-call" &&
                currentPath !== "/sessions/video-call" &&
                currentPath !== "/sessions/complete"
              ) {
                router.replace("/sessions/incoming-call");
              }
            }, 500);
          }
        }
      });
    }

    // Listen for user tapping on or interacting with a notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        const notificationId = response.notification.request.identifier;

        // Don't navigate if we've already handled this notification
        if (handledNotificationsRef.current.has(notificationId)) {
          return;
        }

        // Navigate to incoming call screen when notification is tapped
        // But only if we're not already on a session screen
        if (
          data?.type === "incoming_call" ||
          data?.screen === "/sessions/incoming-call"
        ) {
          // Check current pathname before navigating
          const currentPath = pathname;
          if (
            currentPath !== "/sessions/incoming-call" &&
            currentPath !== "/sessions/video-call" &&
            currentPath !== "/sessions/complete"
          ) {
            // Mark as handled
            handledNotificationsRef.current.add(notificationId);
            AsyncStorage.setItem(
              HANDLED_NOTIFICATIONS_KEY,
              JSON.stringify(Array.from(handledNotificationsRef.current))
            );

            router.replace("/sessions/incoming-call");
          }
        }
      });

    return () => {
      responseListener.remove();
    };
  }, [router, pathname]);

  return null;
}
