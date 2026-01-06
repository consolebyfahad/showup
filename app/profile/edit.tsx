import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../components/common";
import { Colors } from "../../constants/colors";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

const PROFILE_STORAGE_KEY = "@yo_twin_user_profile";

interface UserProfile {
  name: string;
  birthday: string | null;
  profileImage: string | null;
}

export default function ProfileEdit() {
  const router = useRouter();
  const [name, setName] = useState("Sarah Chen");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profileJson = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileJson) {
        const profile: UserProfile = JSON.parse(profileJson);
        setName(profile.name || "Sarah Chen");
        if (profile.birthday) {
          setBirthday(new Date(profile.birthday));
        }
        if (profile.profileImage) {
          setProfileImage(profile.profileImage);
        }
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload your profile picture!"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const profileData: UserProfile = {
        name,
        birthday: birthday ? birthday.toISOString() : null,
        profileImage,
      };

      await AsyncStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profileData)
      );

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Select birthday";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Edit Profile"
        rightAction={{
          label: "Save",
          onPress: handleSave,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>{getInitials(name)}</Text>
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={rScale(20)} color={Colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to change photo</Text>
        </View>

        {/* Name Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={Colors.gray}
          />
        </View>

        {/* Birthday Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Birthday</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[styles.dateText, !birthday && styles.dateTextPlaceholder]}
            >
              {formatDate(birthday)}
            </Text>
            <Ionicons
              name="calendar"
              size={rScale(20)}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View
              style={styles.datePickerModalContent}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.datePickerHeader}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select Birthday</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.doneButton}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={birthday || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setBirthday(selectedDate);
                    }
                  }}
                  maximumDate={new Date()}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
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
  imageSection: {
    alignItems: "center",
    paddingVertical: Responsive.v.xxl,
  },
  imageContainer: {
    position: "relative",
    marginBottom: Responsive.v.sm,
  },
  image: {
    width: rScale(120),
    height: rScale(120),
    borderRadius: rScale(99),
    backgroundColor: Colors.backgroundAccent,
  },
  placeholderImage: {
    width: rScale(120),
    height: rScale(120),
    borderRadius: rScale(99),
    backgroundColor: Colors.gradientBlue,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  placeholderText: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.primary,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: rScale(18),
    width: rScale(36),
    height: rVerticalScale(36),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.white,
  },
  imageHint: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
  },
  inputSection: {
    paddingHorizontal: Responsive.xl,
    marginBottom: Responsive.v.lg,
  },
  label: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: Responsive.v.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    fontSize: Responsive.f.md,
    color: Colors.black,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
  },
  dateText: {
    fontSize: Responsive.f.md,
    color: Colors.black,
  },
  dateTextPlaceholder: {
    color: Colors.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  datePickerModalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Responsive.r.xl,
    borderTopRightRadius: Responsive.r.xl,
    paddingBottom: Responsive.v.xl,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  cancelButton: {
    paddingVertical: Responsive.v.sm,
    paddingHorizontal: Responsive.md,
  },
  cancelButtonText: {
    fontSize: Responsive.f.md,
    color: Colors.gray,
    fontWeight: "500",
  },
  datePickerTitle: {
    fontSize: Responsive.f.lg,
    fontWeight: "600",
    color: Colors.black,
  },
  doneButton: {
    paddingVertical: Responsive.v.sm,
    paddingHorizontal: Responsive.md,
  },
  doneButtonText: {
    fontSize: Responsive.f.md,
    color: Colors.primary,
    fontWeight: "600",
  },
  datePickerContainer: {
    alignItems: "center",
  },
});
