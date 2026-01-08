/**
 * Centralized AsyncStorage keys for the app
 * All storage keys should be defined here for consistency and maintainability
 */
export const StorageKeys = {
  // Onboarding
  ONBOARDING_COMPLETE: "@yo_twin_onboarding_complete",
  ONBOARDING_DATA: "@yo_twin_onboarding_data",

  // User Profile
  USER_PROFILE: "@yo_twin_user_profile",

  // Sessions
  SESSIONS: "@yo_twin_sessions",
  SESSION_STATE: "@yo_twin_session_state",

  // Vision Board
  VISION_BOARDS: "@yo_twin_vision_boards",
  CURRENT_VISION_BOARD: "@yo_twin_current_vision_board",

  // Streak & Progress
  WEEKLY_STREAK: "@yo_twin_weekly_streak",
  STREAK_START_DATE: "@yo_twin_streak_start_date",
  LIFETIME_COUNT: "@yo_twin_lifetime_count",

  // Weekly Features
  WEEKLY_QUESTIONNAIRE: "@yo_twin_weekly_questionnaire",
  WEEKLY_QUOTE: "@yo_twin_weekly_quote",

  // Notifications
  HANDLED_NOTIFICATIONS: "@yo_twin_handled_notifications",
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];

