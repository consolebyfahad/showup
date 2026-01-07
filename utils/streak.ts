import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "@yo_twin_weekly_streak";
const STREAK_START_DATE_KEY = "@yo_twin_streak_start_date";
const LIFETIME_COUNT_KEY = "@yo_twin_lifetime_count";

export interface StreakData {
  currentStreak: number; // Days in current week (0-7)
  weekStartDate: string; // ISO date string for the week start (Monday)
  completedDates: string[]; // Array of ISO date strings for completed days
}

/**
 * Get current week start date (Monday)
 */
export function getWeekStartDate(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get current streak data
 */
export async function getStreakData(): Promise<StreakData> {
  try {
    const streakJson = await AsyncStorage.getItem(STREAK_KEY);
    const startDateJson = await AsyncStorage.getItem(STREAK_START_DATE_KEY);
    
    const currentWeekStart = getWeekStartDate();
    const storedWeekStart = startDateJson 
      ? new Date(startDateJson) 
      : null;

    // If no streak data or week has changed, reset
    if (!streakJson || !storedWeekStart || 
        formatDateString(storedWeekStart) !== formatDateString(currentWeekStart)) {
      return {
        currentStreak: 0,
        weekStartDate: currentWeekStart.toISOString(),
        completedDates: [],
      };
    }

    const streak: StreakData = JSON.parse(streakJson);
    
    // Verify week hasn't changed
    const streakWeekStart = new Date(streak.weekStartDate);
    if (formatDateString(streakWeekStart) !== formatDateString(currentWeekStart)) {
      // Week changed, reset
      return {
        currentStreak: 0,
        weekStartDate: currentWeekStart.toISOString(),
        completedDates: [],
      };
    }

    return streak;
  } catch (error) {
    const currentWeekStart = getWeekStartDate();
    return {
      currentStreak: 0,
      weekStartDate: currentWeekStart.toISOString(),
      completedDates: [],
    };
  }
}

/**
 * Mark today as completed and increment streak
 */
export async function markDayCompleted(): Promise<StreakData> {
  try {
    const today = new Date();
    const todayString = formatDateString(today);
    const currentWeekStart = getWeekStartDate();
    
    let streak = await getStreakData();
    
    // If week changed, reset
    const streakWeekStart = new Date(streak.weekStartDate);
    if (formatDateString(streakWeekStart) !== formatDateString(currentWeekStart)) {
      streak = {
        currentStreak: 0,
        weekStartDate: currentWeekStart.toISOString(),
        completedDates: [],
      };
    }

    // Check if already completed today
    if (streak.completedDates.includes(todayString)) {
      return streak;
    }

    // Add today to completed dates
    streak.completedDates.push(todayString);
    streak.currentStreak = streak.completedDates.length;

    // Save streak data
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    await AsyncStorage.setItem(STREAK_START_DATE_KEY, currentWeekStart.toISOString());

    // Increment lifetime count
    await incrementLifetimeCount();

    return streak;
  } catch (error) {
    throw error;
  }
}

/**
 * Reset streak for new week
 */
export async function resetStreak(): Promise<void> {
  try {
    const currentWeekStart = getWeekStartDate();
    const newStreak: StreakData = {
      currentStreak: 0,
      weekStartDate: currentWeekStart.toISOString(),
      completedDates: [],
    };
    
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
    await AsyncStorage.setItem(STREAK_START_DATE_KEY, currentWeekStart.toISOString());
  } catch (error) {
    // Error resetting streak
  }
}

/**
 * Get lifetime session count
 */
export async function getLifetimeCount(): Promise<number> {
  try {
    const count = await AsyncStorage.getItem(LIFETIME_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Increment lifetime session count
 */
export async function incrementLifetimeCount(): Promise<number> {
  try {
    const current = await getLifetimeCount();
    const newCount = current + 1;
    await AsyncStorage.setItem(LIFETIME_COUNT_KEY, newCount.toString());
    return newCount;
  } catch (error) {
    return 0;
  }
}

/**
 * Check if week has passed and needs reset
 * Also clears onboarding status to trigger onboarding again
 */
export async function checkAndResetWeek(): Promise<boolean> {
  try {
    const startDateJson = await AsyncStorage.getItem(STREAK_START_DATE_KEY);
    if (!startDateJson) {
      return false;
    }

    const storedWeekStart = new Date(startDateJson);
    const currentWeekStart = getWeekStartDate();

    // If week has changed, reset everything
    if (formatDateString(storedWeekStart) !== formatDateString(currentWeekStart)) {
      // Reset streak
      await resetStreak();
      
      // Clear onboarding status to trigger onboarding again
      await AsyncStorage.removeItem("@yo_twin_onboarding_complete");
      
      // Clear current vision board
      const { setCurrentVisionBoard } = await import("./visionBoard");
      await setCurrentVisionBoard(null);
      
      // Cancel all notifications (will be rescheduled in onboarding)
      const { cancelAllNotifications } = await import("./notifications");
      await cancelAllNotifications();
      
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

