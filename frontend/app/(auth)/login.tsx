import { useState } from "react";
import { useAuth } from "../../src/hooks/useAuth";
import { useForm } from "../../src/hooks/useForm";
import { useToast } from "../../src/hooks/useToast";
import { loginSchema } from "../../src/utils/validation";
import { formatPhoneNumber } from "../../src/utils/formatPhone";
import { SUCCESS_MESSAGES } from "../../src/constants/messages";
import { handleApiError } from "../../src/utils/errorHandler";
import { SafeAreaContainer } from "../../src/components/layout/SafeAreaContainer";
import { KeyboardAvoidingContainer } from "../../src/components/layout/KeyboardAvoidingContainer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PhoneInput } from "../../src/components/common/PhoneInput";
import { Input } from "../../src/components/common/Input";
import { Button } from "../../src/components/common/Button";
import { Link, router } from "expo-router"; // Import 'router'
import { COLORS } from "../../src/constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: {
      phoneNumber: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (data) => {
      try {
        const formattedPhone = formatPhoneNumber(data.phoneNumber);
        await login(formattedPhone, data.password);
        showSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      } catch (error) {
        showError(handleApiError(error));
      }
    },
  });

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingContainer>
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>
            Welcome back! Please login to continue.
          </Text>
        </View>

        <View style={styles.form}>
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

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Register now</Text>
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
  form: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
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
    marginTop: 40,
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
