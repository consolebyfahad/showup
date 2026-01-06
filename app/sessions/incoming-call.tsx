import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

const PROFILE_STORAGE_KEY = "@yo_twin_user_profile";

interface UserProfile {
  name: string;
  birthday: string | null;
  profileImage: string | null;
}

export default function IncomingCall() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profileJson = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileJson) {
        const profile: UserProfile = JSON.parse(profileJson);
        setProfileData(profile);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const handleAnswer = () => {
    router.replace("/sessions/video-call");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const userName = profileData?.name || "User";
  const profileImage = profileData?.profileImage;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Caller Info */}
          <View style={styles.callerInfo}>
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profileInitials}>
                    {getInitials(userName)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.callerName}>Yo Twin</Text>
            <Text style={styles.callSubtext}>It's time to start</Text>
            <View style={styles.videoIndicator}>
              <Text style={styles.videoIcon}>📹</Text>
              <Text style={styles.videoText}>Video Call</Text>
            </View>
          </View>

          {/* Answer Button */}
          <TouchableOpacity
            style={styles.answerButton}
            onPress={handleAnswer}
            activeOpacity={0.8}
          >
            <View style={styles.answerButtonInner}>
              <Text style={styles.answerIcon}>📞</Text>
            </View>
            <Text style={styles.answerText}>Answer</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Responsive.v.xxxl,
    paddingHorizontal: Responsive.xl,
  },
  callerInfo: {
    alignItems: "center",
    marginTop: Responsive.v.xxxl,
  },
  profileImageContainer: {
    marginBottom: Responsive.v.xl,
  },
  profileImage: {
    width: rScale(150),
    height: rScale(150),
    borderRadius: rScale(75),
    borderWidth: 4,
    borderColor: Colors.white,
  },
  profilePlaceholder: {
    width: rScale(150),
    height: rScale(150),
    borderRadius: rScale(75),
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: Colors.white,
  },
  profileInitials: {
    fontSize: Responsive.f.xxxl * 1.5,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.heavy,
  },
  callerName: {
    fontSize: Responsive.f.xxxl * 1.5,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: Responsive.v.sm,
    fontFamily: Fonts.avenir.heavy,
  },
  callSubtext: {
    fontSize: Responsive.f.lg,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Responsive.v.xl,
    fontFamily: Fonts.slackside,
  },
  videoIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: Responsive.sm,
    marginTop: Responsive.v.md,
  },
  videoIcon: {
    fontSize: Responsive.f.xl,
  },
  videoText: {
    fontSize: Responsive.f.md,
    color: Colors.white,
    opacity: 0.9,
    fontFamily: Fonts.slackside,
  },
  answerButton: {
    alignItems: "center",
    marginBottom: Responsive.v.xxl,
  },
  answerButtonInner: {
    width: rScale(80),
    height: rScale(80),
    borderRadius: rScale(40),
    backgroundColor: Colors.ctaHighlight,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: Responsive.v.md,
  },
  answerIcon: {
    fontSize: Responsive.f.xxxl,
  },
  answerText: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.white,
    fontFamily: Fonts.avenir.heavy,
  },
});
