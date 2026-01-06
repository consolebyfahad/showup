import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale } from "../../utils/responsive";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    label: string;
    onPress: () => void;
    icon?: string;
  };
  onBackPress?: () => void;
}

export default function Header({
  title,
  showBack = true,
  rightAction,
  onBackPress,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={rScale(24)} color={Colors.black} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {rightAction ? (
        <TouchableOpacity
          onPress={rightAction.onPress}
          style={styles.rightButton}
        >
          {rightAction.icon ? (
            <Ionicons
              name={rightAction.icon as any}
              size={rScale(24)}
              color={Colors.primary}
            />
          ) : (
            <Text style={styles.rightButtonText}>{rightAction.label}</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Responsive.v.xxxl,
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: Responsive.sm,
    paddingTop: Responsive.v.lg,
  },
  placeholder: {
    width: rScale(40),
  },
  titleContainer: {
    flex: 1,
    paddingTop: Responsive.v.sm,
    alignItems: "center",
  },
  title: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.black,
    fontFamily: Fonts.avenir.heavy,
  },
  rightButton: {
    padding: Responsive.sm,
    minWidth: rScale(60),
    alignItems: "flex-end",
  },
  rightButtonText: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: Fonts.slackside,
  },
});
