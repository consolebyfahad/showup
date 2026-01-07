import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

const SESSION_DURATION_SECONDS = 180; // 3 minutes
const SESSION_STATE_KEY = "@yo_twin_active_session_state";

interface SessionState {
  timeRemaining: number;
  sessionStartTime: number; // timestamp when session started
  lastPauseTime?: number; // timestamp when app went to background
  totalPausedTime: number; // total time paused in seconds
}

export default function VideoCall() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION_SECONDS);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isAppActive, setIsAppActive] = useState(true); // Track if app is in foreground
  const sessionStartTimeRef = useRef<number | null>(null);
  const lastPauseTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef<number>(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Load session state on mount
  useEffect(() => {
    loadSessionState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      handleAppStateChange(nextAppState);
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSessionActive, timeRemaining]);

  useEffect(() => {
    if (permission?.granted) {
      startSession();
    } else if (permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    // Only run timer when session is active AND app is in foreground
    if (!isSessionActive || timeRemaining <= 0 || !isAppActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSessionActive(false);
          clearSessionState();
          // Navigate to completion screen
          setTimeout(() => {
            router.replace("/sessions/complete");
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive, timeRemaining, isAppActive, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSessionActive) {
        // Save state when component unmounts (user navigates away)
        saveSessionState();
      }
    };
  }, [isSessionActive, timeRemaining]);

  const loadSessionState = async () => {
    try {
      const stateJson = await AsyncStorage.getItem(SESSION_STATE_KEY);
      if (stateJson) {
        const state: SessionState = JSON.parse(stateJson);
        const now = Date.now();

        // Calculate elapsed time since session started
        const totalElapsed = Math.floor((now - state.sessionStartTime) / 1000);

        // Calculate paused time
        let pausedTime = state.totalPausedTime;
        if (state.lastPauseTime) {
          // Add time spent in background since last pause
          pausedTime += Math.floor((now - state.lastPauseTime) / 1000);
        }

        // Calculate actual time remaining
        const activeTime = totalElapsed - pausedTime;
        const calculatedTimeRemaining = Math.max(
          0,
          SESSION_DURATION_SECONDS - activeTime
        );

        if (calculatedTimeRemaining > 0) {
          setTimeRemaining(calculatedTimeRemaining);
          totalPausedTimeRef.current = pausedTime;
          sessionStartTimeRef.current = state.sessionStartTime;
          lastPauseTimeRef.current = null; // Clear pause time since we're active now
          setIsSessionActive(true);
        } else {
          // Session expired while in background
          clearSessionState();
          setTimeRemaining(0);
          setIsSessionActive(false);
          // Navigate to completion screen
          setTimeout(() => {
            router.replace("/sessions/complete");
          }, 500);
        }
      }
    } catch (error) {
      // Error loading session state
    }
  };

  const saveSessionState = async (currentTimeRemaining?: number) => {
    try {
      const state: SessionState = {
        timeRemaining: currentTimeRemaining ?? timeRemaining,
        sessionStartTime: sessionStartTimeRef.current || Date.now(),
        lastPauseTime: Date.now(),
        totalPausedTime: totalPausedTimeRef.current,
      };
      await AsyncStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      // Error saving session state
    }
  };

  const clearSessionState = async () => {
    try {
      await AsyncStorage.removeItem(SESSION_STATE_KEY);
      sessionStartTimeRef.current = null;
      lastPauseTimeRef.current = null;
      totalPausedTimeRef.current = 0;
    } catch (error) {
      // Error clearing session state
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App came to foreground
      setIsAppActive(true);
      if (isSessionActive && sessionStartTimeRef.current) {
        // Reload state to recalculate time remaining
        loadSessionState();
      } else if (sessionStartTimeRef.current) {
        // Session was active but timer stopped, try to resume
        loadSessionState();
      }
    } else if (
      appStateRef.current === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      // App went to background - pause timer
      setIsAppActive(false);
      if (isSessionActive) {
        lastPauseTimeRef.current = Date.now();
        saveSessionState(timeRemaining);
        // Timer will stop automatically because isAppActive is now false
      }
    }
    appStateRef.current = nextAppState;
  };

  const startSession = () => {
    const now = Date.now();
    sessionStartTimeRef.current = now;
    totalPausedTimeRef.current = 0;
    lastPauseTimeRef.current = null;
    setIsSessionActive(true);

    // Save initial state
    const state: SessionState = {
      timeRemaining: SESSION_DURATION_SECONDS,
      sessionStartTime: now,
      totalPausedTime: 0,
    };
    AsyncStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state)).catch(() => {
      // Error saving initial session state
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to start your session
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <CameraView style={styles.camera} facing="front" mode="picture">
        {/* Timer Overlay */}
        <View style={styles.timerOverlay}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.timerLabel}>
              Keep going! You're doing great
            </Text>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.messageOverlay}>
          <Text style={styles.messageText}>
            Show up for yourself. You've got this! 💪
          </Text>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  camera: {
    flex: 1,
  },
  timerOverlay: {
    position: "absolute",
    top: Responsive.v.xxl,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  timerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.md,
    borderRadius: Responsive.r.xl,
    alignItems: "center",
  },
  timerText: {
    fontSize: Responsive.f.xxxl * 1.5,
    fontWeight: "700",
    color: Colors.white,
    fontFamily: "monospace",
    marginBottom: Responsive.v.xs,
  },
  timerLabel: {
    fontSize: Responsive.f.md,
    color: Colors.white,
    opacity: 0.9,
    fontFamily: Fonts.slackside,
  },
  messageOverlay: {
    position: "absolute",
    bottom: Responsive.v.xxxl,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: Responsive.xl,
  },
  messageText: {
    fontSize: Responsive.f.lg,
    fontWeight: "600",
    color: Colors.white,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.md,
    borderRadius: Responsive.r.lg,
    fontFamily: Fonts.avenir.semibold,
  },
  permissionText: {
    fontSize: Responsive.f.lg,
    color: Colors.white,
    textAlign: "center",
    padding: Responsive.xl,
    fontFamily: Fonts.avenir.semibold,
  },
});
