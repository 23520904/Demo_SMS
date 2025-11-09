import { StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]} edges={["top", "bottom"]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
