import {
  Alert, // Đã thêm Alert
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity, // Đã thêm TouchableOpacity
  View,
} from "react-native";
import { COLORS } from "../../src/constants/colors";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";
import { displayPhoneNumber } from "../../src/utils/formatPhone";
import { router } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { useToast } from "../../src/hooks/useToast";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { showConfirm } = useToast();

  const handleLogout = () => {
    showConfirm("Are you sure you want to log out?", async () => {
      // Dịch
      await logout();
    });
  };

  const menuItems = [
    {
      icon: "🔐",
      title: "Change Password", // Dịch
      onPress: () => router.push("/(tabs)/change-password"),
    },
    {
      icon: "🔔",
      title: "Notifications", // Dịch
      onPress: () => Alert.alert("Notifications", "Feature in development"), // Dịch
    },
    {
      icon: "ℹ️",
      title: "About App", // Dịch
      onPress: () => Alert.alert("About App", "SMS Auth App v1.0.0"), // Dịch
    },
  ];

  return (
    <SafeAreaContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>

          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.phone}>
            {displayPhoneNumber(user?.phoneNumber || "")}
          </Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  menu: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.text,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
