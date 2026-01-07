import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Header } from "../../components/common";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

export default function HelpFeedback() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (feedback.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedback("");
      }, 3000);
    }
  };

  const faqItems = [
    {
      question: "How do I change my session time?",
      answer:
        "Go to your Calendar tab and tap on your scheduled session to edit the time.",
    },
    {
      question: "What happens if I miss a session?",
      answer:
        "Don't worry! You have a 3-strike grace period. Missing a session won't break your streak immediately.",
    },
    {
      question: "Can I skip a session?",
      answer:
        "Sessions are designed to be quick 3-minute check-ins. We encourage you to show up, but you can reschedule if needed.",
    },
    {
      question: "How does the vision board work?",
      answer:
        "Upload a weekly vision board image. As you complete sessions, the image gradually becomes colorful, showing your progress.",
    },
    {
      question: "How do notifications work?",
      answer:
        "Yo Twin sends you a notification at your scheduled time. Make sure notifications are enabled in your device settings.",
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Help & Feedback" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <View style={styles.faqQuestion}>
                <Ionicons
                  name="help-circle"
                  size={rScale(20)}
                  color={Colors.primary}
                  style={styles.faqIcon}
                />
                <Text style={styles.faqQuestionText}>{item.question}</Text>
              </View>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Us Feedback</Text>
          <Text style={styles.sectionDescription}>
            We'd love to hear from you! Share your thoughts, suggestions, or
            report any issues.
          </Text>

          {submitted ? (
            <View style={styles.successContainer}>
              <Ionicons
                name="checkmark-circle"
                size={rScale(48)}
                color={Colors.tagGreen}
              />
              <Text style={styles.successText}>
                Thank you for your feedback!
              </Text>
              <Text style={styles.successSubtext}>
                We'll review it and get back to you soon.
              </Text>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.textInput}
                placeholder="Tell us what's on your mind..."
                placeholderTextColor={Colors.gray}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <View style={styles.buttonContainer}>
                <Button
                  title="Submit Feedback"
                  variant="primary"
                  onPress={handleSubmit}
                  disabled={!feedback.trim()}
                  fullWidth
                />
              </View>
            </>
          )}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need More Help?</Text>
          <TouchableOpacity style={styles.contactItem}>
            <Ionicons
              name="mail-outline"
              size={rScale(20)}
              color={Colors.primary}
            />
            <Text style={styles.contactText}>support@yotwin.app</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  section: {
    paddingHorizontal: Responsive.xl,
    paddingTop: Responsive.v.xl,
  },
  sectionTitle: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.md,
    fontFamily: Fonts.avenir.semibold,
  },
  sectionDescription: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
    marginBottom: Responsive.v.lg,
    lineHeight: Responsive.f.md * 1.5,
    fontFamily: Fonts.slackside,
  },
  faqItem: {
    marginBottom: Responsive.v.lg,
    paddingBottom: Responsive.v.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Responsive.v.sm,
  },
  faqIcon: {
    marginRight: Responsive.sm,
    marginTop: Responsive.v.xs,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.black,
    fontFamily: Fonts.avenir.regular,
  },
  faqAnswer: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
    lineHeight: Responsive.f.sm * 1.5,
    marginLeft: Responsive.v.xxl + Responsive.sm,
    fontFamily: Fonts.slackside,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    fontSize: Responsive.f.md,
    color: Colors.black,
    minHeight: rVerticalScale(120),
    marginBottom: Responsive.v.lg,
    fontFamily: Fonts.slackside,
  },
  buttonContainer: {
    marginBottom: Responsive.v.lg,
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: Responsive.v.xxl,
  },
  successText: {
    fontSize: Responsive.f.xl,
    fontWeight: "600",
    color: Colors.black,
    marginTop: Responsive.v.md,
    marginBottom: Responsive.v.xs,
    fontFamily: Fonts.avenir.semibold,
  },
  successSubtext: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
    textAlign: "center",
    fontFamily: Fonts.slackside,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Responsive.lg,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Responsive.r.md,
    marginTop: Responsive.v.sm,
  },
  contactText: {
    fontSize: Responsive.f.md,
    color: Colors.primary,
    marginLeft: Responsive.md,
    fontWeight: "500",
    fontFamily: Fonts.avenir.regular,
  },
});
