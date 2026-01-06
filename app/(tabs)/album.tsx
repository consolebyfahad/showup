import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";
import {
  getAllVisionBoards,
  getColorProgress,
  VisionBoard,
} from "../../utils/visionBoard";

export default function Album() {
  const router = useRouter();
  const [visionBoards, setVisionBoards] = useState<VisionBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisionBoards();
  }, []);

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadVisionBoards();
    }, [])
  );

  const loadVisionBoards = async () => {
    try {
      setIsLoading(true);
      const boards = await getAllVisionBoards();
      // Sort by creation date, newest first
      boards.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setVisionBoards(boards);
    } catch (error) {
      console.error("Error loading vision boards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderVisionBoard = ({ item }: { item: VisionBoard }) => {
    const progress = getColorProgress(item);
    const weekStart = new Date(item.weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return (
      <TouchableOpacity style={styles.boardCard}>
        <View style={styles.imageWrapper}>
          {/* Base grayscale image */}
          <View style={styles.baseImageContainer}>
            <Image
              source={{ uri: item.imageUri }}
              style={[styles.boardImage, styles.baseImage]}
              resizeMode="cover"
            />
            <View style={styles.grayscaleOverlay} />
          </View>
          {/* Colored overlay */}
          <View
            style={[
              styles.colorOverlay,
              {
                opacity: Math.min(1, progress / 100),
              },
            ]}
          >
            <Image
              source={{ uri: item.imageUri }}
              style={styles.boardImage}
              resizeMode="cover"
            />
          </View>
          {/* Status badge */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {item.isCompleted ? "✓ Complete" : "In Progress"}
            </Text>
          </View>
        </View>
        <View style={styles.boardInfo}>
          <Text style={styles.weekText}>
            Week of {weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
            {weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </Text>
          <Text style={styles.progressText}>
            {item.completedSessions}/{item.totalSessions} sessions
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Photo Album</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Photo Album</Text>
        <Text style={styles.subtitle}>
          All your vision boards, finished or in progress
        </Text>
      </View>

      {visionBoards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No vision boards yet</Text>
          <Text style={styles.emptySubtext}>
            Upload your first vision board from the home screen
          </Text>
        </View>
      ) : (
        <FlatList
          data={visionBoards}
          renderItem={renderVisionBoard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Responsive.v.xs,
  },
  subtitle: {
    fontSize: Responsive.f.sm,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Responsive.xl,
  },
  emptyText: {
    fontSize: Responsive.f.xl,
    fontWeight: "600",
    color: Colors.darkGray,
    marginBottom: Responsive.v.sm,
  },
  emptySubtext: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  listContent: {
    padding: Responsive.md,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: Responsive.md,
  },
  boardCard: {
    width: "48%",
    borderRadius: Responsive.r.lg,
    overflow: "hidden",
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrapper: {
    width: "100%",
    height: rVerticalScale(200),
    position: "relative",
  },
  baseImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  baseImage: {
    opacity: 0.3,
  },
  boardImage: {
    width: "100%",
    height: "100%",
  },
  grayscaleOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  colorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: Responsive.sm,
    right: Responsive.sm,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: Responsive.sm,
    paddingVertical: Responsive.v.xs,
    borderRadius: Responsive.r.sm,
  },
  statusText: {
    fontSize: Responsive.f.xs,
    color: Colors.white,
    fontWeight: "600",
  },
  boardInfo: {
    padding: Responsive.md,
  },
  weekText: {
    fontSize: Responsive.f.sm,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: Responsive.v.xs / 2,
  },
  progressText: {
    fontSize: Responsive.f.xs,
    color: Colors.textSecondary,
  },
});

