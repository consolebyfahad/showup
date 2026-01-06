import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

interface Screen6Props {
  currentDay: string;
  selectedTime: { hour: number; minute: number; period: "AM" | "PM" };
  onTimeChange: (time: {
    hour?: number;
    minute?: number;
    period?: "AM" | "PM";
  }) => void;
}

export default function Screen6({
  currentDay,
  selectedTime,
  onTimeChange,
}: Screen6Props) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45]; // Common minute intervals
  const periods: ("AM" | "PM")[] = ["AM", "PM"];

  const formatTime = () => {
    const hour = selectedTime.hour.toString().padStart(2, "0");
    const minute = selectedTime.minute.toString().padStart(2, "0");
    return `${hour}:${minute} ${selectedTime.period}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{currentDay}</Text>
      </View>
      
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
        <Text style={styles.selectedTimeText}>{formatTime()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  dayHeader: {
    backgroundColor: Colors.cream,
    borderRadius: Responsive.r.md,
    paddingVertical: Responsive.v.sm,
    paddingHorizontal: Responsive.lg,
    alignSelf: "flex-start",
    marginBottom: Responsive.v.lg,
  },
  dayText: {
    fontSize: Responsive.f.lg,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: Fonts.avenir.heavy,
  },
  questionText: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.xl,
    lineHeight: Responsive.f.xxxl * 1.3,
    fontFamily: Fonts.avenir.heavy,
  },
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: rVerticalScale(20),
    marginBottom: Responsive.v.lg,
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
    fontSize: Responsive.f.md,
    color: Colors.gray,
    fontFamily: Fonts.avenir.regular,
  },
  timeOptionTextSelected: {
    fontSize: Responsive.f.lg,
    fontWeight: "700",
    color: Colors.black,
    fontFamily: Fonts.avenir.heavy,
  },
  timeSeparator: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "600",
    color: Colors.black,
    marginHorizontal: Responsive.sm,
    fontFamily: Fonts.avenir.heavy,
  },
  selectedTimeDisplay: {
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    alignItems: "center",
    marginTop: Responsive.v.lg,
    marginBottom: Responsive.v.xl,
  },
  selectedTimeText: {
    fontSize: Responsive.f.xl,
    fontWeight: "600",
    color: Colors.black,
    fontFamily: Fonts.avenir.heavy,
  },
});
