import { useCallback } from "react";
import { Alert } from "react-native";

export const useToast = () => {
  const showSuccess = useCallback((message: string) => {
    Alert.alert("Success", message, [{ text: "OK" }]);
  }, []);

  const showError = useCallback((message: string) => {
    Alert.alert("Error", message, [{ text: "OK" }]);
  }, []);

  const showInfo = useCallback((message: string) => {
    Alert.alert("Notification", message, [{ text: "OK" }]);
  }, []);

  const showConfirm = useCallback((message: string, onConfirm: () => void) => {
    Alert.alert("Confirm", message, [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: onConfirm },
    ]);
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showConfirm,
  };
};
