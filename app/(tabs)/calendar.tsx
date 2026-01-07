import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WeeklyCalendar from "../../components/calendar/WeeklyCalendar";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale } from "../../utils/responsive";
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
  const [showAddMenu, setShowAddMenu] = useState(false);

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
          // Parse date in local timezone to avoid day shift issues
          const [year, month, day] = s.date.split("-").map(Number);
          const sessionDate = new Date(year, month - 1, day);
          const dayOfWeek = getDayOfWeek(sessionDate);

          return {
            id: s.id,
            day: dayOfWeek,
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
      // Error loading sessions
    }
  }, [currentWeek]);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions])
  );

  const handleSessionPress = (session: {
    id: string;
    day: number;
    time: string;
    title?: string;
    color?: string;
  }) => {
    // Show edit/delete options (handled by WeeklyCalendar tooltip)
    // The tooltip will handle showing Edit/Delete buttons
    // No need to navigate immediately
  };

  const handleTimeSlotPress = (day: number, time: string) => {
    // Empty time slots should not open the session screen
    // Only allow adding sessions via the plus icon
    // Do nothing when clicking empty time slots
    return;
  };

  const handleEditSession = (session: CalendarSession | { id: string }) => {
    router.push({
      pathname: "/sessions/add-edit",
      params: {
        sessionId: session.id,
      },
    });
  };

  const handleDeleteSessionWrapper = async (sessionId: string) => {
    await handleDeleteSession(sessionId);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      await loadSessions();
    } catch (error) {
      // Error deleting session
    }
  };

  const handleAddTask = () => {
    setShowAddMenu(false);
    router.push("/sessions/add-edit");
  };

  const handleAddHabit = () => {
    setShowAddMenu(false);
    // Navigate to habit creation flow
    // For now, we'll create a simple habit flow similar to task
    router.push("/sessions/add-edit?type=habit");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <WeeklyCalendar
        sessions={sessions.map((s) => ({
          id: s.id,
          day: s.day,
          time: s.time,
          title: s.title,
          color: s.color,
        }))}
        onSessionPress={handleSessionPress}
        onTimeSlotPress={handleTimeSlotPress}
        onEditSession={(session) => {
          // Use the session directly - we only need the ID for navigation
          handleEditSession(session);
        }}
        onDeleteSession={handleDeleteSessionWrapper}
        currentWeek={currentWeek}
        onWeekChange={setCurrentWeek}
      />

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setShowAddMenu(!showAddMenu)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showAddMenu ? "close" : "add"}
            size={rScale(28)}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* Add Menu Modal - Floating Menu */}
      {showAddMenu && (
        <View style={styles.menuOverlay}>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setShowAddMenu(false)}
          />
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemHabit]}
              onPress={handleAddHabit}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>Add Habit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemTask]}
              onPress={handleAddTask}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>Add task</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  fabContainer: {
    position: "absolute",
    bottom: Responsive.v.xxl + Responsive.v.lg,
    right: Responsive.xl,
    zIndex: 1000,
  },
  fabButton: {
    width: rScale(56),
    height: rScale(56),
    borderRadius: rScale(28),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  menuContainer: {
    position: "absolute",
    bottom: Responsive.v.xxl + Responsive.v.lg + rScale(56) + Responsive.v.md,
    right: Responsive.xl,
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.lg,
    paddingVertical: Responsive.v.sm,
    minWidth: rScale(180),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    // Arrow pointing down to button
    borderBottomRightRadius: Responsive.r.sm,
  },
  menuItem: {
    paddingVertical: Responsive.v.lg,
    paddingHorizontal: Responsive.xl,
    borderRadius: Responsive.r.md,
    marginHorizontal: Responsive.sm,
    marginVertical: Responsive.v.xs,
    minWidth: rScale(160),
    alignItems: "center",
  },
  menuItemTask: {
    backgroundColor: Colors.cream, // Light yellow/cream
  },
  menuItemHabit: {
    backgroundColor: Colors.backgroundAccent, // Light purple/blue
  },
  menuItemText: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.black,
    fontFamily: Fonts.avenir.regular,
  },
});
