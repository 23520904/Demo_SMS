import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { OTPInput } from "../common/OTPInput";
import { Button } from "../common/Button";
import { COLORS } from "../../constants/colors";

interface OTPVerificationFormProps {
  phoneNumber: string;
  countdown?: number;
  canResend?: boolean;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  loading?: boolean;
  title?: string;
  description?: string;
}

export const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
  phoneNumber,
  countdown = 0,
  canResend = false,
  onVerify,
  onResend,
  loading = false,
  title = "OTP Verification", // Dịch: Xác thực OTP
  description,
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("OTP code must be 6 digits long"); // Dịch
      return;
    }
    try {
      setError("");
      await onVerify(otp);
    } catch (err) {
      setError("Invalid OTP code"); // Dịch
      throw err;
    }
  };

  const handleResend = async () => {
    try {
      setOtp("");
      setError("");
      await onResend();
    } catch (err) {
      // Error is handled in the parent component
      throw err;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </View>

      <OTPInput
        value={otp}
        onChangeText={(text) => {
          setOtp(text);
          setError("");
        }}
        error={error}
        countdown={countdown}
        onResend={handleResend}
        canResend={canResend}
      />

      <Button
        title="Verify" // Dịch: Xác nhận
        onPress={handleVerify}
        loading={loading}
        disabled={otp.length !== 6}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  button: {
    marginTop: 24,
  },
});
