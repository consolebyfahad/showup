import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rVerticalScale } from "../../utils/responsive";

interface Screen3Props {
  question: string;
  onQuestionChange: (text: string) => void;
}

export default function Screen3({ question, onQuestionChange }: Screen3Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    // Scroll to show the text input when keyboard appears
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionText}>
          What is the <Text style={styles.emphasis}>SMALLEST</Text> step you can
          take to handle this?
        </Text>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder="Type your answer here..."
          placeholderTextColor={Colors.gray}
          value={question}
          onChangeText={onQuestionChange}
          multiline
          autoFocus
          onFocus={handleFocus}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: Responsive.v.xxxl,
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
