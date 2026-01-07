import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive } from "../../utils/responsive";

interface LifetimeCountProps {
  count: number;
}

export default function LifetimeCount({ count }: LifetimeCountProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Lifetime Yo Twin Count</Text>
        <Text style={styles.count}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Responsive.xl,
    marginBottom: Responsive.v.md,
  },
  content: {
    backgroundColor: Colors.cream,
    borderRadius: Responsive.r.lg,
    padding: Responsive.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
  },
  label: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
    marginBottom: Responsive.v.xs,
    fontFamily: Fonts.slackside,
  },
  count: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
});
