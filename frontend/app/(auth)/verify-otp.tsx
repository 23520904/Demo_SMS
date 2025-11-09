import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../src/constants/colors";
import { Button } from "../../src/components/common/Button";
import { OTPInput } from "../../src/components/common/OTPInput";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { useOTP } from "../../src/hooks/useOTP";
import { useToast } from "../../src/hooks/useToast";
import { useState } from "react";
import { SUCCESS_MESSAGES } from "../../src/constants/messages";
import { handleApiError } from "../../src/utils/errorHandler";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";
import { KeyboardAvoidingContainer } from "../../src/components/layout/KeyboardAvoidingContainer";
import { displayPhoneNumber } from "../../src/utils/formatPhone";

export default function VerifyOTPScreen() {
  const params = useLocalSearchParams();
  const { fullName, phoneNumber, password, confirmPassword } = params;

  const { register } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false); // <-- THÊM MỚI: State loading cho nút Verify
  const { sendOTP, countdown, canResend, isLoading } = useOTP();
  const { showSuccess, showError } = useToast();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleResendOTP = async () => {
    try {
      await sendOTP(phoneNumber as string, "register");
      showSuccess(SUCCESS_MESSAGES.OTP_SENT);
    } catch (err) {
      showError(handleApiError(err));
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("OTP code must be 6 digits long"); // Dịch

      return;
    }
    setIsVerifying(true); // <-- THÊM MỚI: Bắt đầu loading
    setError(""); // Xóa lỗi cũ
    try {
      await register({
        fullName: fullName as string,
        phoneNumber: phoneNumber as string,
        password: password as string,
        confirmPassword: confirmPassword as string,
        otp,
      });
      showSuccess(SUCCESS_MESSAGES.REGISTER_SUCCESS);
    } catch (err) {
      showError(handleApiError(err));
      setError("Invalid OTP code. Please try again"); // Dịch

      setOtp(""); // <-- THÊM MỚI: Tự động xóa OTP cũ để người dùng nhập lại
    } finally {
      setIsVerifying(false); // <-- THÊM MỚI: Dừng loading (dù thành công hay thất bại)
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingContainer>
        <View style={styles.header}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>
            A verification code has been sent to the phone number{"\n"}
            <Text style={styles.phone}>
              {displayPhoneNumber(phoneNumber as string)}
            </Text>
          </Text>
        </View>

        <View style={styles.content}>
          <OTPInput
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              setError("");
            }}
            error={error}
            countdown={countdown}
            onResend={handleResendOTP}
            canResend={canResend}
          />

          <Button
            title="Verify"
            onPress={handleVerify}
            loading={isLoading}
            disabled={otp.length !== 6}
            style={styles.button}
          />

          <Button
            title="Go Back"
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  phone: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  content: {},
  button: {
    marginTop: 24,
  },
  backButton: {
    marginTop: 12,
  },
});
