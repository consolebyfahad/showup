import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rVerticalScale } from "../../utils/responsive";

interface Screen3Props {
  question: string;
  onQuestionChange: (text: string) => void;
}

export default function Screen3({ question, onQuestionChange }: Screen3Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        What is the <Text style={styles.emphasis}>SMALLEST</Text> step you can take to handle this?
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Type your answer here..."
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
    fontFamily: Fonts.avenir.heavy,
    textAlign: "center",
  },
  emphasis: {
    textTransform: "uppercase",
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
    backgroundColor: Colors.white,
    fontFamily: Fonts.slackside,
  },
});

