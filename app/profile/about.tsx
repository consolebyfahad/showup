import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../../components/common";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale } from "../../utils/responsive";

export default function AboutYoTwin() {
  return (
    <View style={styles.container}>
      <Header title="About Yo Twin" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>
              <Text style={styles.logoShow}>Yo</Text>
              <Text style={styles.logoUp}> Twin</Text>
            </Text>
            <Text style={styles.tagline}>Your accountability partner</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is Yo Twin?</Text>
            <Text style={styles.sectionText}>
              Yo Twin is your personal accountability partner that helps you
              stay committed to your goals through daily 3-minute video
              sessions. Every day at your chosen time, Yo Twin calls you for a
              quick check-in where you show up for yourself.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.featureItem}>
              <Ionicons
                name="calendar-outline"
                size={rScale(20)}
                color={Colors.primary}
                style={styles.featureIcon}
              />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Schedule Your Sessions</Text>
                <Text style={styles.featureDescription}>
                  Set a time that works for you. Yo Twin will remind you every
                  day.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons
                name="videocam-outline"
                size={rScale(20)}
                color={Colors.primary}
                style={styles.featureIcon}
              />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>3-Minute Sessions</Text>
                <Text style={styles.featureDescription}>
                  Quick daily check-ins that keep you accountable without taking
                  too much time.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons
                name="flame-outline"
                size={rScale(20)}
                color={Colors.primary}
                style={styles.featureIcon}
              />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Track Your Streak</Text>
                <Text style={styles.featureDescription}>
                  Build consistency with weekly and lifetime streaks. Every day
                  you show up counts.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons
                name="image-outline"
                size={rScale(20)}
                color={Colors.primary}
                style={styles.featureIcon}
              />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Vision Board Progress</Text>
                <Text style={styles.featureDescription}>
                  Watch your weekly vision board come to life as you complete
                  sessions. Each session adds color to your goals.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.sectionText}>
              We believe that showing up for yourself, even for just 3 minutes a
              day, can create lasting change. Yo Twin is here to support you on
              your journey, one session at a time.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
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
  content: {
    paddingHorizontal: Responsive.xl,
    paddingTop: Responsive.v.xl,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: Responsive.v.xxl,
  },
  logoText: {
    fontSize: Responsive.f.xxxl + Responsive.f.lg,
    fontWeight: "700",
    marginBottom: Responsive.v.sm,
    fontFamily: Fonts.avenir.bold,
  },
  logoShow: {
    color: Colors.black,
  },
  logoUp: {
    color: Colors.primary,
  },
  tagline: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
    fontStyle: "italic",
    fontFamily: Fonts.slackside,
  },
  section: {
    marginBottom: Responsive.v.xxl,
  },
  sectionTitle: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.md,
    fontFamily: Fonts.avenir.semibold,
  },
  sectionText: {
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    lineHeight: Responsive.f.md * 1.6,
    fontFamily: Fonts.slackside,
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: Responsive.v.lg,
  },
  featureIcon: {
    marginRight: Responsive.md,
    marginTop: Responsive.v.xs,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: Responsive.v.xs,
    fontFamily: Fonts.avenir.regular,
  },
  featureDescription: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
    lineHeight: Responsive.f.sm * 1.5,
    fontFamily: Fonts.slackside,
  },
  versionText: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
    fontFamily: Fonts.slackside,
  },
});
