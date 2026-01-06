import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/common";
import { Button } from "../../components/common";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";
import {
  getAllVisionBoards,
  getCurrentVisionBoard,
  saveVisionBoard,
  setCurrentVisionBoard,
  VisionBoard,
} from "../../utils/visionBoard";

export default function VisionBoardUpload() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload your vision board!"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Allow any aspect ratio for vision boards
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    try {
      setIsLoading(true);

      // Check if there's an existing current vision board
      const currentBoard = await getCurrentVisionBoard();
      const allBoards = await getAllVisionBoards();

      // Get current week start (Monday)
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(today.setDate(diff));
      weekStart.setHours(0, 0, 0, 0);

      // Check if there's already a board for this week
      const existingWeekBoard = allBoards.find((board) => {
        const boardWeekStart = new Date(board.weekStartDate);
        boardWeekStart.setHours(0, 0, 0, 0);
        return (
          boardWeekStart.getTime() === weekStart.getTime() &&
          !board.isCompleted
        );
      });

      let newBoard: VisionBoard;

      if (existingWeekBoard) {
        // Update existing board for this week
        newBoard = {
          ...existingWeekBoard,
          imageUri: selectedImage,
        };
      } else {
        // Create new board
        newBoard = {
          id: `vision-board-${Date.now()}`,
          imageUri: selectedImage,
          createdAt: new Date().toISOString(),
          completedSessions: 0,
          totalSessions: 7, // 7 sessions to fully color (one per day for a week)
          isCompleted: false,
          weekStartDate: weekStart.toISOString(),
        };
      }

      // Save the board
      await saveVisionBoard(newBoard);
      await setCurrentVisionBoard(newBoard);

      Alert.alert("Success", "Vision board uploaded successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving vision board:", error);
      Alert.alert("Error", "Failed to save vision board. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueOld = async () => {
    // User wants to continue with the previous week's board
    const currentBoard = await getCurrentVisionBoard();
    if (currentBoard && !currentBoard.isCompleted) {
      // Keep the current board active
      router.back();
    } else {
      Alert.alert(
        "No active board",
        "You don't have an active vision board to continue. Please upload a new one."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Upload Vision Board" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.description}>
            Upload an image that represents your goals or who you want to become.
            As you complete sessions, your vision board will gradually come to
            life with color.
          </Text>

          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Tap to upload image</Text>
              <Text style={styles.uploadHint}>
                Choose from your photo library
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>How it works:</Text>
            <Text style={styles.infoText}>
              • Your vision board starts in grayscale
            </Text>
            <Text style={styles.infoText}>
              • Each completed session adds more color
            </Text>
            <Text style={styles.infoText}>
              • Complete 7 sessions to fully color your vision board
            </Text>
            <Text style={styles.infoText}>
              • You can upload a new board weekly or continue the current one
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Save Vision Board"
          variant="primary"
          size="lg"
          onPress={handleSave}
          fullWidth
          disabled={!selectedImage || isLoading}
          loading={isLoading}
        />
        <Button
          title="Continue Previous Board"
          variant="outline"
          size="md"
          onPress={handleContinueOld}
          fullWidth
          style={styles.continueButton}
        />
      </View>
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
  content: {
    padding: Responsive.xl,
  },
  description: {
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    lineHeight: Responsive.f.md * 1.5,
    marginBottom: Responsive.v.xl,
    fontFamily: Fonts.slackside,
  },
  uploadButton: {
    height: rVerticalScale(300),
    borderRadius: Responsive.r.xl,
    backgroundColor: Colors.backgroundAccent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: "dashed",
    marginBottom: Responsive.v.xl,
  },
  uploadIcon: {
    fontSize: rScale(60),
    marginBottom: Responsive.v.md,
  },
  uploadText: {
    fontSize: Responsive.f.lg,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: Responsive.v.xs,
    fontFamily: Fonts.avenir.heavy,
  },
  uploadHint: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
    fontFamily: Fonts.slackside,
  },
  imagePreviewContainer: {
    marginBottom: Responsive.v.xl,
  },
  imagePreview: {
    width: "100%",
    height: rVerticalScale(300),
    borderRadius: Responsive.r.xl,
    marginBottom: Responsive.v.md,
  },
  changeImageButton: {
    padding: Responsive.md,
    borderRadius: Responsive.r.md,
    backgroundColor: Colors.backgroundAccent,
    alignItems: "center",
  },
  changeImageText: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: Fonts.avenir.regular,
  },
  infoBox: {
    backgroundColor: Colors.cardBeige,
    borderRadius: Responsive.r.lg,
    padding: Responsive.xl,
    marginTop: Responsive.v.lg,
  },
  infoTitle: {
    fontSize: Responsive.f.lg,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Responsive.v.md,
    fontFamily: Fonts.avenir.heavy,
  },
  infoText: {
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    marginBottom: Responsive.v.sm,
    lineHeight: Responsive.f.md * 1.5,
    fontFamily: Fonts.slackside,
  },
  buttonContainer: {
    padding: Responsive.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
    gap: Responsive.v.sm,
  },
  continueButton: {
    marginTop: Responsive.v.xs,
  },
});

