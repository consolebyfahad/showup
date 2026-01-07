import { Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import CustomTabBar from "../../components/navigation/CustomTabBar";
import NotificationHandler from "../../components/navigation/NotificationHandler";
import { rScale } from "../../utils/responsive";

export default function TabLayout() {
  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Octicons name="home" size={rScale(24)} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            tabBarIcon: ({ color, focused }) => (
              <Octicons name="calendar" size={rScale(24)} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="album"
          options={{
            title: "Album",
            tabBarIcon: ({ color, focused }) => (
              <Octicons name="image" size={rScale(24)} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Octicons name="person" size={rScale(24)} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/subscription"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="profile/help"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="profile/about"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="vision-board/upload"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="weekly/questionnaire"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="sessions/add-edit"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
      <NotificationHandler />
    </>
  );
}
