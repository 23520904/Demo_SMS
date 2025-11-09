import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Ionicons } from "@expo/vector-icons";
interface PasswordFormProps {
  onSubmit: (data: {
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  loading?: boolean;
  submitButtonText?: string;
  showCurrentPassword?: boolean;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  onSubmit,
  loading = false,
  submitButtonText = "Confirm", // Dịch: Xác nhận
  showCurrentPassword = false,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validate = (): boolean => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    if (showCurrentPassword && !currentPassword) {
      newErrors.currentPassword = "Please enter your current password"; // Dịch
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
    if (showCurrentPassword && currentPassword === newPassword) {
      newErrors.newPassword =
        "New password must be different from the old password"; // Dịch
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onSubmit({
        newPassword,
        confirmPassword,
      });
      // Reset form on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      // Error is handled in the parent component
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      {showCurrentPassword && (
        <Input
          label="Current Password" // Dịch
          value={currentPassword}
          onChangeText={(text) => {
            setCurrentPassword(text);
            setErrors((prev) => ({ ...prev, currentPassword: "" }));
          }}
          error={errors.currentPassword}
          placeholder="Enter your current password" // Dịch
          secureTextEntry={!showCurrent}
          rightIcon={
            <Ionicons
              name={showCurrent ? "eye" : "eye-off"}
              size={24}
              color="gray"
            />
          }
          onRightIconPress={() => setShowCurrent(!showCurrent)}
        />
      )}
      <Input
        label="New Password" // Dịch
        value={newPassword}
        onChangeText={(text) => {
          setNewPassword(text);
          setErrors((prev) => ({ ...prev, newPassword: "" }));
        }}
        error={errors.newPassword}
        placeholder="Enter your new password" // Dịch
        secureTextEntry={!showNew}
        rightIcon={
          <Ionicons name={showNew ? "eye" : "eye-off"} size={24} color="gray" />
        }
        onRightIconPress={() => setShowNew(!showNew)}
      />
      <Input
        label="Confirm Password" // Dịch
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }}
        error={errors.confirmPassword}
        placeholder="Re-enter your new password" // Dịch
        secureTextEntry={!showConfirm}
        rightIcon={
          <Text style={styles.eyeIcon}>
            {
              <Ionicons
                name={showConfirm ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            }
          </Text>
        }
        onRightIconPress={() => setShowConfirm(!showConfirm)}
      />
      <Button
        title={submitButtonText}
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
  eyeIcon: {
    fontSize: 20,
  },
  button: {
    marginTop: 24,
  },
});
