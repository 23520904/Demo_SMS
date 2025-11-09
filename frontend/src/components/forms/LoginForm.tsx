import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useForm } from "../../hooks/useForm";
import { loginSchema } from "../../utils/validation";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { SUCCESS_MESSAGES } from "../../constants/messages";
import { handleApiError } from "../../utils/errorHandler";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PhoneInput } from "../common/PhoneInput";
import { Input } from "../common/Input";
import { router } from "expo-router";
import { Button } from "../common/Button";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

export const LoginForm: React.FC = () => {
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
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
});
