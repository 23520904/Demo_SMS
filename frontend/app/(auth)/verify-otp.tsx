import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../src/constants/colors";
import { Button } from "../../src/components/common/Button";
import { OTPInput } from "../../src/components/common/OTPInput";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";
import { useOTP } from "../../src/hooks/useOTP";
import { useToast } from "../../src/hooks/useToast";
import { useState } from "react";
import { SUCCESS_MESSAGES } from "../../src/constants/messages";
import { handleApiError } from "../../src/utils/errorHandler";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";
import { KeyboardAvoidingContainer } from "../../src/components/layout/KeyboardAvoidingContainer";
import { displayPhoneNumber } from "../../src/utils/formatPhone";
import { useAuth } from "../../src/hooks/useAuth";
export default function VerifyOTPScreen() {
  const params = useLocalSearchParams();
  const { fullName, phoneNumber, password, confirmPassword } = params;

  // Sử dụng register trực tiếp từ authStore thay vì useAuth để kiểm soát navigation
  const { register } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false); // <-- THÊM MỚI: State loading cho nút Verify
  const { sendOTP, countdown, canResend, isLoading } = useOTP();
  const { showSuccess, showError } = useToast();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
    null
  );

  const MAX_ATTEMPTS = 5; // Số lần thử tối đa (đã được config trong backend)

  const handleResendOTP = async () => {
    try {
      setOtp(""); // Xóa OTP cũ
      setError(""); // Xóa lỗi
      setRemainingAttempts(null); // Reset số lần thử
      await sendOTP(phoneNumber as string, "register");
      showSuccess(SUCCESS_MESSAGES.OTP_SENT);
    } catch (err) {
      showError(handleApiError(err));
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("OTP code must be 6 digits long");
      return;
    }
    setIsVerifying(true);
    setError("");

    try {
      await register({
        fullName: fullName as string,
        phoneNumber: phoneNumber as string,
        password: password as string,
        confirmPassword: confirmPassword as string,
        otp,
      });
      // Nếu register thành công, chuyển về tabs
      showSuccess(SUCCESS_MESSAGES.REGISTER_SUCCESS);
      router.replace("/(tabs)");
    } catch (err: any) {
      // Lấy message trực tiếp từ backend response
      const backendMessage = err?.response?.data?.message || "";
      const errorMessage = handleApiError(err);
      const statusCode = err?.response?.status;

      // Debug: Log để kiểm tra (có thể xóa sau)
      console.log("Register error:", {
        backendMessage,
        errorMessage,
        status: statusCode,
        fullError: err,
      });

      // Kiểm tra chính xác message từ backend (ưu tiên message từ response)
      const messageToCheck = (backendMessage || errorMessage).toLowerCase();

      // CHỈ chuyển về login khi backend thực sự trả về "too many failed attempts"
      // Backend trả về: "Invalid OTP. Too many failed attempts." khi đã hết số lần thử
      const isTooManyAttempts = messageToCheck.includes(
        "too many failed attempts"
      );

      if (isTooManyAttempts) {
        // Chỉ khi thực sự hết số lần thử mới chuyển về login
        const redirectMessage =
          "Too many failed attempts. Redirecting to login...";
        setError(redirectMessage);
        showError(redirectMessage);
        // Chuyển về màn hình login sau 2 giây
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 2000);
        return;
      }

      // Nếu là lỗi OTP không hợp lệ (nhưng chưa hết số lần thử)
      // Backend trả về: "Invalid OTP." khi còn số lần thử
      const isInvalidOtp =
        messageToCheck.includes("invalid otp") && !isTooManyAttempts;

      if (isInvalidOtp) {
        // Tính số lần thử còn lại
        const currentAttempts =
          remainingAttempts !== null ? remainingAttempts : MAX_ATTEMPTS;
        const newAttempts = currentAttempts - 1;
        const attemptsLeft = newAttempts > 0 ? newAttempts : 0;

        // Cập nhật state
        setRemainingAttempts(attemptsLeft);

        // Hiển thị thông báo
        if (attemptsLeft > 0) {
          const message = `Invalid OTP code. ${attemptsLeft} attempt(s) remaining. Please try again.`;
          setError(message);
          showError(message);
        } else {
          const message = "Invalid OTP code. No attempts remaining.";
          setError(message);
          showError(message);
        }

        setOtp(""); // Tự động xóa OTP cũ để người dùng nhập lại
        // KHÔNG chuyển về login ở đây - chỉ khi backend báo "too many failed attempts"
      } else {
        // Các lỗi khác (OTP expired, không tìm thấy OTP, validation errors, etc.)
        setError(errorMessage);
        showError(errorMessage);
        // KHÔNG chuyển về login cho các lỗi khác
      }
    } finally {
      setIsVerifying(false);
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

          {remainingAttempts !== null && remainingAttempts > 0 && (
            <Text style={styles.attemptsText}>
              {remainingAttempts} attempt(s) remaining
            </Text>
          )}

          <Button
            title="Verify"
            onPress={handleVerify}
            loading={isVerifying || isLoading}
            disabled={otp.length !== 6 || remainingAttempts === 0}
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
  attemptsText: {
    fontSize: 14,
    color: COLORS.warning,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
});
