import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale } from "../../utils/responsive";

interface Screen5Props {
  selectedDays: { day: string; selected: boolean }[];
  onDayToggle: (day: string) => void;
  weekStartDate: Date;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Screen5({
  selectedDays,
  onDayToggle,
  weekStartDate,
}: Screen5Props) {
  const formatWeekDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  const getDayColor = (index: number) => {
    // Alternating colors: light blue for even, light yellow for odd
    return index % 2 === 0 ? Colors.backgroundAccent : Colors.cream;
  };

  const getDayTextColor = (index: number) => {
    return index % 2 === 0 ? Colors.primary : Colors.secondary;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Week Reimagined</Text>

      <View style={styles.weekPill}>
        <Text style={styles.weekText}>
          Week of {formatWeekDate(weekStartDate)}
        </Text>
      </View>

      <Text style={styles.recommendation}>
        We recommend 5x a week but you ultimately decide
      </Text>

      <View style={styles.daysContainer}>
        {DAYS.map((day, index) => {
          const dayData = selectedDays.find((d) => d.day === day);
          const isSelected = dayData?.selected || false;

          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                { backgroundColor: getDayColor(index) },
                isSelected && styles.dayButtonSelected,
              ]}
              onPress={() => onDayToggle(day)}
            >
              <Text style={[styles.dayText, { color: getDayTextColor(index) }]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.lg,
    textAlign: "center",
    fontFamily: Fonts.avenir.semibold,
  },
  weekPill: {
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Responsive.r.xxl,
    paddingVertical: Responsive.v.sm,
    paddingHorizontal: Responsive.xl,
    alignSelf: "center",
    marginBottom: Responsive.v.md,
  },
  weekText: {
    color: Colors.primary,
    fontSize: Responsive.f.md,
    fontWeight: "600",
    fontFamily: Fonts.avenir.regular,
  },
  recommendation: {
    fontSize: Responsive.f.md,
    color: Colors.secondary,
    textAlign: "center",
    marginBottom: Responsive.v.xl,
    fontFamily: Fonts.slackside,
  },
  daysContainer: {
    gap: Responsive.v.md,
    marginTop: Responsive.v.lg,
  },
  dayButton: {
    paddingVertical: Responsive.v.lg,
    paddingHorizontal: Responsive.xl,
    borderRadius: Responsive.r.md,
    width: "100%",
    alignItems: "center",
  },
  dayButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dayText: {
    fontSize: Responsive.f.lg,
    fontFamily: Fonts.slackside,
  },
});
