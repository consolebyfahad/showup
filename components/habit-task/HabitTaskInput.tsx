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

interface HabitTaskInputProps {
  type: "habit" | "task";
  value: string;
  onChangeText: (text: string) => void;
}

export default function HabitTaskInput({
  type,
  value,
  onChangeText,
}: HabitTaskInputProps) {
  const MAX_CHARACTERS = 50;
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const questionText =
    type === "habit" ? "What is the habit?" : "What is the task?";

  const placeholderText =
    type === "habit" ? "e.g meditate" : "e.g Complete project";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : undefined}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionText}>{questionText}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder={placeholderText}
            placeholderTextColor={Colors.gray}
            value={value}
            onChangeText={(text) => {
              if (text.length <= MAX_CHARACTERS) {
                onChangeText(text);
              }
            }}
            maxLength={MAX_CHARACTERS}
            autoFocus={true}
            returnKeyType="done"
          />
          <Text style={styles.characterCount}>
            {value?.length || 0}/{MAX_CHARACTERS}
          </Text>
        </View>
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
  },
  inputContainer: {
    marginTop: Responsive.v.xl,
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
