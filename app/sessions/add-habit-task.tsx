import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HabitTaskInput from "../../components/habit-task/HabitTaskInput";
import {
  OnboardingButton,
  ProgressIndicator,
} from "../../components/onboarding";
import Screen5 from "../../components/onboarding/Screen5";
import Screen6 from "../../components/onboarding/Screen6";
import Screen7 from "../../components/onboarding/Screen7";
import { Colors } from "../../constants/colors";
import {
  requestNotificationPermissions,
  scheduleWeeklyNotification,
} from "../../utils/notifications";
import { Responsive, rVerticalScale } from "../../utils/responsive";
import { saveSession, formatDate, Session } from "../../utils/sessions";
import { getWeekStartDate } from "../../utils/streak";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface DaySchedule {
  day: string;
  selected: boolean;
  time?: { hour: number; minute: number; period: "AM" | "PM" };
}

// Get current week start (Monday) - uses utility function from streak.ts
const getCurrentWeekStart = () => getWeekStartDate();

export default function AddHabitTask() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const type = (params.type || "habit") as "habit" | "task";

  const [currentStep, setCurrentStep] = useState(1);
  const [weekStartDate] = useState(getCurrentWeekStart());
  const [name, setName] = useState("");
  const [selectedDays, setSelectedDays] = useState<DaySchedule[]>(
    DAYS.map((day) => ({ day, selected: false }))
  );
  const [currentDayEditing, setCurrentDayEditing] = useState<
    string | undefined
  >(undefined);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
    period: "AM" | "PM";
  }>({ hour: 9, minute: 0, period: "AM" });

  const handleNext = async () => {
    if (currentStep === 1) {
      // From input screen to day selection
      if (name.trim().length > 0) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // From day selection to time setting
      // Find first selected day that doesn't have a time set
      const firstUnsetDay = selectedDays.find((d) => d.selected && !d.time);
      if (firstUnsetDay) {
        setCurrentDayEditing(firstUnsetDay.day);
        // Load existing time for this day if it has one, otherwise use default
        const dayData = selectedDays.find((d) => d.day === firstUnsetDay.day);
        if (dayData?.time) {
          setSelectedTime(dayData.time);
        } else {
          setSelectedTime({ hour: 9, minute: 0, period: "AM" }); // Reset to default
        }
        setCurrentStep(3);
      } else {
        // All selected days have times, go to review screen
        setCurrentStep(4);
      }
    } else if (currentStep === 3) {
      // From time setting - save time for current day
      const updatedDays = selectedDays.map((day) =>
        day.day === currentDayEditing ? { ...day, time: selectedTime } : day
      );
      setSelectedDays(updatedDays);

      // Check if there are more days without times
      const nextUnsetDay = updatedDays.find((d) => d.selected && !d.time);
      if (nextUnsetDay) {
        setCurrentDayEditing(nextUnsetDay.day);
        // Load existing time for next day if it has one, otherwise use default
        const nextDayData = updatedDays.find((d) => d.day === nextUnsetDay.day);
        if (nextDayData?.time) {
          setSelectedTime(nextDayData.time);
        } else {
          setSelectedTime({ hour: 9, minute: 0, period: "AM" }); // Reset to default
        }
        // Stay on step 3 for next day
      } else {
        // All days have times, go to review
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      // Final step - save everything
      try {
        // Request notification permissions and schedule weekly notifications
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          // Schedule notifications for all selected days
          for (const daySchedule of selectedDays) {
            if (daySchedule.selected && daySchedule.time) {
              // Get day index (0 = Monday, 6 = Sunday)
              const dayIndex = DAYS.indexOf(daySchedule.day);
              if (dayIndex !== -1) {
                await scheduleWeeklyNotification(dayIndex, daySchedule.time);
              }
            }
          }
        }

        // Create sessions for all selected days
        const selectedDaysWithTimes = selectedDays.filter(
          (d) => d.selected && d.time
        );

        for (const daySchedule of selectedDaysWithTimes) {
          if (!daySchedule.time) continue;

          // Convert to 24-hour format
          const hour24 =
            daySchedule.time.period === "PM" && daySchedule.time.hour !== 12
              ? daySchedule.time.hour + 12
              : daySchedule.time.period === "AM" && daySchedule.time.hour === 12
              ? 0
              : daySchedule.time.hour;

          // Find the date for this day of the week
          const dayIndex = DAYS.indexOf(daySchedule.day);
          if (dayIndex === -1) {
            continue;
          }
          const sessionDate = new Date(weekStartDate);
          sessionDate.setDate(weekStartDate.getDate() + dayIndex);

          const session: Session = {
            id: `session-${Date.now()}-${daySchedule.day}-${Math.random()}`,
            date: formatDate(sessionDate),
            hour: hour24,
            minute: daySchedule.time.minute,
            title: name,
            color: type === "habit" ? Colors.tagBlue : Colors.tagOrange,
            createdAt: new Date().toISOString(),
            isCompleted: false,
          };

          try {
            await saveSession(session);
          } catch (error) {
            // Error creating session
          }
        }

        // Navigate back to calendar
        router.back();
      } catch (error) {
        // Error saving
        router.back();
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name.trim().length > 0;
      case 2:
        // At least one day must be selected
        return selectedDays.some((d) => d.selected);
      case 3:
        return true; // Time is always set (has default)
      case 4:
        return true; // Review screen, always allow proceed
      default:
        return false;
    }
  };

  const getButtonText = () => {
    if (currentStep === 3) return "Set Time";
    if (currentStep === 4) return "Finished!";
    return "Next";
  };

  const getButtonColor = () => {
    if (!canProceed()) {
      return Colors.buttonDisabled;
    }
    if (currentStep === 4) {
      return "#9BBF7F"; // Sage green for "Finished!" button
    }
    return Colors.ctaHighlight;
  };

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 1:
        return (
          <HabitTaskInput type={type} value={name} onChangeText={setName} />
        );
      case 2:
        return (
          <Screen5
            selectedDays={selectedDays}
            onDayToggle={(day) => {
              setSelectedDays((prev) =>
                prev.map((d) =>
                  d.day === day ? { ...d, selected: !d.selected } : d
                )
              );
            }}
            weekStartDate={weekStartDate}
          />
        );
      case 3:
        return (
          <Screen6
            currentDay={currentDayEditing || "Monday"}
            selectedTime={selectedTime}
            onTimeChange={(time) =>
              setSelectedTime((prev) => ({ ...prev, ...time }))
            }
          />
        );
      case 4:
        return (
          <Screen7 selectedDays={selectedDays} weekStartDate={weekStartDate} />
        );
      default:
        return (
          <HabitTaskInput type={type} value={name} onChangeText={setName} />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProgressIndicator currentStep={currentStep} totalSteps={4} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.screenContainer}>{renderCurrentScreen()}</View>
        </ScrollView>
        <OnboardingButton
          onPress={handleNext}
          disabled={!canProceed()}
          text={getButtonText()}
          backgroundColor={getButtonColor()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAccent,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Responsive.xl,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.xl,
    padding: Responsive.xxl,
    marginTop: Responsive.v.xl,
    marginBottom: Responsive.v.xl,
    minHeight: rVerticalScale(400),
    justifyContent: "center",
  },
});
