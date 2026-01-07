import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale } from "../../utils/responsive";

interface MenuCardProps {
  icon: string;
  title: string;
  onPress?: () => void;
}

export default function MenuCard({ icon, title, onPress }: MenuCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={rScale(24)} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Ionicons
        name="chevron-forward"
        size={rScale(20)}
        color={Colors.gray}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.lg,
    padding: Responsive.lg,
    marginBottom: Responsive.v.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginRight: Responsive.md,
  },
  title: {
    flex: 1,
    fontSize: Responsive.f.md,
    fontWeight: "500",
    color: Colors.black,
    fontFamily: Fonts.avenir.regular,
  },
});

