import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";

/**
 * Component that handles navigation when notifications are tapped
 * Must be rendered inside router context
 */
export default function NotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    // Check for initial notification (app opened from notification)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        if (
          data?.type === "incoming_call" ||
          data?.screen === "/sessions/incoming-call"
        ) {
          setTimeout(() => {
            router.replace("/sessions/incoming-call");
          }, 500);
        }
      }
    });

    // Listen for user tapping on or interacting with a notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        // Navigate to incoming call screen when notification is tapped
        if (
          data?.type === "incoming_call" ||
          data?.screen === "/sessions/incoming-call"
        ) {
          router.replace("/sessions/incoming-call");
        }
      });

    return () => {
      responseListener.remove();
    };
  }, [router]);

  return null;
}
