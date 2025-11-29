import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
      icon: "lock-closed-outline" as keyof typeof Ionicons.glyphMap,
      title: "Change Password",
      onPress: () => router.push("/(tabs)/change-password"),
    },
    {
      icon: "notifications-outline" as keyof typeof Ionicons.glyphMap,
      title: "Notifications",
      onPress: () => Alert.alert("Notifications", "Feature in development"),
    },
    {
      icon: "information-circle-outline" as keyof typeof Ionicons.glyphMap,
      title: "About App",
      onPress: () => Alert.alert("About App", "SMS Auth App v1.0.0"),
    },
  ];

  return (
    <SafeAreaContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="checkmark" size={16} color="#FFF" />
            </View>
          </View>
          <Text style={styles.name}>{user?.fullName || "User"}</Text>
          <View style={styles.phoneContainer}>
            <Ionicons
              name="call-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.phone}>
              {displayPhoneNumber(user?.phoneNumber || "")}
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
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
    paddingVertical: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.background,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    gap: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: COLORS.error,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
