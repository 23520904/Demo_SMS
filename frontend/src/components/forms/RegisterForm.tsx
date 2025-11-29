import { useState } from "react";
import { useOTP } from "../../hooks/useOTP";
import { useToast } from "../../hooks/useToast";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { SUCCESS_MESSAGES } from "../../constants/messages";
import { router } from "expo-router";
import { handleApiError } from "../../utils/errorHandler";
import { StyleSheet, View } from "react-native";
import { Input } from "../common/Input";
import { PhoneInput } from "../common/PhoneInput";
import { Button } from "../common/Button";
import { Ionicons } from "@expo/vector-icons";

interface RegisterFormData {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const { sendOTP, isLoading, setPhoneNumber } = useOTP();
  const { showSuccess, showError } = useToast();

  const [values, setValues] = useState<RegisterFormData>({
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!values.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    } else if (values.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters long";
    }

    if (!values.phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your phone number";
    } else {
      // Validate định dạng 0912345678 (10 số, bắt đầu bằng 0)
      if (!/^0[0-9]{9}$/.test(values.phoneNumber)) {
        newErrors.phoneNumber =
          "Phone number must be 10 digits starting with 0";
      }
    }

    if (!values.password) {
      newErrors.password = "Please enter your password";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Confirm password does not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    try {
      const formattedPhone = formatPhoneNumber(values.phoneNumber);
      await sendOTP(formattedPhone, "register");
      setPhoneNumber(formattedPhone);

      showSuccess(SUCCESS_MESSAGES.OTP_SENT);

      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          fullName: values.fullName,
          phoneNumber: formattedPhone,
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
      });
    } catch (error) {
      showError(handleApiError(error));
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Full Name"
        value={values.fullName}
        onChangeText={(text) => handleChange("fullName", text)}
        error={errors.fullName}
        placeholder="John Doe"
        autoCapitalize="words"
      />

      <PhoneInput
        value={values.phoneNumber}
        onChangeText={(text) => handleChange("phoneNumber", text)}
        error={errors.phoneNumber}
      />

      <Input
        label="Password"
        value={values.password}
        onChangeText={(text) => handleChange("password", text)}
        error={errors.password}
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
        rightIcon={
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        }
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      <Input
        label="Confirm Password"
        value={values.confirmPassword}
        onChangeText={(text) => handleChange("confirmPassword", text)}
        error={errors.confirmPassword}
        placeholder="Re-enter your password"
        secureTextEntry={!showConfirmPassword}
        rightIcon={
          <Ionicons
            name={showConfirmPassword ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        }
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <Button
        title="Continue"
        onPress={handleContinue}
        loading={isLoading}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  eyeIcon: {
    fontSize: 20,
  },
  button: {
    marginTop: 8,
  },
});
