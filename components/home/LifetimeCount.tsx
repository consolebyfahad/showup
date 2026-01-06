import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Responsive } from "../../utils/responsive";

interface LifetimeCountProps {
  count: number;
}

export default function LifetimeCount({ count }: LifetimeCountProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lifetime Yo Twin Count: {count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Responsive.xl,
    marginBottom: Responsive.v.md,
  },
  text: {
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    fontWeight: "500",
  },
});

