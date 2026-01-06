import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Responsive, rVerticalScale } from "../../utils/responsive";

interface Screen3Props {
  question: string;
  onQuestionChange: (text: string) => void;
}

export default function Screen3({ question, onQuestionChange }: Screen3Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        You don't need to solve anything now. Just write one question you have
        about this.
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Type your question here..."
        placeholderTextColor={Colors.gray}
        value={question}
        onChangeText={onQuestionChange}
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
    marginBottom: Responsive.v.xxl,
    lineHeight: Responsive.f.xxxl * 1.3,
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

