import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

interface KeyboardAvoidingContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollEnabled?: boolean;
}

export const KeyboardAvoidingContainer: React.FC<
  KeyboardAvoidingContainerProps
> = ({ children, style, scrollEnabled = true }) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      enabled
    >
      {scrollEnabled ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, style]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          overScrollMode="auto"
          nestedScrollEnabled={true}
        >
          {children}
        </ScrollView>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>{children}</View>
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80, // Thêm padding bottom để có thể scroll đến cuối khi keyboard mở
  },
});
