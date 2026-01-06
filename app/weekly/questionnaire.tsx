import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/common";
import { Header } from "../../components/common";
import { Colors } from "../../constants/colors";
import { Responsive } from "../../utils/responsive";

const WEEKLY_QUESTIONNAIRE_KEY = "@yo_twin_weekly_questionnaire";

interface WeeklyQuestionnaire {
  weekStartDate: string;
  question: string;
  answer: string;
  createdAt: string;
}

export default function WeeklyQuestionnaire() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert("Error", "Please fill in both question and answer");
      return;
    }

    try {
      // Get current week start (Monday)
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(today.setDate(diff));
      weekStart.setHours(0, 0, 0, 0);

      const questionnaire: WeeklyQuestionnaire = {
        weekStartDate: weekStart.toISOString(),
        question: question.trim(),
        answer: answer.trim(),
        createdAt: new Date().toISOString(),
      };

      // Save questionnaire
      await AsyncStorage.setItem(
        WEEKLY_QUESTIONNAIRE_KEY,
        JSON.stringify(questionnaire)
      );

      Alert.alert("Success", "Weekly questionnaire saved!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      Alert.alert("Error", "Failed to save questionnaire. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Weekly Questionnaire" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.description}>
            Reflect on your goals for this week. What do you want to focus on?
          </Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Question</Text>
            <TextInput
              style={styles.textInput}
              placeholder="What challenge do you want to overcome this week?"
              placeholderTextColor={Colors.gray}
              value={question}
              onChangeText={setQuestion}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Your Answer</Text>
            <TextInput
              style={[styles.textInput, styles.answerInput]}
              placeholder="Write your thoughts and intentions here..."
              placeholderTextColor={Colors.gray}
              value={answer}
              onChangeText={setAnswer}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Save"
          variant="primary"
          size="lg"
          onPress={handleSave}
          fullWidth
          disabled={!question.trim() || !answer.trim()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Responsive.v.xxxl,
  },
  content: {
    padding: Responsive.xl,
  },
  description: {
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    lineHeight: Responsive.f.md * 1.5,
    marginBottom: Responsive.v.xl,
  },
  inputSection: {
    marginBottom: Responsive.v.xl,
  },
  label: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: Responsive.v.sm,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    fontSize: Responsive.f.md,
    color: Colors.black,
    minHeight: Responsive.v.xxl * 2,
  },
  answerInput: {
    minHeight: Responsive.v.xxl * 4,
  },
  buttonContainer: {
    padding: Responsive.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
});

