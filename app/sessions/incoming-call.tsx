import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

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
      // Error loading profile data
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
              {/* {profileImage ? (
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
              )} */}
              <LottieView
                source={require("../../assets/Lottie/Waving.json")}
                autoPlay
                loop
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.callerName}>Yo Twin</Text>
            <Text style={styles.callSubtext}>It's time to start</Text>
            <View style={styles.videoIndicator}>
              <Text style={styles.videoText}>Video Call</Text>
            </View>
          </View>

          {/* Answer Button */}
          <TouchableOpacity
            style={styles.answerButton}
            onPress={handleAnswer}
            activeOpacity={0.8}
          >
            <LottieView
              source={require("../../assets/Lottie/incoming call.json")}
              autoPlay
              loop
              style={styles.incomingCallIcon}
            />
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
    borderRadius: rScale(99),
    borderWidth: 4,
    borderColor: Colors.white,
  },
  profileImage: {
    width: rScale(150),
    height: rScale(150),
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
    fontFamily: Fonts.avenir.semibold,
  },
  callerName: {
    fontSize: Responsive.f.xxxl * 1.5,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: Responsive.v.sm,
    fontFamily: Fonts.avenir.semibold,
  },
  callSubtext: {
    fontSize: Responsive.f.lg,
    color: Colors.white,
    opacity: 0.9,
    fontFamily: Fonts.slackside,
  },
  videoIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: Responsive.sm,
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

  incomingCallIcon: {
    width: rScale(160),
    height: rScale(160),
  },
});
