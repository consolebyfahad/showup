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
} from "../../components/onboarding";
import { Colors } from "../../constants/colors";
import { OnboardingData } from "../../types/onboarding";
import {
  requestNotificationPermissions,
  scheduleDailyNotification,
} from "../../utils/notifications";
import { Responsive, rVerticalScale } from "../../utils/responsive";
import {
  saveSession,
  formatDate,
  Session,
} from "../../utils/sessions";

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    troublingAreas: [],
    primaryFocus: null,
    question: "",
    possibleSolution: "",
    selectedTime: { hour: 9, minute: 0, period: "AM" },
  });

  const handleNext = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding complete - save all data to local storage
      try {
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

        // Request notification permissions and schedule daily notifications
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleDailyNotification(data.selectedTime);
          console.log(
            "Daily notification scheduled for:",
            data.selectedTime.hour,
            data.selectedTime.minute,
            data.selectedTime.period
          );
        }

        // Create initial session from selected time
        // Convert to 24-hour format
        const hour24 =
          data.selectedTime.period === "PM" && data.selectedTime.hour !== 12
            ? data.selectedTime.hour + 12
            : data.selectedTime.period === "AM" && data.selectedTime.hour === 12
            ? 0
            : data.selectedTime.hour;

        // Create session for today
        const today = new Date();
        const session: Session = {
          id: `session-${Date.now()}`,
          date: formatDate(today),
          hour: hour24,
          minute: data.selectedTime.minute,
          title: "Daily Session",
          color: Colors.tagBlue,
          createdAt: new Date().toISOString(),
          isCompleted: false,
        };

        try {
          await saveSession(session);
          console.log("Initial session created:", session);
        } catch (error) {
          console.error("Error creating initial session:", error);
        }

        router.replace("/(tabs)");
      } catch (error) {
        console.error("Error saving onboarding status:", error);
        router.replace("/(tabs)");
      }
    }
  };

  const toggleTroublingArea = (
    area: OnboardingData["troublingAreas"][number]
  ) => {
    setData((prev) => {
      const isSelected = prev.troublingAreas.includes(area);
      if (isSelected) {
        return {
          ...prev,
          troublingAreas: prev.troublingAreas.filter((a) => a !== area),
        };
      } else if (prev.troublingAreas.length < 3) {
        return {
          ...prev,
          troublingAreas: [...prev.troublingAreas, area],
        };
      }
      return prev;
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.troublingAreas.length === 3;
      case 2:
        return data.primaryFocus !== null;
      case 3:
        return data.question.trim().length > 0;
      case 4:
        return data.possibleSolution.trim().length > 0;
      case 5:
        return true;
      case 6:
        return true;
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
      case 6:
        return Colors.ctaHighlight;
      case 4:
      case 5:
        return "#9BBF7F"; // Sage green
      default:
        return Colors.ctaHighlight;
    }
  };

  const getButtonText = () => {
    if (currentStep === 5) return "Set Time";
    if (currentStep === 6) return "Get Started";
    return "Next";
  };

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 1:
        return (
          <Screen1
            selectedAreas={data.troublingAreas}
            onToggleArea={toggleTroublingArea}
          />
        );
      case 2:
        return (
          <Screen2
            selectedAreas={data.troublingAreas}
            primaryFocus={data.primaryFocus}
            onSelectFocus={(area) =>
              setData((prev) => ({ ...prev, primaryFocus: area }))
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
        return (
          <Screen4
            possibleSolution={data.possibleSolution}
            onSolutionChange={(text) =>
              setData((prev) => ({ ...prev, possibleSolution: text }))
            }
          />
        );
      case 5:
        return (
          <Screen5
            selectedTime={data.selectedTime}
            onTimeChange={(time) =>
              setData((prev) => ({
                ...prev,
                selectedTime: { ...prev.selectedTime, ...time },
              }))
            }
          />
        );
      case 6:
        return <Screen6 selectedTime={data.selectedTime} />;
      default:
        return (
          <Screen1
            selectedAreas={data.troublingAreas}
            onToggleArea={toggleTroublingArea}
          />
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
