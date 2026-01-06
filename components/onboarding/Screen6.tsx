import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import {
  Responsive,
  rModerateScale,
  rScale,
  rVerticalScale,
} from "../../utils/responsive";

interface Screen6Props {
  selectedTime: { hour: number; minute: number; period: "AM" | "PM" };
}

export default function Screen6({ selectedTime }: Screen6Props) {
  const timeString = `${selectedTime.hour
    .toString()
    .padStart(2, "0")}:${selectedTime.minute.toString().padStart(2, "0")} ${
    selectedTime.period
  }`;

  return (
    <View style={styles.container}>
      <View style={styles.confirmationCard}>
        <LottieView
          source={require("../../assets/Lottie/Handshake Loop.json")}
          autoPlay
          loop
          style={styles.handshakeIcon}
        />
        <Text style={styles.confirmationText}>
          Bet. See you at {timeString}. {"\n"} Don't worry — all you have to do
          is Yo Twin.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  confirmationCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: rVerticalScale(40),
  },
  handshakeIcon: {
    width: rScale(120),
    height: rScale(120),
    marginBottom: Responsive.v.xxl,
  },
  confirmationText: {
    fontSize: Responsive.f.xxl,
    fontWeight: "600",
    color: Colors.black,
    textAlign: "center",
    lineHeight: rModerateScale(28, 0.3),
  },
});
