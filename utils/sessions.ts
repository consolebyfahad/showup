import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSIONS_KEY = "@yo_twin_sessions";

export interface Session {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  hour: number; // 0-23 (24-hour format)
  minute: number; // 0-59
  title?: string;
  color?: string;
  createdAt: string; // ISO date string
  isCompleted: boolean;
  completedAt?: string; // ISO date string when session was completed
}

/**
 * Get all sessions from storage
 */
export async function getAllSessions(): Promise<Session[]> {
  try {
    const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!sessionsJson) {
      return [];
    }
    return JSON.parse(sessionsJson);
  } catch (error) {
    return [];
  }
}

/**
 * Save a session
 */
export async function saveSession(session: Session): Promise<void> {
  try {
    const sessions = await getAllSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }

    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const sessions = await getAllSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    throw error;
  }
}

/**
 * Check if a session overlaps with existing sessions
 * Sessions are considered overlapping if they're on the same date and time
 */
export async function checkSessionOverlap(
  date: string,
  hour: number,
  minute: number,
  excludeSessionId?: string
): Promise<boolean> {
  try {
    const sessions = await getAllSessions();
    const overlapping = sessions.find((s) => {
      if (excludeSessionId && s.id === excludeSessionId) {
        return false;
      }
      return (
        s.date === date &&
        s.hour === hour &&
        s.minute === minute &&
        !s.isCompleted
      );
    });
    return !!overlapping;
  } catch (error) {
    return false;
  }
}

/**
 * Get sessions for a specific date range
 */
export async function getSessionsForDateRange(
  startDate: Date,
  endDate: Date
): Promise<Session[]> {
  try {
    const sessions = await getAllSessions();
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    return sessions.filter((s) => {
      const sessionDate = s.date;
      return sessionDate >= start && sessionDate <= end;
    });
  } catch (error) {
    return [];
  }
}

/**
 * Mark a session as completed
 */
export async function completeSession(sessionId: string): Promise<void> {
  try {
    const sessions = await getAllSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      session.isCompleted = true;
      session.completedAt = new Date().toISOString();
      await saveSession(session);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Convert hour/minute to time string (e.g., "9:00 AM")
 */
export function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, "0");
  return `${displayHour}:${displayMinute} ${period}`;
}

/**
 * Parse time string to hour and minute (24-hour format)
 */
export function parseTimeString(timeStr: string): { hour: number; minute: number } {
  const parts = timeStr.split(" ");
  const timePart = parts[0];
  const period = parts[1]?.toUpperCase();

  const [hours, minutes = "0"] = timePart.split(":");
  let hour = parseInt(hours);
  const minute = parseInt(minutes);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return { hour, minute };
}

/**
 * Get day of week index (0 = Monday, 6 = Sunday)
 */
export function getDayOfWeek(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Monday (1) to 0
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}



