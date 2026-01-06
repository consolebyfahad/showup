import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/common";
import { Header } from "../../components/common";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive } from "../../utils/responsive";
import {
  Session,
  saveSession,
  checkSessionOverlap,
  formatTime,
  parseTimeString,
  formatDate,
} from "../../utils/sessions";

export default function AddEditSession() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    date?: string;
    time?: string;
    sessionId?: string;
  }>();

  const [title, setTitle] = useState("");
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // If editing, load session data
    if (params.sessionId) {
      loadSession(params.sessionId);
    } else if (params.date && params.time) {
      // Pre-fill date and time from calendar
      const date = new Date(params.date);
      setSelectedDate(date);
      const { hour: h, minute: m } = parseTimeString(params.time);
      setHour(h >= 12 ? h - 12 || 12 : h || 12);
      setMinute(m);
      setPeriod(h >= 12 ? "PM" : "AM");
    }
  }, [params]);

  const loadSession = async (sessionId: string) => {
    try {
      const sessionsJson = await AsyncStorage.getItem("@yo_twin_sessions");
      if (sessionsJson) {
        const sessions: Session[] = JSON.parse(sessionsJson);
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
          setIsEditMode(true);
          setTitle(session.title || "");
          setHour(session.hour >= 12 ? session.hour - 12 || 12 : session.hour || 12);
          setMinute(session.minute);
          setPeriod(session.hour >= 12 ? "PM" : "AM");
          setSelectedDate(new Date(session.date));
        }
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Convert to 24-hour format
      const hour24 = period === "PM" && hour !== 12 ? hour + 12 : period === "AM" && hour === 12 ? 0 : hour;

      // Check for overlapping sessions (only if not editing the same session)
      const dateStr = formatDate(selectedDate);
      const hasOverlap = await checkSessionOverlap(
        dateStr,
        hour24,
        minute,
        params.sessionId
      );

      if (hasOverlap) {
        Alert.alert(
          "Overlapping Session",
          "A session already exists at this date and time. Please choose a different time."
        );
        setIsLoading(false);
        return;
      }

      const session: Session = {
        id: params.sessionId || `session-${Date.now()}`,
        date: dateStr,
        hour: hour24,
        minute: minute,
        title: title.trim() || undefined,
        color: Colors.tagBlue, // Default color
        createdAt: params.sessionId
          ? (await loadSessionCreatedAt(params.sessionId)) || new Date().toISOString()
          : new Date().toISOString(),
        isCompleted: false,
      };

      await saveSession(session);

      Alert.alert(
        "Success",
        isEditMode ? "Session updated successfully!" : "Session created successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error saving session:", error);
      Alert.alert("Error", "Failed to save session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionCreatedAt = async (sessionId: string): Promise<string | null> => {
    try {
      const sessionsJson = await AsyncStorage.getItem("@yo_twin_sessions");
      if (sessionsJson) {
        const sessions: Session[] = JSON.parse(sessionsJson);
        const session = sessions.find((s) => s.id === sessionId);
        return session?.createdAt || null;
      }
    } catch (error) {
      console.error("Error loading session createdAt:", error);
    }
    return null;
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        title={isEditMode ? "Edit Session" : "New Session"}
        onBackPress={() => router.back()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.description}>
            Schedule a time to show up for yourself. You'll receive a call at this time.
          </Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateText}>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <Text style={styles.hint}>
              To change the date, go back to the calendar and select a different day.
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.timePicker}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeColumnLabel}>Hour</Text>
                <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                  {hours.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.timeOption, hour === h && styles.timeOptionSelected]}
                      onPress={() => setHour(h)}
                    >
                      <Text
                        style={[
                          styles.timeOptionText,
                          hour === h && styles.timeOptionTextSelected,
                        ]}
                      >
                        {h}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.timeColumn}>
                <Text style={styles.timeColumnLabel}>Minute</Text>
                <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                  {minutes.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.timeOption,
                        minute === m && styles.timeOptionSelected,
                      ]}
                      onPress={() => setMinute(m)}
                    >
                      <Text
                        style={[
                          styles.timeOptionText,
                          minute === m && styles.timeOptionTextSelected,
                        ]}
                      >
                        {m.toString().padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.timeColumn}>
                <Text style={styles.timeColumnLabel}>Period</Text>
                <View style={styles.periodContainer}>
                  <TouchableOpacity
                    style={[
                      styles.periodButton,
                      period === "AM" && styles.periodButtonSelected,
                    ]}
                    onPress={() => setPeriod("AM")}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        period === "AM" && styles.periodButtonTextSelected,
                      ]}
                    >
                      AM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.periodButton,
                      period === "PM" && styles.periodButtonSelected,
                    ]}
                    onPress={() => setPeriod("PM")}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        period === "PM" && styles.periodButtonTextSelected,
                      ]}
                    >
                      PM
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Title (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Morning Focus Session"
              placeholderTextColor={Colors.gray}
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title={isEditMode ? "Update Session" : "Create Session"}
          variant="primary"
          size="lg"
          onPress={handleSave}
          fullWidth
          loading={isLoading}
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
    fontFamily: Fonts.slackside,
  },
  inputSection: {
    marginBottom: Responsive.v.xl,
  },
  label: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: Responsive.v.sm,
    fontFamily: Fonts.avenir.regular,
  },
  dateDisplay: {
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    marginBottom: Responsive.v.xs,
  },
  dateText: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: Fonts.avenir.regular,
  },
  hint: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
    fontStyle: "italic",
    fontFamily: Fonts.slackside,
  },
  timePicker: {
    flexDirection: "row",
    gap: Responsive.md,
    height: 300,
  },
  timeColumn: {
    flex: 1,
  },
  timeColumnLabel: {
    fontSize: Responsive.f.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Responsive.v.sm,
    textAlign: "center",
    fontFamily: Fonts.slackside,
  },
  timeScroll: {
    flex: 1,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Responsive.r.md,
    padding: Responsive.xs,
  },
  timeOption: {
    padding: Responsive.md,
    borderRadius: Responsive.r.sm,
    marginBottom: Responsive.v.xs,
    alignItems: "center",
  },
  timeOptionSelected: {
    backgroundColor: Colors.primary,
  },
  timeOptionText: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: Fonts.avenir.regular,
  },
  timeOptionTextSelected: {
    color: Colors.white,
    fontFamily: Fonts.avenir.heavy,
  },
  periodContainer: {
    gap: Responsive.v.sm,
  },
  periodButton: {
    flex: 1,
    padding: Responsive.lg,
    borderRadius: Responsive.r.md,
    backgroundColor: Colors.backgroundAccent,
    alignItems: "center",
    justifyContent: "center",
  },
  periodButtonSelected: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: Responsive.f.md,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.heavy,
  },
  periodButtonTextSelected: {
    color: Colors.white,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    fontSize: Responsive.f.md,
    color: Colors.black,
    fontFamily: Fonts.slackside,
  },
  buttonContainer: {
    padding: Responsive.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
});

