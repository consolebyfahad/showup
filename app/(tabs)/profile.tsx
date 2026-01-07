import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MenuCard, ProfileInfo } from "../../components/profile";
import { Colors } from "../../constants/colors";
import { Responsive } from "../../utils/responsive";

const PROFILE_STORAGE_KEY = "@yo_twin_user_profile";
const MEMBER_SINCE_KEY = "@yo_twin_member_since";

interface UserProfile {
  name: string;
  birthday: string | null;
  profileImage: string | null;
}


export default function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [memberSince, setMemberSince] = useState<string>("2023");

  const loadProfileData = useCallback(async () => {
    try {
      const profileJson = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileJson) {
        const profile: UserProfile = JSON.parse(profileJson);

        // Verify profile image file exists
        if (profile.profileImage) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(
              profile.profileImage
            );
            if (!fileInfo.exists) {
              // File doesn't exist, clear it from profile
              profile.profileImage = null;
              await AsyncStorage.setItem(
                PROFILE_STORAGE_KEY,
                JSON.stringify(profile)
              );
            }
          } catch (error) {
            // If file check fails, keep the URI and let Image component handle it
          }
        }

        setProfileData(profile);
      } else {
        // Default profile if none exists
        setProfileData({
          name: "Achiever ⭐",
          birthday: null,
          profileImage: null,
        });
      }

      // Load member since date
      const memberSinceYear = await AsyncStorage.getItem(MEMBER_SINCE_KEY);
      if (memberSinceYear) {
        setMemberSince(memberSinceYear);
      } else {
        // Default to current year if not set
        setMemberSince(new Date().getFullYear().toString());
      }
    } catch (error) {
      // Error loading profile data
      setProfileData({
        name: "Achiever ⭐",
        birthday: null,
        profileImage: null,
      });
      setMemberSince(new Date().getFullYear().toString());
    }
  }, []);

  // Reload profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData])
  );

  const handleLogout = () => {
    // Handle logout logic here
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileInfo
          name={profileData?.name || "Achiever ⭐"}
          memberSince={memberSince}
          profileImage={profileData?.profileImage || undefined}
          onImagePress={() => router.push("/profile/edit")}
        />

        <View style={styles.menuSection}>
          <MenuCard
            icon="card"
            title="Subscription"
            onPress={() => router.push("/profile/subscription")}
          />
          <MenuCard
            icon="help-circle"
            title="Help & Feedback"
            onPress={() => router.push("/profile/help")}
          />
          <MenuCard
            icon="information-circle"
            title="About Yo Twin"
            onPress={() => router.push("/profile/about")}
          />
        </View>

        {/* <View style={styles.logoutContainer}>
          <Button
            title="Log Out"
            variant="danger"
            size="md"
            onPress={handleLogout}
            fullWidth
          />
        </View> */}
      </ScrollView>
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
  menuSection: {
    marginTop: Responsive.v.lg,
    paddingHorizontal: Responsive.xl,
  },
  logoutContainer: {
    marginTop: Responsive.v.xxl,
    marginBottom: Responsive.v.lg,
    marginHorizontal: Responsive.xl,
  },
});
