import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive } from "../../utils/responsive";

interface Screen2Props {
  habits: string[];
  primaryFocus: string | null;
  onSelectFocus: (habit: string) => void;
}

export default function Screen2({
  habits,
  primaryFocus,
  onSelectFocus,
}: Screen2Props) {
  // Filter out empty habits
  const validHabits = habits.filter((habit) => habit.trim().length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        I feel you - but{"\n"}let's just pick one{"\n"}that we can help{"\n"}you
        with
      </Text>
      <View style={styles.optionsContainer}>
        {validHabits.map((habit, index) => {
          const isSelected = primaryFocus === habit;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
              ]}
              onPress={() => onSelectFocus(habit)}
            >
              <Text style={styles.optionText}>{habit}</Text>
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
    fontFamily: Fonts.avenir.semibold,
    textAlign: "center",
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
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  optionText: {
    color: Colors.black,
    fontSize: Responsive.f.lg,
    textAlign: "center",
    fontFamily: Fonts.slackside,
  },
});
