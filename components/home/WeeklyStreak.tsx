import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

interface WeeklyStreakProps {
  currentStreak: number;
  totalDays: number;
}

export default function WeeklyStreak({
  currentStreak,
  totalDays = 7,
}: WeeklyStreakProps) {
  return (
    <LinearGradient
      colors={[Colors.gradientBlue, Colors.gradientGreen]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.streakText}>
        WEEKLY STREAK: {currentStreak} {currentStreak === 1 ? "DAY" : "DAYS"}
      </Text>
      <View style={styles.progressContainer}>
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isCompleted = day <= currentStreak;
          return (
            <View
              key={day}
              style={[
                styles.dayBox,
                isCompleted ? styles.dayBoxCompleted : styles.dayBoxIncomplete,
              ]}
            >
              {isCompleted && <Text style={styles.checkmark}>✓</Text>}
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Responsive.r.xl,
    padding: Responsive.xxl,
    marginHorizontal: Responsive.xl,
    marginTop: Responsive.v.lg,
    marginBottom: Responsive.v.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  streakText: {
    fontSize: Responsive.f.xxl,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: Responsive.v.md,
    textAlign: "center",
    fontFamily: Fonts.avenir.heavy,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Responsive.g.sm,
  },
  dayBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Responsive.r.sm,
    justifyContent: "center",
    alignItems: "center",
    minHeight: rVerticalScale(30),
    minWidth: rScale(30),
  },
  dayBoxCompleted: {
    backgroundColor: Colors.white,
  },
  dayBoxIncomplete: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  checkmark: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.gradientGreen,
  },
});
