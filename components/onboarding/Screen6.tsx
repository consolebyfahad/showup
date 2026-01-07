import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const [showPicker, setShowPicker] = useState(false);

  // Convert 12-hour format to Date object for DateTimePicker
  const getDateFromTime = () => {
    const date = new Date();
    let hour24 = selectedTime.hour;
    if (selectedTime.period === "PM" && selectedTime.hour !== 12) {
      hour24 = selectedTime.hour + 12;
    } else if (selectedTime.period === "AM" && selectedTime.hour === 12) {
      hour24 = 0;
    }
    date.setHours(hour24, selectedTime.minute, 0, 0);
    return date;
  };

  const formatTime = () => {
    const hour = selectedTime.hour.toString().padStart(2, "0");
    const minute = selectedTime.minute.toString().padStart(2, "0");
    return `${hour}:${minute} ${selectedTime.period}`;
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (date && event.type !== "dismissed") {
      let hour = date.getHours();
      const minute = date.getMinutes();
      let period: "AM" | "PM" = "AM";

      if (hour === 0) {
        hour = 12;
        period = "AM";
      } else if (hour === 12) {
        hour = 12;
        period = "PM";
      } else if (hour > 12) {
        hour = hour - 12;
        period = "PM";
      } else {
        period = "AM";
      }

      onTimeChange({ hour, minute, period });
    }
  };

  const handleDone = () => {
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{currentDay}</Text>
      </View>

      <Text style={styles.questionText}>You'll do this when?</Text>
      <View style={styles.pickerContainer}>
        <DateTimePicker
          value={getDateFromTime()}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
          textColor={Colors.black}
          themeVariant="light"
        />
      </View>

      <View style={styles.timeDisplay}>
        <Text style={styles.timeText}>{formatTime()}</Text>
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
    alignSelf: "center",
    marginBottom: Responsive.v.lg,
  },
  dayText: {
    fontSize: Responsive.f.xl,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
  questionText: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.xl,
    lineHeight: Responsive.f.xxxl * 1.3,
    fontFamily: Fonts.avenir.semibold,
  },
  timePickerButton: {
    marginTop: Responsive.v.xl,
    marginBottom: Responsive.v.lg,
  },
  timeDisplay: {
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Responsive.r.lg,
    padding: Responsive.xl,
    alignItems: "center",
  },
  timeText: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  pickerModalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Responsive.r.xl,
    borderTopRightRadius: Responsive.r.xl,
    paddingBottom: Responsive.v.xl,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  cancelButton: {
    paddingVertical: Responsive.v.sm,
    paddingHorizontal: Responsive.md,
  },
  cancelButtonText: {
    fontSize: Responsive.f.md,
    color: Colors.gray,
    fontWeight: "500",
    fontFamily: Fonts.slackside,
  },
  pickerTitle: {
    fontSize: Responsive.f.lg,
    fontWeight: "600",
    color: Colors.black,
    fontFamily: Fonts.avenir.semibold,
  },
  doneButton: {
    paddingVertical: Responsive.v.sm,
    paddingHorizontal: Responsive.md,
  },
  doneButtonText: {
    fontSize: Responsive.f.md,
    color: Colors.primary,
    fontWeight: "600",
    fontFamily: Fonts.avenir.regular,
  },
  pickerContainer: {
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingVertical: Responsive.v.md,
  },
});
