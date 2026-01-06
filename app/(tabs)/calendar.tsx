import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import WeeklyCalendar from "../../components/calendar/WeeklyCalendar";
import { Colors } from "../../constants/colors";
import { Responsive } from "../../utils/responsive";
import {
  Session,
  getAllSessions,
  getSessionsForDateRange,
  formatTime,
  formatDate,
  getDayOfWeek,
  deleteSession,
} from "../../utils/sessions";

interface CalendarSession {
  id: string;
  day: number; // 0-6 (Monday-Sunday)
  time: string; // "9:00 AM"
  title?: string;
  color?: string;
  date: string; // ISO date string
  hour: number;
  minute: number;
}

export default function Calendar() {
  const router = useRouter();
  const [sessions, setSessions] = useState<CalendarSession[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const loadSessions = useCallback(async () => {
    try {
      // Get week dates (Monday to Sunday)
      const date = new Date(currentWeek);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      // Get sessions for this week
      const weekSessions = await getSessionsForDateRange(monday, sunday);

      // Convert to calendar format
      const calendarSessions: CalendarSession[] = weekSessions
        .filter((s) => !s.isCompleted) // Only show incomplete sessions
        .map((s) => {
          const sessionDate = new Date(s.date);
          return {
            id: s.id,
            day: getDayOfWeek(sessionDate),
            time: formatTime(s.hour, s.minute),
            title: s.title,
            color: s.color || Colors.tagBlue,
            date: s.date,
            hour: s.hour,
            minute: s.minute,
          };
        });

      setSessions(calendarSessions);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  }, [currentWeek]);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions])
  );

  const handleSessionPress = (session: CalendarSession) => {
    // Show edit/delete options (handled by WeeklyCalendar tooltip)
  };

  const handleTimeSlotPress = (day: number, time: string) => {
    // Get the actual date for this day in the current week
    const date = new Date(currentWeek);
    const currentDay = date.getDay();
    const diff = date.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + day);

    router.push({
      pathname: "/sessions/add-edit",
      params: {
        date: formatDate(targetDate),
        time: time,
      },
    });
  };

  const handleEditSession = (session: CalendarSession) => {
    router.push({
      pathname: "/sessions/add-edit",
      params: {
        sessionId: session.id,
      },
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    <View style={styles.container}>
      <WeeklyCalendar
        sessions={sessions}
        onSessionPress={handleSessionPress}
        onTimeSlotPress={handleTimeSlotPress}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        currentWeek={currentWeek}
        onWeekChange={setCurrentWeek}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Responsive.v.xxxl,
    flex: 1,
    backgroundColor: Colors.white,
  },
});
