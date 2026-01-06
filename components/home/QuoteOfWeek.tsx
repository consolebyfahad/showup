import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";
import { getWeeklyQuote, saveWeeklyQuote } from "../../utils/weeklyQuote";

interface QuoteOfWeekProps {
  initialQuote?: string;
  onQuoteChange?: (quote: string) => void;
}

export default function QuoteOfWeek({
  initialQuote = "",
  onQuoteChange,
}: QuoteOfWeekProps) {
  const [quote, setQuote] = useState(initialQuote);
  const [isEditing, setIsEditing] = useState(!initialQuote);
  const [isLoading, setIsLoading] = useState(true);

  // Load quote from storage on mount
  useEffect(() => {
    loadQuote();
  }, []);

  const loadQuote = async () => {
    try {
      setIsLoading(true);
      const savedQuote = await getWeeklyQuote();
      if (savedQuote) {
        setQuote(savedQuote);
        setIsEditing(false);
        onQuoteChange?.(savedQuote);
      } else {
        setQuote(initialQuote || "");
        setIsEditing(!initialQuote);
      }
    } catch (error) {
      console.error("Error loading quote:", error);
      setQuote(initialQuote || "");
      setIsEditing(!initialQuote);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuoteChange = (text: string) => {
    setQuote(text);
    onQuoteChange?.(text);
  };

  const handleSaveQuote = async () => {
    if (quote.trim()) {
      try {
        // Save quote with new expiration date (7 days from now)
        await saveWeeklyQuote(quote.trim());
        setIsEditing(false);
        onQuoteChange?.(quote.trim());
      } catch (error) {
        console.error("Error saving quote:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>QUOTE OF THE WEEK</Text>
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QUOTE OF THE WEEK</Text>
      {isEditing ? (
        <View style={styles.inputContainer}>
          <Text style={styles.pencilIcon}>✎</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Reflect and write your personal quote here..."
            placeholderTextColor={Colors.gray}
            value={quote}
            onChangeText={handleQuoteChange}
            multiline
            autoFocus
            onBlur={handleSaveQuote}
            onSubmitEditing={handleSaveQuote}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.quoteContainer}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.pencilIcon}>✎</Text>
          <Text style={styles.quoteText}>
            {quote || "Reflect and write your personal quote here..."}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBeige,
    borderRadius: Responsive.r.xl,
    padding: Responsive.xxl,
    marginHorizontal: Responsive.xl,
    marginTop: Responsive.v.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  tape: {
    position: "absolute",
    top: Responsive.v.md,
    left: "50%",
    transform: [{ translateX: -rScale(30) }],
    width: rScale(60),
    height: rVerticalScale(20),
    backgroundColor: Colors.tapeBlue,
    borderRadius: Responsive.r.sm,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tapeInner: {
    width: rScale(50),
    height: rVerticalScale(12),
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 2,
  },
  title: {
    fontSize: Responsive.f.lg,
    fontWeight: "700",
    color: Colors.primary,
    marginTop: Responsive.v.lg,
    marginBottom: Responsive.v.md,
    textAlign: "center",
    fontFamily: Fonts.avenir.heavy,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: Responsive.v.sm,
  },
  pencilIcon: {
    fontSize: Responsive.f.xl,
    color: Colors.primary,
    marginRight: Responsive.sm,
    marginTop: Responsive.v.xs,
  },
  textInput: {
    flex: 1,
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    fontStyle: "italic",
    minHeight: rVerticalScale(80),
    textAlignVertical: "top",
    fontFamily: Fonts.slackside,
  },
  quoteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: Responsive.v.sm,
  },
  quoteText: {
    flex: 1,
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    fontStyle: "italic",
    lineHeight: Responsive.f.md * 1.5,
    fontFamily: Fonts.slackside,
  },
});
