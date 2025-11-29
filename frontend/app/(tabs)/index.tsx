import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../src/constants/colors";
import { useAuthStore } from "../../src/store/authStore";
import React, { useEffect } from "react";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";

export default function HomeScreen() {
  const { user, refreshUserProfile } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const hasRefreshed = React.useRef(false);

  useEffect(() => {
    // Chỉ refresh một lần khi component mount
    if (!hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshUserProfile();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserProfile();
    setRefreshing(false);
  };

  return (
    <SafeAreaContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{user?.fullName || "User"}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="checkmark-circle" size={32} color="#FFF" />
            <Text style={styles.cardTitle}>Welcome!</Text>
          </View>
          <Text style={styles.cardText}>
            You have successfully logged into the SMS Authentication system.
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.infoLabel}>Full Name</Text>
              </View>
              <Text style={styles.infoValue}>{user?.fullName || "N/A"}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.infoLabel}>Phone Number</Text>
              </View>
              <Text style={styles.infoValue}>{user?.phoneNumber || "N/A"}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.infoLabel}>Date Created</Text>
              </View>
              <Text style={styles.infoValue}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US")
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  cardText: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.9,
    lineHeight: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 4,
  },
});
