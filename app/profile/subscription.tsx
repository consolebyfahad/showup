import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
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

export default function Subscription() {
  const features = [
    "Unlimited Yo Twin sessions",
    "Weekly vision board tracking",
    "Streak analytics & insights",
    "Priority support",
    "Early access to new features",
  ];

  return (
    <View style={styles.container}>
      <Header title="Subscription" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Plan Card */}
        <View style={styles.currentPlanCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Current Plan</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Free</Text>
            </View>
          </View>
          <Text style={styles.planDescription}>
            You're currently on the free plan. Upgrade to unlock all features
            and get the most out of Yo Twin.
          </Text>
        </View>

        {/* Premium Plan Card */}
        <View style={styles.premiumCard}>
          <LinearGradient
            colors={[Colors.gradientBlue, Colors.gradientGreen]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumGradient}
          >
            <View style={styles.premiumContent}>
              <View style={styles.premiumHeader}>
                <Text style={styles.premiumTitle}>Yo Twin Premium</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$9.99</Text>
                  <Text style={styles.pricePeriod}>/month</Text>
                </View>
              </View>

              <View style={styles.featuresList}>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={rScale(20)}
                      color={Colors.white}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => {
                    // Upgrade pressed
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.upgradeButtonText}>
                    Upgrade to Premium
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Upgrade?</Text>
          <View style={styles.benefitItem}>
            <Ionicons
              name="flame"
              size={rScale(24)}
              color={Colors.ctaHighlight}
              style={styles.benefitIcon}
            />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Track Your Progress</Text>
              <Text style={styles.benefitDescription}>
                Get detailed analytics on your streaks, session history, and
                progress toward your goals.
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons
              name="image"
              size={rScale(24)}
              color={Colors.ctaHighlight}
              style={styles.benefitIcon}
            />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Unlimited Vision Boards</Text>
              <Text style={styles.benefitDescription}>
                Create and track multiple vision boards, watch them come to life
                as you complete sessions.
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons
              name="headset"
              size={rScale(24)}
              color={Colors.ctaHighlight}
              style={styles.benefitIcon}
            />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Priority Support</Text>
              <Text style={styles.benefitDescription}>
                Get faster response times and dedicated support when you need
                help.
              </Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            Subscriptions automatically renew unless cancelled at least 24 hours
            before the end of the current period. Manage your subscription in
            your account settings.
          </Text>
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
  currentPlanCard: {
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.xl,
    padding: Responsive.xxl,
    marginHorizontal: Responsive.xl,
    marginTop: Responsive.v.xl,
    marginBottom: Responsive.v.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Responsive.v.md,
  },
  planTitle: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.black,
    fontFamily: Fonts.avenir.semibold,
  },
  badge: {
    backgroundColor: Colors.backgroundAccent,
    paddingHorizontal: Responsive.md,
    paddingVertical: Responsive.v.xs,
    borderRadius: Responsive.r.sm,
  },
  badgeText: {
    fontSize: Responsive.f.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  planDescription: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
    lineHeight: Responsive.f.md * 1.5,
    fontFamily: Fonts.slackside,
  },
  premiumCard: {
    marginHorizontal: Responsive.xl,
    marginBottom: Responsive.v.xl,
    borderRadius: Responsive.r.xl,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  premiumGradient: {
    padding: Responsive.xxl,
  },
  premiumContent: {
    // Content inside gradient
  },
  premiumHeader: {
    marginBottom: Responsive.v.xl,
  },
  premiumTitle: {
    fontSize: Responsive.f.xxl,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: Responsive.v.sm,
    fontFamily: Fonts.avenir.semibold,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: Responsive.f.xxxl + Responsive.f.lg,
    fontWeight: "700",
    color: Colors.white,
    fontFamily: Fonts.avenir.semibold,
  },
  pricePeriod: {
    fontSize: Responsive.f.md,
    color: Colors.white,
    opacity: 0.9,
    marginLeft: Responsive.xs,
    fontFamily: Fonts.slackside,
  },
  featuresList: {
    marginBottom: Responsive.v.xl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Responsive.v.md,
  },
  featureText: {
    fontSize: Responsive.f.md,
    color: Colors.white,
    marginLeft: Responsive.md,
    fontWeight: "500",
    fontFamily: Fonts.avenir.regular,
  },
  buttonContainer: {
    marginTop: Responsive.v.md,
  },
  upgradeButton: {
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.md,
    paddingVertical: Responsive.v.lg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  upgradeButtonText: {
    fontSize: Responsive.f.lg,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
  section: {
    paddingHorizontal: Responsive.xl,
    marginTop: Responsive.v.lg,
  },
  sectionTitle: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.lg,
    fontFamily: Fonts.avenir.semibold,
  },
  benefitItem: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    marginBottom: Responsive.v.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitIcon: {
    marginRight: Responsive.md,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: Responsive.v.xs,
    fontFamily: Fonts.avenir.regular,
  },
  benefitDescription: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
    lineHeight: Responsive.f.sm * 1.5,
    fontFamily: Fonts.slackside,
  },
  termsSection: {
    paddingHorizontal: Responsive.xl,
    marginTop: Responsive.v.xl,
    marginBottom: Responsive.v.lg,
  },
  termsText: {
    fontSize: Responsive.f.xs,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Responsive.f.xs * 1.5,
    fontFamily: Fonts.slackside,
  },
});
