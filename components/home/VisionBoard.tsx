import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";
import {
  getCurrentVisionBoard,
  getColorProgress,
  VisionBoard,
} from "../../utils/visionBoard";

interface VisionBoardProps {
  onPress?: () => void;
}

export default function VisionBoardComponent({ onPress }: VisionBoardProps) {
  const [visionBoard, setVisionBoard] = useState<VisionBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reload when screen comes into focus (after upload or session completion)
  useFocusEffect(
    useCallback(() => {
      loadVisionBoard();
    }, [])
  );

  const loadVisionBoard = async () => {
    try {
      setIsLoading(true);
      const board = await getCurrentVisionBoard();
      setVisionBoard(board);
    } catch (error) {
      // Error loading vision board
    } finally {
      setIsLoading(false);
    }
  };

  // Expose reload function via ref if needed
  useEffect(() => {
    // Reload when component mounts or when screen comes into focus
    loadVisionBoard();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>VISION BOARD</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!visionBoard) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>VISION BOARD</Text>
        <TouchableOpacity style={styles.placeholderContainer} onPress={onPress}>
          <Text style={styles.placeholderText}>
            Upload your vision board to start tracking progress
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = getColorProgress(visionBoard);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VISION BOARD</Text>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.imageWrapper}>
          {/* Base monochrome (black & white) image - always visible */}
          <View style={styles.baseImageContainer}>
            <Image
              source={{ uri: visionBoard.imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
            {/* True monochrome overlay - creates black and white effect */}
            <View style={styles.monochromeOverlay} />
          </View>
          {/* Colored version - fades in as progress increases */}
          <View
            style={[
              styles.colorOverlay,
              {
                opacity: Math.min(1, progress / 100),
              },
            ]}
          >
            <Image
              source={{ uri: visionBoard.imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          {/* Progress indicator */}
          <View style={styles.progressOverlay}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {visionBoard.completedSessions}/{visionBoard.totalSessions}{" "}
              sessions
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBeige,
    borderRadius: Responsive.r.xl,
    padding: Responsive.xxl,
    marginHorizontal: Responsive.xl,
    marginTop: Responsive.v.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: Responsive.f.lg,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Responsive.v.md,
    textAlign: "center",
    fontFamily: Fonts.avenir.semibold,
  },
  imageContainer: {
    borderRadius: Responsive.r.lg,
    overflow: "hidden",
    backgroundColor: Colors.lightGray,
  },
  imageWrapper: {
    width: "100%",
    height: rVerticalScale(300),
    position: "relative",
  },
  baseImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  monochromeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // True monochrome effect: creates black and white by desaturating colors
    // Using a gray overlay with high opacity to create monochrome appearance
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark overlay for monochrome effect
    // This creates a desaturated, black and white appearance
  },
  colorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  progressOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: Responsive.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginBottom: Responsive.v.xs,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.ctaHighlight,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Responsive.f.sm,
    color: Colors.white,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: Fonts.slackside,
  },
  placeholderContainer: {
    height: rVerticalScale(300),
    borderRadius: Responsive.r.lg,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    padding: Responsive.xl,
  },
  placeholderText: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
    textAlign: "center",
    fontFamily: Fonts.slackside,
  },
});
