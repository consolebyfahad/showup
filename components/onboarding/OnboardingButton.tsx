import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive } from "../../utils/responsive";

interface OnboardingButtonProps {
  onPress: () => void;
  disabled?: boolean;
  text: string;
  backgroundColor?: string;
}

export default function OnboardingButton({
  onPress,
  disabled = false,
  text,
  backgroundColor,
}: OnboardingButtonProps) {
  const buttonColor = disabled
    ? Colors.buttonDisabled
    : backgroundColor || Colors.ctaHighlight;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Responsive.v.lg,
    borderRadius: Responsive.r.md,
    marginHorizontal: Responsive.xl,
    marginBottom: Responsive.v.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: Responsive.f.xl,
    fontWeight: "600",
    fontFamily: Fonts.avenir.semibold,
  },
});
