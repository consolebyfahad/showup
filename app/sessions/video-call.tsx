import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

const SESSION_DURATION_SECONDS = 180; // 3 minutes

export default function VideoCall() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION_SECONDS);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    if (permission?.granted) {
      startSession();
    } else if (permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    if (!isSessionActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSessionActive(false);
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
  }, [isSessionActive, timeRemaining, router]);

  const startSession = () => {
    setIsSessionActive(true);
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
      <CameraView
        style={styles.camera}
        facing={CameraType.front}
        mode="picture"
      >
        {/* Timer Overlay */}
        <View style={styles.timerOverlay}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.timerLabel}>Keep going! You're doing great</Text>
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
  },
  permissionText: {
    fontSize: Responsive.f.lg,
    color: Colors.white,
    textAlign: "center",
    padding: Responsive.xl,
  },
});
