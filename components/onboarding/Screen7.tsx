import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive } from "../../utils/responsive";

interface Screen7Props {
  selectedDays: {
    day: string;
    selected: boolean;
    time?: { hour: number; minute: number; period: "AM" | "PM" };
  }[];
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

export default function Screen7({ selectedDays, weekStartDate }: Screen7Props) {
  const formatWeekDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  const getDayColor = (index: number, isSelected: boolean) => {
    if (!isSelected) {
      return Colors.lightGray; // Gray for unselected
    }
    // Alternating colors for selected days
    return index % 2 === 0 ? Colors.backgroundAccent : Colors.cream;
  };

  const getDayTextColor = (index: number, isSelected: boolean) => {
    if (!isSelected) {
      return Colors.gray;
    }
    return index % 2 === 0 ? Colors.primary : Colors.secondary;
  };

  const formatTime = (time?: {
    hour: number;
    minute: number;
    period: "AM" | "PM";
  }) => {
    if (!time) return "";
    const hour = time.hour.toString().padStart(2, "0");
    const minute = time.minute.toString().padStart(2, "0");
    return `${hour}:${minute} ${time.period}`;
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
          const time = dayData?.time;

          return (
            <View key={day} style={styles.dayRow}>
              <View
                style={[
                  styles.dayButton,
                  { backgroundColor: getDayColor(index, isSelected) },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: getDayTextColor(index, isSelected) },
                  ]}
                >
                  {day}
                </Text>
              </View>
              {isSelected && time && (
                <Text style={styles.timeText}>{formatTime(time)}</Text>
              )}
            </View>
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
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayButton: {
    paddingVertical: Responsive.v.lg,
    paddingHorizontal: Responsive.xl,
    borderRadius: Responsive.r.md,
    flex: 1,
    alignItems: "center",
  },
  dayText: {
    fontSize: Responsive.f.lg,
    fontFamily: Fonts.slackside,
  },
  timeText: {
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    marginLeft: Responsive.md,
    fontFamily: Fonts.slackside,
  },
});
