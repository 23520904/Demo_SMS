import { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOTP } from "../../src/hooks/useOTP";
import { useToast } from "../../src/hooks/useToast";
import { SUCCESS_MESSAGES } from "../../src/constants/messages";
import { handleApiError } from "../../src/utils/errorHandler";
import { userService } from "../../src/api/services/user.service";
import { router } from "expo-router";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";
import { KeyboardAvoidingContainer } from "../../src/components/layout/KeyboardAvoidingContainer";
import { Button } from "../../src/components/common/Button";
import { OTPInput } from "../../src/components/common/OTPInput";
import { Input } from "../../src/components/common/Input";
import { COLORS } from "../../src/constants/colors";
import { isAxiosError } from "axios";

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
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
              {step === "send-otp"
                ? "Send an OTP code to confirm your password change"
                : "Enter the OTP code and your new password"}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {step === "send-otp" ? (
            <>
              <View style={styles.infoBox}>
                <View style={styles.infoBoxHeader}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons
                      name="phone-portrait-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.infoBoxContent}>
                    <Text style={styles.infoTitle}>OTP Verification</Text>
                    <Text style={styles.infoText}>
                      An OTP code will be sent to your registered phone number
                      to verify your identity
                    </Text>
                  </View>
                </View>
              </View>

              <Button
                title="Send OTP Code"
                onPress={handleSendOTP}
                loading={isLoading}
                style={styles.button}
              />
            </>
          ) : (
            <>
              <View style={styles.stepIndicator}>
                <View style={styles.stepIndicatorItem}>
                  <View style={[styles.stepDot, styles.stepDotCompleted]}>
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  </View>
                  <Text style={styles.stepText}>OTP Sent</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.stepIndicatorItem}>
                  <View style={[styles.stepDot, styles.stepDotActive]}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <Text style={[styles.stepText, styles.stepTextActive]}>
                    Change Password
                  </Text>
                </View>
              </View>

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

              <View style={styles.passwordSection}>
                <Text style={styles.sectionTitle}>New Password</Text>
                <Input
                  label="New Password"
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setErrors((prev) => ({ ...prev, newPassword: "" }));
                  }}
                  error={errors.newPassword}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  rightIcon={
                    <Ionicons
                      name={showNewPassword ? "eye" : "eye-off"}
                      size={24}
                      color={COLORS.textSecondary}
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
                  placeholder="Re-enter new password"
                  secureTextEntry={!showConfirmPassword}
                  rightIcon={
                    <Ionicons
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={24}
                      color={COLORS.textSecondary}
                    />
                  }
                  onRightIconPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
              </View>

              <Button
                title="Change Password"
                onPress={handleChangePassword}
                loading={isLoading}
                disabled={otp.length !== 6}
                style={styles.button}
              />
            </>
          )}

          {step === "verify" && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep("send-otp")}
            >
              <Ionicons
                name="arrow-back-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.backButtonText}>Back to Send OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoBoxHeader: {
    flexDirection: "row",
    gap: 16,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBoxContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  stepIndicatorItem: {
    alignItems: "center",
    gap: 8,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotCompleted: {
    backgroundColor: COLORS.success,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  stepText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  stepTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  passwordSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
