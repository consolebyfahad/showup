import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Responsive, rScale } from "../../utils/responsive";
import { TroublingArea, TROUBLING_AREAS } from "../../types/onboarding";

interface Screen1Props {
  selectedAreas: TroublingArea[];
  onToggleArea: (area: TroublingArea) => void;
}

export default function Screen1({ selectedAreas, onToggleArea }: Screen1Props) {
  const getTagColor = (area: TroublingArea, isSelected: boolean) => {
    if (isSelected) {
      switch (area) {
        case "academics":
          return Colors.tagBlue;
        case "weight loss":
          return Colors.tagGreen;
        case "relationships":
          return Colors.tagOrange;
        case "career":
          return Colors.tagBlue;
        case "health":
          return Colors.tagGreen;
        case "finance":
          return Colors.tagOrange;
        case "personal growth":
          return Colors.tagBlue;
        case "creativity":
          return Colors.tagGreen;
        default:
          return Colors.lightGray;
      }
    }
    return Colors.lightGray;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        What are three things troubling you right now?
      </Text>
      <View style={styles.tagsContainer}>
        {TROUBLING_AREAS.map((area) => {
          const isSelected = selectedAreas.includes(area);
          return (
            <TouchableOpacity
              key={area}
              style={[styles.tag, { backgroundColor: getTagColor(area, isSelected) }]}
              onPress={() => onToggleArea(area)}
            >
              <Text style={styles.tagText}>{area}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.exampleText}>
        e.g., academics, weight loss, relationships
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  questionText: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.xxl,
    lineHeight: Responsive.f.xxxl * 1.3,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Responsive.g.md,
    marginBottom: Responsive.v.lg,
  },
  tag: {
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.md,
    borderRadius: Responsive.r.xl,
    minWidth: rScale(100),
  },
  tagText: {
    color: Colors.white,
    fontSize: Responsive.f.lg,
    fontWeight: "500",
    textAlign: "center",
  },
  exampleText: {
    fontSize: Responsive.f.md,
    color: Colors.gray,
    fontStyle: "italic",
  },
});

