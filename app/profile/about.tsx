import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../components/common";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale } from "../../utils/responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AboutYoTwin() {
  const handleClearData = () => {
    AsyncStorage.clear();
    Alert.alert("App Data Cleared", "All app data has been cleared.");
  };
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
            <View style={[styles.featureItem, styles.featureItem1]}>
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

            <View style={[styles.featureItem, styles.featureItem2]}>
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

            <View style={[styles.featureItem, styles.featureItem3]}>
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

            <View style={[styles.featureItem, styles.featureItem4]}>
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
            <TouchableOpacity
              style={[styles.featureItem, styles.featureItem5]}
              onPress={handleClearData}
            >
              <Ionicons
                name="trash-outline"
                size={rScale(20)}
                color={Colors.primary}
                style={styles.featureIcon}
              />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Clear App Data</Text>
                <Text style={styles.featureDescription}>
                  Clear all app data and start fresh.
                </Text>
              </View>
            </TouchableOpacity>
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
    backgroundColor: Colors.white,
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
    paddingBottom: Responsive.v.xl,
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
    padding: Responsive.lg,
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    padding: Responsive.md,
    borderRadius: Responsive.r.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  featureItem1: {
    backgroundColor: "rgba(168, 197, 240, 0.15)", // tagBlue with 15% opacity
  },
  featureItem2: {
    backgroundColor: "rgba(184, 230, 184, 0.15)", // tagGreen with 15% opacity
  },
  featureItem3: {
    backgroundColor: "rgba(244, 194, 161, 0.15)", // tagOrange with 15% opacity
  },
  featureItem4: {
    backgroundColor: "rgba(197, 211, 244, 0.2)", // backgroundAccent with 20% opacity
  },
  featureItem5: {
    backgroundColor: "rgba(253, 238, 179, 0.25)", // cream with 25% opacity
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
  clearDataButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Responsive.v.lg,
  },
});
