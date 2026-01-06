import { Octicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale } from "../../utils/responsive";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const getIconName = () => {
          switch (route.name) {
            case "index":
              return "home";
            case "calendar":
              return "calendar";
            case "album":
              return "image";
            case "profile":
              return "person";
            default:
              return "dot";
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={`tab-${route.name}`}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View
              style={[styles.tabContent, isFocused && styles.tabContentActive]}
            >
              <Octicons
                name={getIconName()}
                size={rScale(24)}
                color={isFocused ? Colors.primary : Colors.gray}
              />
              <Text
                style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
              >
                {String(label)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderTopLeftRadius: Responsive.r.xxl,
    overflow: "hidden",
    borderTopRightRadius: Responsive.r.xxl,
    paddingTop: Responsive.v.xs,
    paddingBottom: Platform.OS === "ios" ? Responsive.v.lg : Responsive.v.md,
    paddingHorizontal: Responsive.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Responsive.v.sm,
    paddingHorizontal: Responsive.sm,
    borderRadius: Responsive.r.md,
    minWidth: rScale(60),
  },
  tabContentActive: {
    backgroundColor: Colors.backgroundAccent,
  },
  tabLabel: {
    fontSize: Responsive.f.xs,
    fontWeight: "500",
    color: Colors.gray,
    marginTop: Responsive.v.xs,
    fontFamily: Fonts.slackside,
  },
  tabLabelActive: {
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.slackside,
  },
});
