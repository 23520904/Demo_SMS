import { StyleSheet, Text, View } from "react-native";
import { SafeAreaContainer } from "../src/components/layout/SafeAreaContainer";
import { Link } from "expo-router";
import { COLORS } from "../src/constants/colors";
// import { COLORS } from "../src/constants/colors"; // Bạn cần import COLORS

export default function NotFoundScreen() {
  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Page Not Found</Text>
        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.linkText}>Go back home</Text>
        </Link>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: "bold",
    color: COLORS.primary, // Đảm bảo COLORS được import
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.textSecondary, // Đảm bảo COLORS được import
    marginBottom: 32,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    fontSize: 16,
    color: COLORS.primary, // Đảm bảo COLORS được import
    fontWeight: "600",
  },
});
