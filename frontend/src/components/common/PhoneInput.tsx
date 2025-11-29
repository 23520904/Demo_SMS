import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { Input } from "./Input";

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
}
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  error,
  label = "Phone Number",
}) => {
  const handleChange = (text: string) => {
    // Chỉ cho phép nhập số
    let cleaned = text.replace(/\D/g, "");

    // Nếu người dùng nhập số đầu tiên không phải 0, bỏ qua
    if (cleaned.length === 1 && cleaned[0] !== "0") {
      // Không cho phép số đầu tiên khác 0
      return;
    }

    // Nếu số đầu tiên đã là 0, cho phép tiếp tục nhập
    if (cleaned.length > 0 && cleaned[0] === "0") {
      // Giới hạn 10 số
      if (cleaned.length > 10) {
        cleaned = cleaned.substring(0, 10);
      }
      onChangeText(cleaned);
    } else if (cleaned.length === 0) {
      // Cho phép xóa hết
      onChangeText("");
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Input
        value={value}
        onChangeText={handleChange}
        placeholder="0912345678"
        keyboardType="phone-pad"
        maxLength={10}
        error={error}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
});
