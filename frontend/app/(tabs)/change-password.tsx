import { useState } from "react";
import { useOTP } from "../../src/hooks/useOTP";
import { useToast } from "../../src/hooks/useToast";
import { SUCCESS_MESSAGES } from "../../src/constants/messages";
import { handleApiError } from "../../src/utils/errorHandler";
import { userService } from "../../src/api/services/user.service";
import { router } from "expo-router";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";
import { KeyboardAvoidingContainer } from "../../src/components/layout/KeyboardAvoidingContainer";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { Button } from "../../src/components/common/Button";
import { OTPInput } from "../../src/components/common/OTPInput";
import { Input } from "../../src/components/common/Input";
import { COLORS } from "../../src/constants/colors";
import { isAxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function ChangePasswordScreen() {
  const { countdown, canResend, sendChangePasswordOTP } = useOTP();
  const { showSuccess, showError } = useToast();

  const [step, setStep] = useState<"send-otp" | "verify">("send-otp");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      await sendChangePasswordOTP();
      setStep("verify");
      showSuccess(SUCCESS_MESSAGES.OTP_SENT);
    } catch (error) {
      showError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendChangePasswordOTP();
      showSuccess(SUCCESS_MESSAGES.OTP_SENT);
    } catch (error) {
      showError(handleApiError(error));
    }
  };

  const validate = () => {
    const newErrors = { otp: "", newPassword: "", confirmPassword: "" };

    if (otp.length !== 6) {
      newErrors.otp = "OTP code must be 6 digits long"; // Dịch
    }

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

  const handleChangePassword = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await userService.changePassword({
        otp,
        newPassword,
        confirmPassword,
      });

      showSuccess(SUCCESS_MESSAGES.PASSWORD_CHANGED);
      router.back();
    } catch (error) {
      showError(handleApiError(error));
      if (isAxiosError(error)) {
        if (error.response?.status === 400) {
          setErrors((prev) => ({ ...prev, otp: "Invalid OTP code" })); // Dịch
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingContainer>
        <View style={styles.header}>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>
            {step === "send-otp"
              ? "Send an OTP code to confirm your password change" // Dịch
              : "Enter the OTP code and your new password"}
          </Text>
        </View>

        <View style={styles.content}>
          {step === "send-otp" ? (
            <>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  📱 An OTP code will be sent to your phone number
                </Text>
              </View>

              <Button
                title="Send OTP Code" // Dịch
                onPress={handleSendOTP}
                loading={isLoading}
                style={styles.button}
              />
            </>
          ) : (
            <>
              <OTPInput
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  setErrors((prev) => ({ ...prev, otp: "" }));
                }}
                error={errors.otp}
                countdown={countdown}
                onResend={handleResendOTP}
                canResend={canResend}
              />

              <Input
                label="New Password" // Dịch
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
                error={errors.newPassword}
                placeholder="Enter new password" // Dịch
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
                label="Confirm Password" // Dịch
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                error={errors.confirmPassword}
                placeholder="Re-enter new password" // Dịch
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
                title="Change Password" // Dịch
                onPress={handleChangePassword}
                loading={isLoading}
                disabled={otp.length !== 6}
                style={styles.button}
              />
            </>
          )}

          <Button
            title="Go Back" // Dịch
            variant="outline"
            onPress={() => router.back()}
            style={styles.backButton}
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
  infoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  eyeIcon: {
    // Kiểu này không còn được sử dụng vì đã thay bằng Ionicons
    fontSize: 20,
  },
  button: {
    marginTop: 24,
  },
  backButton: {
    marginTop: 12,
  },
});
