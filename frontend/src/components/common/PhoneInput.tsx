import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { API_CONFIG } from "../../constants/config";
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
    const cleaned = text.replace(/\D/g, "");
    onChangeText(cleaned);
  };

  const displayValue = value.startsWith(API_CONFIG.COUNTRY_CODE)
    ? value.substring(API_CONFIG.COUNTRY_CODE.length)
    : value;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.phoneContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+{API_CONFIG.COUNTRY_CODE}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Input
            value={displayValue}
            onChangeText={handleChange}
            placeholder="901234567"
            keyboardType="phone-pad"
            maxLength={10}
            error={error}
            // 2. Bỏ prop 'style' khỏi component <Input>
          />
        </View>
      </View>
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
  phoneContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  countryCode: {
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  inputContainer: { flex: 1 },
});
