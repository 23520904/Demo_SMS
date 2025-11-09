import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {scrollEnabled ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, style]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            overScrollMode="never"
          >
            {children}
          </ScrollView>
        ) : (
          <>{children}</>
        )}
      </TouchableWithoutFeedback>
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
  },
});
