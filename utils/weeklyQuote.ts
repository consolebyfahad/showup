import AsyncStorage from "@react-native-async-storage/async-storage";

const WEEKLY_QUOTE_KEY = "@yo_twin_weekly_quote";
const QUOTE_DURATION_DAYS = 7;

interface WeeklyQuote {
  text: string;
  createdAt: string; // ISO date string
  expiresAt: string; // ISO date string (7 days from createdAt)
}

/**
 * Check if a quote is expired
 */
function isQuoteExpired(quote: WeeklyQuote): boolean {
  const now = new Date();
  const expiresAt = new Date(quote.expiresAt);
  return now > expiresAt;
}

/**
 * Get the current weekly quote from storage
 * Returns null if no quote exists or if quote is expired
 */
export async function getWeeklyQuote(): Promise<string | null> {
  try {
    const quoteJson = await AsyncStorage.getItem(WEEKLY_QUOTE_KEY);
    if (!quoteJson) {
      return null;
    }

    const quote: WeeklyQuote = JSON.parse(quoteJson);

    // Check if quote is expired
    if (isQuoteExpired(quote)) {
      // Remove expired quote
      await AsyncStorage.removeItem(WEEKLY_QUOTE_KEY);
      return null;
    }

    return quote.text;
  } catch (error) {
    console.error("Error getting weekly quote:", error);
    return null;
  }
}

/**
 * Save a weekly quote with expiration date (7 days from now)
 * When user edits, the timer resets from the current day
 */
export async function saveWeeklyQuote(quoteText: string): Promise<void> {
  try {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + QUOTE_DURATION_DAYS);

    const quote: WeeklyQuote = {
      text: quoteText,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    await AsyncStorage.setItem(WEEKLY_QUOTE_KEY, JSON.stringify(quote));
  } catch (error) {
    console.error("Error saving weekly quote:", error);
    throw error;
  }
}

/**
 * Delete the current weekly quote
 */
export async function deleteWeeklyQuote(): Promise<void> {
  try {
    await AsyncStorage.removeItem(WEEKLY_QUOTE_KEY);
  } catch (error) {
    console.error("Error deleting weekly quote:", error);
  }
}

/**
 * Get days remaining until quote expires
 */
export async function getDaysRemaining(): Promise<number | null> {
  try {
    const quoteJson = await AsyncStorage.getItem(WEEKLY_QUOTE_KEY);
    if (!quoteJson) {
      return null;
    }

    const quote: WeeklyQuote = JSON.parse(quoteJson);

    if (isQuoteExpired(quote)) {
      return null;
    }

    const now = new Date();
    const expiresAt = new Date(quote.expiresAt);
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  } catch (error) {
    console.error("Error getting days remaining:", error);
    return null;
  }
}

