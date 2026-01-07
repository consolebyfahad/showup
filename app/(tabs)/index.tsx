import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LifetimeCount,
  VisionBoard,
  WeeklyStreak,
} from "../../components/home";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale } from "../../utils/responsive";
import {
  getStreakData,
  getLifetimeCount,
  checkAndResetWeek,
} from "../../utils/streak";

const PROFILE_STORAGE_KEY = "@yo_twin_user_profile";

interface UserProfile {
  name: string;
  birthday: string | null;
  profileImage: string | null;
}

export default function Home() {
  const router = useRouter();
  const [weeklyStreak, setWeeklyStreak] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(0);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  const loadData = useCallback(async () => {
    try {
      // Check and reset week if needed
      await checkAndResetWeek();

      // Load streak data
      const streak = await getStreakData();
      setWeeklyStreak(streak.currentStreak);

      // Load lifetime count
      const lifetime = await getLifetimeCount();
      setLifetimeCount(lifetime);

      // Load profile data
      const profileJson = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileJson) {
        const profile: UserProfile = JSON.parse(profileJson);
        setProfileData(profile);
      } else {
        setProfileData({
          name: "Achiever ⭐",
          birthday: null,
          profileImage: null,
        });
      }
    } catch (error) {
      setProfileData({
        name: "Achiever ⭐",
        birthday: null,
        profileImage: null,
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

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
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/profile/edit")}
          style={styles.profileImageContainer}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitials}>
                {getInitials(userName)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <WeeklyStreak currentStreak={weeklyStreak} totalDays={7} />
        <LifetimeCount count={lifetimeCount} />
        <VisionBoard onPress={() => router.push("/vision-board/upload")} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
    marginBottom: Responsive.v.xs / 2,
    fontFamily: Fonts.slackside,
  },
  userName: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
  profileImageContainer: {
    marginLeft: Responsive.md,
  },
  profileImage: {
    width: rScale(50),
    height: rScale(50),
    borderRadius: rScale(25),
    backgroundColor: Colors.gradientBlue,
  },
  profilePlaceholder: {
    width: rScale(50),
    height: rScale(50),
    borderRadius: rScale(25),
    backgroundColor: Colors.gradientBlue,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.backgroundAccent,
  },
  profileInitials: {
    fontSize: Responsive.f.md,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
  scrollView: {
    flex: 1,
  },
});
