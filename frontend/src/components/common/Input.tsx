import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { useState } from "react";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFF",
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  rightIcon: {
    padding: 12,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});