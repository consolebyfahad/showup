import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rVerticalScale } from "../../utils/responsive";

interface Screen1Props {
  habits: string[];
  onHabitsChange: (habits: string[]) => void;
}

export default function Screen1({ habits, onHabitsChange }: Screen1Props) {
  const MAX_CHARACTERS = 35;

  const handleHabitChange = (index: number, text: string) => {
    if (text.length <= MAX_CHARACTERS) {
      const newHabits = [...habits];
      newHabits[index] = text;
      onHabitsChange(newHabits);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        What 3 habits are you struggling with?
      </Text>
      <View style={styles.inputsContainer}>
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder={`Habit ${index + 1}`}
              placeholderTextColor={Colors.gray}
              value={habits[index] || ""}
              onChangeText={(text) => handleHabitChange(index, text)}
              maxLength={MAX_CHARACTERS}
              autoFocus={index === 0}
            />
            <Text style={styles.characterCount}>
              {(habits[index]?.length || 0)}/{MAX_CHARACTERS}
            </Text>
          </View>
        ))}
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
    fontFamily: Fonts.avenir.heavy,
  },
  inputsContainer: {
    gap: Responsive.v.lg,
    marginTop: Responsive.v.xl,
  },
  inputWrapper: {
    marginBottom: Responsive.v.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    fontSize: Responsive.f.lg,
    color: Colors.black,
    backgroundColor: Colors.white,
    fontFamily: Fonts.avenir.regular,
    minHeight: rVerticalScale(50),
  },
  characterCount: {
    fontSize: Responsive.f.xs,
    color: Colors.textSecondary,
    textAlign: "right",
    marginTop: Responsive.v.xs,
    fontFamily: Fonts.slackside,
  },
});

