import { useCallback } from "react";
import { Alert } from "react-native";

export const useToast = () => {
  const showSuccess = useCallback((message: string) => {
    Alert.alert("Thành công", message, [{ text: "OK" }]);
  }, []);

  const showError = useCallback((message: string) => {
    Alert.alert("Lỗi", message, [{ text: "OK" }]);
  }, []);

  const showInfo = useCallback((message: string) => {
    Alert.alert("Thông báo", message, [{ text: "OK" }]);
  }, []);

  const showConfirm = useCallback((message: string, onConfirm: () => void) => {
    Alert.alert("Xác nhận", message, [
      { text: "Hủy", style: "cancel" },
      { text: "Đồng ý", onPress: onConfirm },
    ]);
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showConfirm,
  };
};
