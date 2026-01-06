import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps = 5,
}: ProgressIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <View
          key={step}
          style={[
            styles.dash,
            step <= currentStep ? styles.dashActive : styles.dashInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Responsive.v.xl,
    paddingBottom: Responsive.v.sm,
    gap: Responsive.g.sm,
  },
  dash: {
    width: rScale(40),
    height: rVerticalScale(4),
    borderRadius: Responsive.r.sm,
  },
  dashActive: {
    backgroundColor: Colors.primary,
  },
  dashInactive: {
    backgroundColor: Colors.lightGray,
  },
});

