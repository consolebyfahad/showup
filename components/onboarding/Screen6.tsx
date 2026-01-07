import React, { useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

interface Screen6Props {
  currentDay: string;
  selectedTime: { hour: number; minute: number; period: "AM" | "PM" };
  onTimeChange: (time: {
    hour?: number;
    minute?: number;
    period?: "AM" | "PM";
  }) => void;
}

const ITEM_HEIGHT = rVerticalScale(50);
const VISIBLE_ITEMS = 3; // Number of items visible (odd number for center selection)

export default function Screen6({
  currentDay,
  selectedTime,
  onTimeChange,
}: Screen6Props) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45]; // Common minute intervals
  const periods: ("AM" | "PM")[] = ["AM", "PM"];

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  const formatTime = () => {
    const hour = selectedTime.hour.toString().padStart(2, "0");
    const minute = selectedTime.minute.toString().padStart(2, "0");
    return `${hour}:${minute} ${selectedTime.period}`;
  };

  // Calculate initial scroll position for selected values
  const getInitialScrollY = (
    value: number | string,
    items: (number | string)[]
  ): number => {
    const index = items.indexOf(value);
    if (index === -1) return 0;
    return index * ITEM_HEIGHT;
  };

  // Scroll to selected value on mount
  useEffect(() => {
    const hourIndex = hours.indexOf(selectedTime.hour);
    if (hourIndex !== -1 && hourScrollRef.current) {
      setTimeout(() => {
        hourScrollRef.current?.scrollTo({
          y: hourIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const minuteIndex = minutes.indexOf(selectedTime.minute);
    if (minuteIndex !== -1 && minuteScrollRef.current) {
      setTimeout(() => {
        minuteScrollRef.current?.scrollTo({
          y: minuteIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const periodIndex = periods.indexOf(selectedTime.period);
    if (periodIndex !== -1 && periodScrollRef.current) {
      setTimeout(() => {
        periodScrollRef.current?.scrollTo({
          y: periodIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    items: (number | string)[],
    type: "hour" | "minute" | "period"
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    const selectedValue = items[clampedIndex];

    if (type === "hour" && selectedValue !== selectedTime.hour) {
      onTimeChange({ hour: selectedValue as number });
    } else if (type === "minute" && selectedValue !== selectedTime.minute) {
      onTimeChange({ minute: selectedValue as number });
    } else if (type === "period" && selectedValue !== selectedTime.period) {
      onTimeChange({ period: selectedValue as "AM" | "PM" });
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    items: (number | string)[],
    scrollRef: React.RefObject<ScrollView | null>
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    const snapY = clampedIndex * ITEM_HEIGHT;

    scrollRef.current?.scrollTo({
      y: snapY,
      animated: true,
    });
  };

  const renderPickerWheel = (
    items: (number | string)[],
    selectedValue: number | string,
    type: "hour" | "minute" | "period",
    scrollRef: React.RefObject<ScrollView | null>
  ) => {
    const paddingTop = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);
    const paddingBottom = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

    return (
      <View style={styles.pickerContainer}>
        {/* Selection indicator overlay */}
        <View style={styles.selectionIndicator} pointerEvents="none" />

        <ScrollView
          ref={scrollRef}
          style={styles.pickerScroll}
          contentContainerStyle={{
            paddingTop,
            paddingBottom,
          }}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={(e) => handleScroll(e, items, type)}
          onMomentumScrollEnd={(e) =>
            handleMomentumScrollEnd(e, items, scrollRef)
          }
          scrollEventThrottle={16}
        >
          {items.map((item, index) => {
            const isSelected = item === selectedValue;
            return (
              <View
                key={`${item}-${index}`}
                style={[
                  styles.pickerItem,
                  { height: ITEM_HEIGHT },
                  isSelected && styles.pickerItemSelected,
                ]}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    isSelected && styles.pickerItemTextSelected,
                  ]}
                >
                  {typeof item === "number"
                    ? item.toString().padStart(2, "0")
                    : item}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{currentDay}</Text>
      </View>

      <Text style={styles.questionText}>You'll do this when?</Text>

      <View style={styles.timePickerContainer}>
        {renderPickerWheel(hours, selectedTime.hour, "hour", hourScrollRef)}

        <Text style={styles.timeSeparator}>:</Text>

        {renderPickerWheel(
          minutes,
          selectedTime.minute,
          "minute",
          minuteScrollRef
        )}

        {renderPickerWheel(
          periods,
          selectedTime.period,
          "period",
          periodScrollRef
        )}
      </View>

      <View style={styles.selectedTimeDisplay}>
        <Text style={styles.selectedTimeText}>{formatTime()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  dayHeader: {
    backgroundColor: Colors.cream,
    borderRadius: Responsive.r.md,
    paddingVertical: Responsive.v.sm,
    paddingHorizontal: Responsive.lg,
    alignSelf: "center",
    marginBottom: Responsive.v.lg,
  },
  dayText: {
    fontSize: Responsive.f.xl,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: Fonts.avenir.semibold,
  },
  questionText: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.xl,
    lineHeight: Responsive.f.xxxl * 1.3,
    fontFamily: Fonts.avenir.semibold,
  },
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: rVerticalScale(20),
    marginBottom: Responsive.v.lg,
    gap: Responsive.g.sm,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  pickerContainer: {
    flex: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: "relative",
    overflow: "hidden",
  },
  pickerScroll: {
    flex: 1,
  },
  selectionIndicator: {
    position: "absolute",
    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Responsive.r.sm,
    zIndex: 1,
    opacity: 0.2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
  },
  pickerItem: {
    justifyContent: "center",
    alignItems: "center",
    height: ITEM_HEIGHT,
  },
  pickerItemSelected: {
    // Selected item styling is handled by text
  },
  pickerItemText: {
    fontSize: Responsive.f.md,
    color: Colors.gray,
    fontFamily: Fonts.avenir.regular,
  },
  pickerItemTextSelected: {
    fontSize: Responsive.f.xl,
    fontWeight: "700",
    color: Colors.black,
    fontFamily: Fonts.avenir.semibold,
  },
  timeSeparator: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "600",
    color: Colors.black,
    marginHorizontal: Responsive.sm,
    fontFamily: Fonts.avenir.semibold,
  },
  selectedTimeDisplay: {
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Responsive.r.md,
    padding: Responsive.lg,
    alignItems: "center",
    marginTop: Responsive.v.lg,
    marginBottom: Responsive.v.xl,
  },
  selectedTimeText: {
    fontSize: Responsive.f.xl,
    fontWeight: "600",
    color: Colors.black,
    fontFamily: Fonts.avenir.semibold,
  },
});
