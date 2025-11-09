import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../../src/constants/colors";
import { useAuthStore } from "../../src/store/authStore";
import React, { useEffect } from "react";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";

export default function HomeScreen() {
  const { user, refreshUserProfile } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    refreshUserProfile();
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
          <Text style={styles.cardTitle}>🎉 Welcome!</Text>
          <Text style={styles.cardText}>
            You have successfully logged into the SMS Authentication system.
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name:</Text>
              <Text style={styles.infoValue}>{user?.fullName}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number:</Text>
              <Text style={styles.infoValue}>{user?.phoneNumber}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date Created:</Text>
              <Text style={styles.infoValue}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US") // Changed to en-US locale
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Account</Text>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
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
    paddingVertical: 8,
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
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
