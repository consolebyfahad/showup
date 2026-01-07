import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  OnboardingButton,
  ProgressIndicator,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
} from "../../components/onboarding";
import { Colors } from "../../constants/colors";
import { OnboardingData } from "../../types/onboarding";
import {
  requestNotificationPermissions,
  scheduleWeeklyNotification,
  cancelAllNotifications,
} from "../../utils/notifications";
import { Responsive, rVerticalScale } from "../../utils/responsive";
import { saveSession, formatDate, Session } from "../../utils/sessions";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Get current week start (Monday)
const getCurrentWeekStart = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(today.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [weekStartDate] = useState(getCurrentWeekStart());
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const [data, setData] = useState<OnboardingData>({
    habits: ["", "", ""],
    primaryFocus: null,
    question: "",
    possibleSolution: "",
    selectedDays: DAYS.map((day) => ({ day, selected: false })),
    currentDayEditing: undefined,
    selectedTime: { hour: 9, minute: 0, period: "AM" },
  });

  const handleNext = async () => {
    if (currentStep === 5) {
      // From Screen5 (day selection) to Screen6 (time setting)
      // Find first selected day that doesn't have a time set
      const firstUnsetDay = data.selectedDays.find(
        (d) => d.selected && !d.time
      );
      if (firstUnsetDay) {
        setData((prev) => ({
          ...prev,
          currentDayEditing: firstUnsetDay.day,
          selectedTime: { hour: 9, minute: 0, period: "AM" }, // Reset to default
        }));
        setCurrentStep(6);
      } else {
        // All selected days have times, go to review screen
        setCurrentStep(7);
      }
    } else if (currentStep === 6) {
      // From Screen6 (time setting) - save time for current day
      const updatedDays = data.selectedDays.map((day) =>
        day.day === data.currentDayEditing
          ? { ...day, time: data.selectedTime }
          : day
      );
      setData((prev) => ({
        ...prev,
        selectedDays: updatedDays,
      }));

      // Check if there are more days without times
      const nextUnsetDay = updatedDays.find((d) => d.selected && !d.time);
      if (nextUnsetDay) {
        setData((prev) => ({
          ...prev,
          currentDayEditing: nextUnsetDay.day,
          selectedTime: { hour: 9, minute: 0, period: "AM" }, // Reset to default
        }));
        // Stay on Screen6 for next day
      } else {
        // All days have times, go to review
        setCurrentStep(7);
      }
    } else if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding complete - save all data to local storage
      try {
        // Clear previous streak and vision board data for fresh start
        const { resetStreak } = await import("../../utils/streak");
        const { setCurrentVisionBoard } = await import("../../utils/visionBoard");
        await resetStreak();
        await setCurrentVisionBoard(null);
        
        // Save onboarding completion status
        await AsyncStorage.setItem("@yo_twin_onboarding_complete", "true");

        // Store the member since date (year only)
        const currentYear = new Date().getFullYear().toString();
        await AsyncStorage.setItem("@yo_twin_member_since", currentYear);

        // Save all onboarding data to local storage
        await AsyncStorage.setItem(
          "@yo_twin_onboarding_data",
          JSON.stringify(data)
        );

        // Request notification permissions and schedule weekly notifications
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          // Cancel all existing notifications first
          await cancelAllNotifications();

          // Schedule notifications for all selected days
          for (const daySchedule of data.selectedDays) {
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
        const selectedDaysWithTimes = data.selectedDays.filter(
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
            id: `session-${Date.now()}-${daySchedule.day}`,
            date: formatDate(sessionDate),
            hour: hour24,
            minute: daySchedule.time.minute,
            title: "Daily Session",
            color: Colors.tagBlue,
            createdAt: new Date().toISOString(),
            isCompleted: false,
          };

          try {
            await saveSession(session);
          } catch (error) {
            // Error creating session
          }
        }

        router.replace("/(tabs)");
      } catch (error) {
        // Error saving onboarding status
        router.replace("/(tabs)");
      }
    }
  };

  const handleHabitsChange = (habits: string[]) => {
    setData((prev) => ({
      ...prev,
      habits,
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // All 3 habits must be filled (non-empty)
        return data.habits.filter((h) => h.trim().length > 0).length === 3;
      case 2:
        return (
          data.primaryFocus !== null && data.primaryFocus.trim().length > 0
        );
      case 3:
        return data.question.trim().length > 0;
      case 4:
        return true; // Screen4 is informational, always allow proceed
      case 5:
        // At least one day must be selected
        return data.selectedDays.some((d) => d.selected);
      case 6:
        return true; // Time is always set (has default)
      case 7:
        return true; // Review screen, always allow proceed
      case 8:
        return true; // Final screen, always allow proceed
      default:
        return false;
    }
  };

  const getButtonColor = () => {
    if (!canProceed()) {
      return Colors.buttonDisabled;
    }
    switch (currentStep) {
      case 1:
      case 2:
      case 3:
      case 8:
        return Colors.ctaHighlight;
      case 4:
      case 5:
      case 6:
        return "#9BBF7F"; // Sage green
      case 7:
        return "#9BBF7F"; // Sage green for "Finished!" button
      default:
        return Colors.ctaHighlight;
    }
  };

  const getButtonText = () => {
    if (currentStep === 6) return "Set Time";
    if (currentStep === 7) return "Finished!";
    if (currentStep === 8) return "Get Started";
    return "Next";
  };

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 1:
        return (
          <Screen1 habits={data.habits} onHabitsChange={handleHabitsChange} />
        );
      case 2:
        return (
          <Screen2
            habits={data.habits}
            primaryFocus={data.primaryFocus}
            onSelectFocus={(habit) =>
              setData((prev) => ({ ...prev, primaryFocus: habit }))
            }
          />
        );
      case 3:
        return (
          <Screen3
            question={data.question}
            onQuestionChange={(text) =>
              setData((prev) => ({ ...prev, question: text }))
            }
          />
        );
      case 4:
        return <Screen4 />;
      case 5:
        return (
          <Screen5
            selectedDays={data.selectedDays}
            onDayToggle={(day) => {
              setData((prev) => ({
                ...prev,
                selectedDays: prev.selectedDays.map((d) =>
                  d.day === day ? { ...d, selected: !d.selected } : d
                ),
              }));
            }}
            weekStartDate={weekStartDate}
          />
        );
      case 6:
        return (
          <Screen6
            currentDay={data.currentDayEditing || "Monday"}
            selectedTime={data.selectedTime}
            onTimeChange={(time) =>
              setData((prev) => ({
                ...prev,
                selectedTime: { ...prev.selectedTime, ...time },
              }))
            }
          />
        );
      case 7:
        return (
          <Screen7
            selectedDays={data.selectedDays}
            weekStartDate={weekStartDate}
          />
        );
      case 8:
        return <Screen8 />;
      default:
        return (
          <Screen1 habits={data.habits} onHabitsChange={handleHabitsChange} />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProgressIndicator currentStep={currentStep} />
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
