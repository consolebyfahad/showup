import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

interface Session {
  id: string;
  day: number; // 0 = Monday, 6 = Sunday
  time: string; // "09:00", "10:30", etc.
  title?: string;
  color?: string;
}

interface WeeklyCalendarProps {
  sessions?: Session[];
  onSessionPress?: (session: Session) => void;
  onTimeSlotPress?: (day: number, time: string) => void;
  onEditSession?: (session: Session) => void;
  onDeleteSession?: (sessionId: string) => void;
  currentWeek?: Date;
  onWeekChange?: (date: Date) => void;
}

export default function WeeklyCalendar({
  sessions = [],
  onSessionPress,
  onTimeSlotPress,
  onEditSession,
  onDeleteSession,
  currentWeek: externalCurrentWeek,
  onWeekChange,
}: WeeklyCalendarProps) {
  const [internalCurrentWeek, setInternalCurrentWeek] = useState(new Date());
  const currentWeek = externalCurrentWeek || internalCurrentWeek;
  const setCurrentWeek = onWeekChange || setInternalCurrentWeek;
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Get week dates (Monday to Sunday)
  const getWeekDates = () => {
    const date = new Date(currentWeek);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(date.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = getWeekDates();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const timeSlots = [
    "12 AM",
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM",
  ];

  const parseTime = (timeStr: string): number => {
    // Handle formats like "9:00 AM", "10:30 AM", "2:00 PM"
    const parts = timeStr.split(" ");
    const timePart = parts[0];
    const period = parts[1]?.toUpperCase();

    const [hours, minutes = "0"] = timePart.split(":");
    let hour = parseInt(hours);
    const min = parseInt(minutes);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return hour * 60 + min;
  };

  const formatWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    const startMonth = monthNames[start.getMonth()];
    const endMonth = monthNames[end.getMonth()];

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`;
    } else {
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
    }
  };

  const formatMonthYear = () => {
    return `${monthNames[currentWeek.getMonth()]} ${currentWeek.getFullYear()}`;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
    setSelectedSession(null); // Clear selection when navigating
  };

  const selectMonth = (monthIndex: number) => {
    const newDate = new Date(currentWeek);
    newDate.setMonth(monthIndex);
    setCurrentWeek(newDate);
    setSelectedSession(null);
    setShowMonthPicker(false);
  };

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
  };

  const selectYear = (year: number) => {
    const newDate = new Date(currentWeek);
    newDate.setFullYear(year);
    setCurrentWeek(newDate);
    setSelectedSession(null);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => setShowMonthPicker(true)}
          >
            <Text style={styles.monthText}>{formatMonthYear()}</Text>
            <Ionicons
              name="chevron-down"
              size={rScale(16)}
              color={Colors.gray}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.weekNavButton}
            onPress={() => navigateWeek("prev")}
          >
            <Ionicons
              name="chevron-back"
              size={rScale(18)}
              color={Colors.primary}
            />
          </TouchableOpacity>
          {/* <Text style={styles.weekText}>{formatWeekRange()}</Text> */}
          <TouchableOpacity
            style={styles.weekNavButton}
            onPress={() => navigateWeek("next")}
          >
            <Ionicons
              name="chevron-forward"
              size={rScale(18)}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Grid */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.calendarContainer}>
          {/* Time Column */}
          <View style={styles.timeColumn}>
            <View style={styles.timeColumnHeader}>
              <Text style={styles.weekRangeText}>{formatWeekRange()}</Text>
            </View>
            {timeSlots.map((time, index) => (
              <View key={index} style={styles.timeSlot}>
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {/* Day Headers */}
            <View style={styles.dayHeaders}>
              {weekDates.map((date, index) => {
                const today = isToday(date);
                return (
                  <View
                    key={index}
                    style={[styles.dayHeader, today && styles.dayHeaderToday]}
                  >
                    <Text
                      style={[styles.dayName, today && styles.dayNameToday]}
                    >
                      {dayNames[index]}
                    </Text>
                    <View
                      style={[
                        styles.dayNumberContainer,
                        today && styles.dayNumberContainerToday,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          today && styles.dayNumberToday,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Calendar Cells */}
            <View style={styles.calendarCells}>
              {weekDates.map((date, dayIndex) => {
                const today = isToday(date);
                return (
                  <View
                    key={dayIndex}
                    style={[styles.dayColumn, today && styles.dayColumnToday]}
                  >
                    {timeSlots.map((time, timeIndex) => {
                      // Find sessions that fall within this time slot
                      const slotStart = parseTime(time);
                      const slotEnd = slotStart + 60; // 1 hour slot

                      const session = sessions.find((s) => {
                        if (s.day !== dayIndex) return false;
                        const sessionTime = parseTime(s.time);
                        // Check if session starts within this hour slot
                        return (
                          sessionTime >= slotStart && sessionTime < slotEnd
                        );
                      });

                      return (
                        <TouchableOpacity
                          key={timeIndex}
                          style={[styles.cell, today && styles.cellToday]}
                          onPress={() => {
                            if (session) {
                              setSelectedSession(session);
                              onSessionPress?.(session);
                            }
                            // Empty time slots should not be clickable
                            // Only allow adding sessions via the plus icon
                          }}
                          activeOpacity={session ? 0.7 : 1}
                          disabled={!session}
                        >
                          {session && (
                            <View
                              style={[
                                styles.sessionBlock,
                                {
                                  backgroundColor:
                                    session.color || Colors.tagBlue,
                                },
                              ]}
                            >
                              <Text style={styles.sessionTime}>
                                {session.time}
                              </Text>
                              {session.title && (
                                <Text
                                  style={styles.sessionTitle}
                                  numberOfLines={1}
                                >
                                  {session.title}
                                </Text>
                              )}
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View
            style={styles.monthPickerContainer}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.monthPickerHeader}>
              <Text style={styles.monthPickerTitle}>Select Month</Text>
              <TouchableOpacity
                onPress={() => setShowMonthPicker(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={rScale(24)} color={Colors.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.monthPickerScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Year Selector */}
              <View style={styles.yearSection}>
                <Text style={styles.yearSectionTitle}>Year</Text>
                <View style={styles.yearGrid}>
                  {getAvailableYears().map((year) => {
                    const isSelected = currentWeek.getFullYear() === year;
                    return (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.yearButton,
                          isSelected && styles.yearButtonSelected,
                        ]}
                        onPress={() => selectYear(year)}
                      >
                        <Text
                          style={[
                            styles.yearButtonText,
                            isSelected && styles.yearButtonTextSelected,
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Month List */}
              <View style={styles.monthSection}>
                <Text style={styles.monthSectionTitle}>Month</Text>
                <View style={styles.monthGrid}>
                  {monthNames.map((month, index) => {
                    const isSelected = currentWeek.getMonth() === index;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.monthItem,
                          isSelected && styles.monthItemSelected,
                        ]}
                        onPress={() => selectMonth(index)}
                      >
                        <Text
                          style={[
                            styles.monthItemText,
                            isSelected && styles.monthItemTextSelected,
                          ]}
                        >
                          {month}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={rScale(20)}
                            color={Colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Selected Session Tooltip */}
      {selectedSession && (
        <View style={styles.tooltipOverlay}>
          <TouchableOpacity
            style={styles.tooltipBackdrop}
            activeOpacity={1}
            onPress={() => setSelectedSession(null)}
          />
          <View style={styles.tooltip}>
            <View style={styles.tooltipContent}>
              <View style={styles.tooltipHeader}>
                <View style={styles.tooltipTimeContainer}>
                  <Ionicons
                    name="time-outline"
                    size={rScale(18)}
                    color={Colors.primary}
                  />
                  <Text style={styles.tooltipTime}>{selectedSession.time}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedSession(null)}
                  style={styles.tooltipCloseButton}
                >
                  <Ionicons
                    name="close"
                    size={rScale(20)}
                    color={Colors.gray}
                  />
                </TouchableOpacity>
              </View>
              {selectedSession.title && (
                <Text style={styles.tooltipTitle}>{selectedSession.title}</Text>
              )}
              <View style={styles.tooltipActions}>
                {/* <TouchableOpacity
                  style={styles.tooltipButton}
                  onPress={() => {
                    if (selectedSession && onEditSession) {
                      onEditSession(selectedSession);
                      setSelectedSession(null);
                    }
                  }}
                >
                  <Text style={styles.tooltipButtonText}>Edit</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={[styles.tooltipButton, styles.tooltipButtonSecondary]}
                  onPress={() => {
                    if (selectedSession && onDeleteSession) {
                      onDeleteSession(selectedSession.id);
                      setSelectedSession(null);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.tooltipButtonText,
                      styles.tooltipButtonTextSecondary,
                    ]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Responsive.xl,
    paddingVertical: Responsive.v.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Responsive.xs,
    paddingHorizontal: Responsive.lg,
    paddingVertical: Responsive.v.sm,
    borderRadius: Responsive.r.md,
    backgroundColor: Colors.backgroundAccent,
  },
  monthText: {
    fontSize: Responsive.f.md,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Responsive.sm,
  },
  weekNavButton: {
    width: rScale(28),
    height: rScale(28),
    borderRadius: Responsive.r.sm,
    backgroundColor: Colors.backgroundAccent,
    justifyContent: "center",
    alignItems: "center",
  },
  weekText: {
    fontSize: Responsive.f.sm,
    fontWeight: "600",
    color: Colors.primary,
    minWidth: rScale(120),
    textAlign: "center",
    fontFamily: Fonts.avenir.regular,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Responsive.v.xxl,
  },
  calendarContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
  },
  timeColumn: {
    width: rScale(40),
    borderRightWidth: 2,
    borderRightColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  timeColumnHeader: {
    height: rVerticalScale(61),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  weekRangeText: {
    fontSize: Responsive.f.xs,
    fontWeight: "600",
    color: Colors.primary,
    textAlign: "center",
    fontFamily: Fonts.slackside,
  },
  timeSlot: {
    height: 60,
    // justifyContent: "flex-start",
    // paddingTop: Responsive.v.xs,
    alignItems: "center",
    justifyContent: "center",
    // paddingLeft: Responsive.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  timeText: {
    fontSize: Responsive.f.xs,
    fontWeight: "500",
    color: Colors.textSecondary,
    fontFamily: Fonts.slackside,
  },
  daysGrid: {
    flex: 1,
  },
  dayHeaders: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  dayHeader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: rVerticalScale(60),
    borderRightWidth: 1,
    borderRightColor: Colors.lightGray,
  },
  dayHeaderToday: {
    backgroundColor: Colors.backgroundAccent,
  },
  dayName: {
    fontSize: Responsive.f.xs,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Responsive.v.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: Fonts.slackside,
  },
  dayNameToday: {
    color: Colors.primary,
  },
  dayNumberContainer: {
    width: rScale(32),
    height: rScale(32),
    borderRadius: Responsive.r.md,
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumberContainerToday: {
    backgroundColor: Colors.primary,
  },
  dayNumber: {
    fontSize: Responsive.f.md,
    fontWeight: "700",
    color: Colors.black,
    fontFamily: Fonts.avenir.semibold,
  },
  dayNumberToday: {
    color: Colors.white,
  },
  calendarCells: {
    flexDirection: "row",
  },
  dayColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  dayColumnToday: {
    backgroundColor: "rgba(197, 211, 244, 0.2)", // 20% opacity
  },
  cell: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    padding: Responsive.xs,
    justifyContent: "center",
  },
  cellToday: {
    backgroundColor: "rgba(197, 211, 244, 0.1)", // 10% opacity
  },
  sessionBlock: {
    borderRadius: Responsive.r.sm,
    padding: Responsive.xs,
    minHeight: 50,
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionTime: {
    fontSize: Responsive.f.xs,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: Responsive.v.xs / 2,
    fontFamily: Fonts.slackside,
  },
  sessionTitle: {
    fontSize: Responsive.f.xs,
    color: Colors.white,
    fontWeight: "500",
    fontFamily: Fonts.slackside,
  },
  tooltipOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  tooltip: {
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.xl,
    padding: Responsive.xl,
    marginHorizontal: Responsive.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    minWidth: rScale(280),
  },
  tooltipContent: {
    // Content styling
  },
  tooltipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Responsive.v.md,
  },
  tooltipTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Responsive.xs,
  },
  tooltipTime: {
    fontSize: Responsive.f.lg,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
  tooltipCloseButton: {
    width: rScale(32),
    height: rScale(32),
    borderRadius: Responsive.r.md,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipTitle: {
    fontSize: Responsive.f.md,
    color: Colors.darkGray,
    fontWeight: "600",
    marginBottom: Responsive.v.lg,
    fontFamily: Fonts.avenir.regular,
  },
  tooltipActions: {
    flexDirection: "row",
    gap: Responsive.sm,
    marginTop: Responsive.v.sm,
  },
  tooltipButton: {
    flex: 1,
    paddingVertical: Responsive.v.md,
    borderRadius: Responsive.r.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  tooltipButtonSecondary: {
    backgroundColor: Colors.logoutRed,
  },
  tooltipButtonText: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.white,
    fontFamily: Fonts.avenir.semibold,
  },
  tooltipButtonTextSecondary: {
    color: Colors.white,
  },
  // Month Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Responsive.xl,
  },
  monthPickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: Responsive.r.xl,
    width: "100%",
    maxWidth: rScale(400),
    maxHeight: rVerticalScale(600),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  monthPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Responsive.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  monthPickerTitle: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
  closeButton: {
    width: rScale(32),
    height: rScale(32),
    borderRadius: Responsive.r.md,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  monthPickerScroll: {
    maxHeight: rVerticalScale(500),
  },
  yearSection: {
    padding: Responsive.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  yearSectionTitle: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: Responsive.v.md,
    fontFamily: Fonts.avenir.regular,
  },
  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Responsive.sm,
  },
  yearButton: {
    paddingHorizontal: Responsive.lg,
    paddingVertical: Responsive.v.sm,
    borderRadius: Responsive.r.md,
    backgroundColor: Colors.backgroundAccent,
    minWidth: rScale(70),
    alignItems: "center",
  },
  yearButtonSelected: {
    backgroundColor: Colors.primary,
  },
  yearButtonText: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: Fonts.avenir.regular,
  },
  yearButtonTextSelected: {
    color: Colors.white,
  },
  monthSection: {
    padding: Responsive.xl,
  },
  monthSectionTitle: {
    fontSize: Responsive.f.md,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: Responsive.v.md,
    fontFamily: Fonts.avenir.regular,
  },
  monthGrid: {
    gap: Responsive.xs,
  },
  monthItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Responsive.md,
    borderRadius: Responsive.r.md,
    backgroundColor: Colors.backgroundAccent,
  },
  monthItemSelected: {
    backgroundColor: "rgba(19, 32, 75, 0.1)", // Light primary color
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  monthItemText: {
    fontSize: Responsive.f.md,
    fontWeight: "500",
    color: Colors.darkGray,
    fontFamily: Fonts.avenir.regular,
  },
  monthItemTextSelected: {
    color: Colors.primary,
    fontWeight: "700",
    fontFamily: Fonts.avenir.semibold,
  },
});
