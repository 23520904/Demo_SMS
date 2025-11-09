import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaContainer } from "@components/layout/SafeAreaContainer";
import { KeyboardAvoidingContainer } from "@components/layout/KeyboardAvoidingContainer";
import { PhoneInput } from "@components/common/PhoneInput";
import { OTPInput } from "@components/common/OTPInput";
import { Button } from "@components/common/Button";
import { useOTP } from "@hooks/useOTP";
import { useToast } from "@hooks/useToast";
import { formatPhoneNumber } from "@utils/formatPhone";
import { handleApiError } from "@utils/errorHandler";
import { COLORS } from "@constants/colors";
import { SUCCESS_MESSAGES } from "@constants/messages";

export default function ForgotPasswordScreen() {
  const { sendOTP, verifyOTP, countdown, canResend, isLoading } = useOTP();
  const { showSuccess, showError } = useToast();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({ phoneNumber: "", otp: "" });

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Please enter your phone number", // Dịch
      }));
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log("Phone: ", formattedPhone);
      await sendOTP(formattedPhone, "reset");
      setStep("otp");
      showSuccess(SUCCESS_MESSAGES.OTP_SENT);
    } catch (error) {
      showError(handleApiError(error));
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "OTP code must be 6 digits long" })); // Dịch
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const resetToken = await verifyOTP(formattedPhone, otp);

      showSuccess(SUCCESS_MESSAGES.OTP_VERIFIED);

      // Navigate to reset password with token
      router.push({
        pathname: "/(auth)/reset-password",
        params: { resetToken },
      });
    } catch (error) {
      showError(handleApiError(error));
      setErrors((prev) => ({ ...prev, otp: "Invalid OTP code" })); // Dịch
    }
  };

  const handleResendOTP = async () => {
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      await sendOTP(formattedPhone, "reset");
      showSuccess(SUCCESS_MESSAGES.OTP_SENT);
    } catch (error) {
      showError(handleApiError(error));
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingContainer>
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            {step === "phone"
              ? "Enter your phone number to receive an OTP verification code"
              : "Enter the OTP code sent to your phone number"}
          </Text>
        </View>

        <View style={styles.content}>
          {step === "phone" ? (
            <>
              <PhoneInput
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                }}
                error={errors.phoneNumber}
              />

              <Button
                title="Send OTP Code"
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

              <Button
                title="Verify"
                onPress={handleVerifyOTP}
                loading={isLoading}
                disabled={otp.length !== 6}
                style={styles.button}
              />
            </>
          )}

          <Button
            title="Go Back"
            variant="outline"
            onPress={() => (step === "otp" ? setStep("phone") : router.back())}
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
  button: {
    marginTop: 24,
  },
  backButton: {
    marginTop: 12,
  },
});
