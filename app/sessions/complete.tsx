import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/common";
import { Colors } from "../../constants/colors";
import { Responsive, rScale } from "../../utils/responsive";
import { incrementVisionBoardProgress } from "../../utils/visionBoard";

const EMOJI_OPTIONS = [
  { emoji: "😊", label: "Great" },
  { emoji: "😌", label: "Calm" },
  { emoji: "💪", label: "Motivated" },
  { emoji: "🎯", label: "Focused" },
  { emoji: "✨", label: "Accomplished" },
];

export default function Complete() {
  const router = useRouter();
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleFinish = async () => {
    try {
      // Increment vision board progress
      await incrementVisionBoardProgress();
      
      // Navigate back to home
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing session:", error);
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎉</Text>
          </View>

          {/* Encouragement Message */}
          <Text style={styles.title}>
            You just showed up for yourself!
          </Text>
          <Text style={styles.subtitle}>
            How do you feel?
          </Text>

          {/* Emoji Survey */}
          <View style={styles.emojiContainer}>
            {EMOJI_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.emoji}
                style={[
                  styles.emojiButton,
                  selectedEmoji === option.emoji && styles.emojiButtonSelected,
                ]}
                onPress={() => setSelectedEmoji(option.emoji)}
              >
                <Text style={styles.emoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.emojiLabel,
                    selectedEmoji === option.emoji && styles.emojiLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Motivational Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              Every session counts. You're building consistency, one step at a time.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Finish Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Finish"
          variant="primary"
          size="lg"
          onPress={handleFinish}
          fullWidth
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Responsive.v.xxxl,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: Responsive.xl,
    paddingTop: Responsive.v.xxxl,
  },
  iconContainer: {
    marginBottom: Responsive.v.xl,
  },
  icon: {
    fontSize: rScale(100),
  },
  title: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: Responsive.v.sm,
  },
  subtitle: {
    fontSize: Responsive.f.xl,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Responsive.v.xxl,
  },
  emojiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Responsive.md,
    marginBottom: Responsive.v.xxl,
    width: "100%",
  },
  emojiButton: {
    alignItems: "center",
    padding: Responsive.md,
    borderRadius: Responsive.r.lg,
    backgroundColor: Colors.white,
    minWidth: rScale(80),
    borderWidth: 2,
    borderColor: "transparent",
  },
  emojiButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundAccent,
  },
  emoji: {
    fontSize: Responsive.f.xxxl,
    marginBottom: Responsive.v.xs,
  },
  emojiLabel: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  emojiLabelSelected: {
    color: Colors.primary,
    fontWeight: "700",
  },
  messageContainer: {
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.xl,
    padding: Responsive.xl,
    marginTop: Responsive.v.lg,
    width: "100%",
  },
  messageText: {
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    textAlign: "center",
    lineHeight: Responsive.f.md * 1.5,
  },
  buttonContainer: {
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
});
