import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { COLORS } from "../../src/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.background,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home", // Dịch: Trang chủ
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile", // Dịch: Cá nhân
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="user" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

// Simple TabBarIcon component (you can replace with icons library)
const TabBarIcon = ({ name, color, size }: any) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.3,
      }}
    />
  );
};
