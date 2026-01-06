import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps = 8,
}: ProgressIndicatorProps) {
  const scaleAnims = useRef(
    Array.from({ length: totalSteps }, () => new Animated.Value(1))
  ).current;

  useEffect(() => {
    // Animate the current step bar
    const currentIndex = currentStep - 1;
    if (currentIndex >= 0 && currentIndex < totalSteps) {
      Animated.sequence([
        Animated.timing(scaleAnims[currentIndex], {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnims[currentIndex], {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Reset previous steps
    for (let i = 0; i < currentIndex; i++) {
      Animated.timing(scaleAnims[i], {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }

    // Reset future steps
    for (let i = currentIndex + 1; i < totalSteps; i++) {
      Animated.timing(scaleAnims[i], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStep, totalSteps]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
        (step, index) => {
          const isActive = step <= currentStep;
          const isCurrent = step === currentStep;

          return (
            <Animated.View
              key={step}
              style={[
                styles.dash,
                isActive ? styles.dashActive : styles.dashInactive,
                {
                  transform: [{ scaleY: scaleAnims[index] }],
                  width: isActive ? rScale(28) : rScale(20),
                },
              ]}
            />
          );
        }
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Responsive.v.xxl,
    paddingBottom: Responsive.v.sm,
    gap: Responsive.g.sm,
  },
  dash: {
    height: rVerticalScale(3),
    borderRadius: Responsive.r.sm,
  },
  dashActive: {
    backgroundColor: Colors.primary,
  },
  dashInactive: {
    backgroundColor: Colors.lightGray,
  },
});
