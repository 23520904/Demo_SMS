import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { COLORS } from "../../constants/colors";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = "primary",
  disabled,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? COLORS.primary : "#FFF"}
        />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  disabled: {
    backgroundColor: COLORS.buttonDisabled,
    borderColor: COLORS.buttonDisabled,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFF",
  },
  secondaryText: {
    color: "#FFF",
  },
  outlineText: {
    color: COLORS.primary,
  },
});