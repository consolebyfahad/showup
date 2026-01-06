import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive } from "../../utils/responsive";

interface Screen4Props {
  // No props needed - this is an informational screen
}

export default function Screen4({}: Screen4Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        Okay let's actually get after it: We will use the 80/20 rule so you can schedule this one task 5 times over 7 days
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: Responsive.f.xl,
    color: Colors.black,
    textAlign: "center",
    lineHeight: Responsive.f.xl * 1.5,
    paddingHorizontal: Responsive.xl,
    fontFamily: Fonts.avenir.regular,
  },
});

