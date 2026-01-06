import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Responsive } from "../../utils/responsive";
import { TroublingArea } from "../../types/onboarding";

interface Screen2Props {
  selectedAreas: TroublingArea[];
  primaryFocus: TroublingArea | null;
  onSelectFocus: (area: TroublingArea) => void;
}

export default function Screen2({
  selectedAreas,
  primaryFocus,
  onSelectFocus,
}: Screen2Props) {
  const getTagColor = (area: TroublingArea, isSelected: boolean) => {
    if (isSelected) {
      switch (area) {
        case "academics":
          return Colors.tagBlue;
        case "weight loss":
          return Colors.tagGreen;
        case "relationships":
          return Colors.tagOrange;
        default:
          return Colors.lightGray;
      }
    }
    return Colors.lightGray;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        I feel you — but let's just pick one we can help you with.
      </Text>
      <View style={styles.optionsContainer}>
        {selectedAreas.map((area) => {
          const isSelected = primaryFocus === area;
          return (
            <TouchableOpacity
              key={area}
              style={[
                styles.optionButton,
                { backgroundColor: getTagColor(area, isSelected) },
              ]}
              onPress={() => onSelectFocus(area)}
            >
              <Text style={styles.optionText}>{area}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  optionsContainer: {
    gap: Responsive.g.lg,
    marginTop: Responsive.v.xl,
  },
  optionButton: {
    paddingHorizontal: Responsive.xxl,
    paddingVertical: Responsive.v.lg,
    borderRadius: Responsive.r.md,
    width: "100%",
  },
  optionText: {
    color: Colors.white,
    fontSize: Responsive.f.xl,
    fontWeight: "500",
    textAlign: "center",
  },
});

