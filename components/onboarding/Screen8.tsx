import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale } from "../../utils/responsive";

interface Screen8Props {
  // No props needed - this is the final confirmation screen
}

export default function Screen8({}: Screen8Props) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/Lottie/Handshake Loop.json")}
        autoPlay
        loop
        style={styles.handshakeIcon}
      />
      <Text style={styles.confirmationText}>
        Bet! Ever wondered what it's{'\n'}
        like having a twin? <Text style={styles.boldText}>Guess what?</Text>{'\n'}
        Your <Text style={styles.boldText}>better half</Text> will be calling.{'\n'}
        So when it's time, "Yooo twin{'\n'}
        (YOT), Pick up!"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Responsive.xl,
  },
  handshakeIcon: {
    width: rScale(120),
    height: rScale(120),
    marginBottom: Responsive.v.xxl,
  },
  confirmationText: {
    fontSize: Responsive.f.xl,
    color: Colors.black,
    textAlign: "left",
    lineHeight: Responsive.f.xl * 1.6,
    fontFamily: Fonts.avenir.regular,
  },
  boldText: {
    fontWeight: "700",
    fontFamily: Fonts.avenir.heavy,
  },
});

