import { router, useLocalSearchParams } from "expo-router";
import { useToast } from "../../src/hooks/useToast";
import { useState } from "react";
import { authService } from "../../src/api/services/auth.service";
import { SUCCESS_MESSAGES } from "../../src/constants/messages";
import { handleApiError } from "../../src/utils/errorHandler";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";
import { KeyboardAvoidingContainer } from "../../src/components/layout/KeyboardAvoidingContainer";
import { StyleSheet, Text, View } from "react-native";
import { Input } from "../../src/components/common/Input";
import { Button } from "../../src/components/common/Button";
import { COLORS } from "../../src/constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const { resetToken } = params;

  const { showSuccess, showError } = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors = { newPassword: "", confirmPassword: "" };

    if (!newPassword) {
      newErrors.newPassword = "Please enter your new password"; // Dịch
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long"; // Dịch
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"; // Dịch
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Confirm password does not match"; // Dịch
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await authService.resetPassword(
        { newPassword, confirmPassword },
        resetToken as string
      );

      showSuccess(SUCCESS_MESSAGES.PASSWORD_RESET);
      router.replace("/(auth)/login");
    } catch (error) {
      showError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingContainer>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter a new password for your account
          </Text>
        </View>

        <View style={styles.content}>
          <Input
            label="New Password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            error={errors.newPassword}
            placeholder="Enter your new password"
            secureTextEntry={!showNewPassword}
            rightIcon={
              <Ionicons
                name={showNewPassword ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            }
            onRightIconPress={() => setShowNewPassword(!showNewPassword)}
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            error={errors.confirmPassword}
            placeholder="Re-enter your new password"
            secureTextEntry={!showConfirmPassword}
            rightIcon={
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            }
            onRightIconPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <Button
            title="Reset Password"
            onPress={handleResetPassword}
            loading={isLoading}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  eyeIcon: {
    fontSize: 20,
  },
  button: {
    marginTop: 24,
  },
});
