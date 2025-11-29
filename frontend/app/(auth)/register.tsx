import { useState } from "react";
import { useOTP } from "../../src/hooks/useOTP";
import { useToast } from "../../src/hooks/useToast";
import { formatPhoneNumber } from "../../src/utils/formatPhone";
import { SUCCESS_MESSAGES } from "../../src/constants/messages";
import { Link, router } from "expo-router";
import { handleApiError } from "../../src/utils/errorHandler";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";
import { KeyboardAvoidingContainer } from "../../src/components/layout/KeyboardAvoidingContainer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../../src/components/common/Input";
import { PhoneInput } from "../../src/components/common/PhoneInput";
import { Button } from "../../src/components/common/Button";
import { COLORS } from "../../src/constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const { sendOTP, isLoading, setPhoneNumber } = useOTP();
  const { showSuccess, showError } = useToast();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors = {
      fullName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    };

    if (!fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your phone number";
    } else {
      // Validate định dạng 0912345678 (10 số, bắt đầu bằng 0)
      if (!/^0[0-9]{9}$/.test(phoneNumber)) {
        newErrors.phoneNumber =
          "Phone number must be 10 digits starting with 0";
      }
    }

    if (!password) {
      newErrors.password = "Please enter your password";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Confirm password does not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleContinue = async () => {
    if (!validate()) return;

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      await sendOTP(formattedPhone, "register");
      setPhoneNumber(formattedPhone);

      showSuccess(SUCCESS_MESSAGES.OTP_SENT);

      // Navigate to OTP screen with data
      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          fullName,
          phoneNumber: formattedPhone,
          password,
          confirmPassword,
        },
      });
    } catch (error) {
      showError(handleApiError(error));
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingContainer>
        <View style={styles.header}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>
            Create a new account to start using the service.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setErrors((prev) => ({ ...prev, fullName: "" }));
            }}
            error={errors.fullName}
            placeholder="John Doe"
            autoCapitalize="words"
          />

          <PhoneInput
            value={phoneNumber}
            onChangeText={(text) => {
              setPhone(text);
              setErrors((prev) => ({ ...prev, phoneNumber: "" }));
            }}
            error={errors.phoneNumber}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
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
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
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
            onRightIconPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    marginBottom: 32,
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
  form: {
    marginBottom: 24,
  },
  eyeIcon: {
    fontSize: 20,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
