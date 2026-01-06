import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Responsive, rVerticalScale } from "../../utils/responsive";

interface Screen4Props {
  possibleSolution: string;
  onSolutionChange: (text: string) => void;
}

export default function Screen4({
  possibleSolution,
  onSolutionChange,
}: Screen4Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        What is one possible way to handle this?
      </Text>
      <Text style={styles.subText}>Just first thoughts. No pressure.</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Type your thoughts here..."
        placeholderTextColor={Colors.gray}
        value={possibleSolution}
        onChangeText={onSolutionChange}
        multiline
        autoFocus
      />
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
    marginBottom: Responsive.v.md,
    lineHeight: Responsive.f.xxxl * 1.3,
  },
  subText: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
    marginBottom: Responsive.v.lg,
    fontStyle: "italic",
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    fontSize: Responsive.f.lg,
    color: Colors.black,
    minHeight: rVerticalScale(120),
    textAlignVertical: "top",
    marginTop: Responsive.v.lg,
  },
});

