import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

interface Screen5Props {
  selectedTime: { hour: number; minute: number; period: "AM" | "PM" };
  onTimeChange: (time: {
    hour?: number;
    minute?: number;
    period?: "AM" | "PM";
  }) => void;
}

export default function Screen5({ selectedTime, onTimeChange }: Screen5Props) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods: ("AM" | "PM")[] = ["AM", "PM"];

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>You'll do this when?</Text>
      <View style={styles.timePickerContainer}>
        <ScrollView
          style={styles.timeWheel}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.timeWheelContent}
        >
          {hours.map((hour) => (
            <TouchableOpacity
              key={hour}
              style={[
                styles.timeOption,
                selectedTime.hour === hour && styles.timeOptionSelected,
              ]}
              onPress={() => onTimeChange({ hour })}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  selectedTime.hour === hour && styles.timeOptionTextSelected,
                ]}
              >
                {hour.toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.timeSeparator}>:</Text>
        <ScrollView
          style={styles.timeWheel}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.timeWheelContent}
        >
          {minutes.map((minute) => (
            <TouchableOpacity
              key={minute}
              style={[
                styles.timeOption,
                selectedTime.minute === minute && styles.timeOptionSelected,
              ]}
              onPress={() => onTimeChange({ minute })}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  selectedTime.minute === minute && styles.timeOptionTextSelected,
                ]}
              >
                {minute.toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView
          style={styles.timeWheel}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.timeWheelContent}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.timeOption,
                selectedTime.period === period && styles.timeOptionSelected,
              ]}
              onPress={() => onTimeChange({ period })}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  selectedTime.period === period && styles.timeOptionTextSelected,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.selectedTimeDisplay}>
        <Text style={styles.selectedTimeText}>
          {selectedTime.hour.toString().padStart(2, "0")} :{" "}
          {selectedTime.minute.toString().padStart(2, "0")}{" "}
          {selectedTime.period}
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
  questionText: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.xl,
    lineHeight: Responsive.f.xxxl * 1.3,
  },
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: rVerticalScale(40),
    marginBottom: Responsive.v.xl,
    gap: Responsive.g.sm,
  },
  timeWheel: {
    flex: 1,
    maxHeight: rVerticalScale(200),
  },
  timeWheelContent: {
    alignItems: "center",
    paddingVertical: rVerticalScale(80),
  },
  timeOption: {
    paddingVertical: Responsive.v.md,
    paddingHorizontal: Responsive.lg,
    marginVertical: Responsive.v.xs,
    borderRadius: Responsive.r.sm,
    minWidth: rScale(60),
    alignItems: "center",
  },
  timeOptionSelected: {
    backgroundColor: Colors.backgroundAccent,
  },
  timeOptionText: {
    fontSize: Responsive.f.xl,
    color: Colors.gray,
  },
  timeOptionTextSelected: {
    fontSize: Responsive.f.xxl,
    fontWeight: "700",
    color: Colors.black,
  },
  timeSeparator: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "600",
    color: Colors.black,
    marginHorizontal: Responsive.sm,
  },
  selectedTimeDisplay: {
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    alignItems: "center",
    marginTop: Responsive.v.xl,
  },
  selectedTimeText: {
    fontSize: Responsive.f.xxl,
    fontWeight: "700",
    color: Colors.black,
  },
});

