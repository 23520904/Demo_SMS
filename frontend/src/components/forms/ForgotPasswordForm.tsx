import { useState } from "react";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { StyleSheet, View } from "react-native";
import { PhoneInput } from "../common/PhoneInput";
import { Button } from "../common/Button";

interface ForgotPasswordFormProps {
  onSubmit: (phoneNumber: string) => Promise<void>;
  loading?: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const validate = (): boolean => {
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number"); // Dịch
      return false;
    }
    const formatted = formatPhoneNumber(phoneNumber);
    if (!/^84[0-9]{9,10}$/.test(formatted)) {
      setError("Invalid phone number"); // Dịch
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      await onSubmit(formattedPhone);
    } catch (err) {
      throw err;
    }
  };

  return (
    <View style={styles.container}>
      <PhoneInput
        value={phoneNumber}
        onChangeText={(text) => {
          setPhoneNumber(text);
          setError("");
        }}
        error={error}
      />
      <Button
        title="Send OTP Code" // Dịch: Gửi mã OTP
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    marginTop: 24,
  },
});
