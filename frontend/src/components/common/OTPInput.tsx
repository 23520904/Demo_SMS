import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { OTP_CONFIG } from "../../constants/config";
import { useEffect, useRef, useState } from "react";

interface OTPInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  countdown?: number;
  onResend?: () => void;
  canResend?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChangeText,
  error,
  countdown = 0,
  onResend,
  canResend = false,
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  useEffect(() => {
    // Khi prop 'error' CÓ NỘI DUNG (tức là parent vừa set lỗi)
    if (error) {
      // Tự động focus ô đầu tiên
      inputRefs.current[0]?.focus();
    }
  }, [error]);
  const handleChange = (text: string, index: number) => {
    // Chỉ cho phép nhập số
    const cleaned = text.replace(/\D/g, "");

    if (cleaned.length === 0) {
      // Xóa ký tự
      const newValue = value.split("");
      newValue[index] = "";
      onChangeText(newValue.join(""));

      // Focus input trước đó
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (cleaned.length === 1) {
      // Nhập 1 ký tự
      const newValue = value.split("");
      newValue[index] = cleaned;
      onChangeText(newValue.join(""));

      // Focus input tiếp theo
      if (index < OTP_CONFIG.LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (cleaned.length === OTP_CONFIG.LENGTH) {
      // Paste toàn bộ OTP
      onChangeText(cleaned);
      inputRefs.current[OTP_CONFIG.LENGTH - 1]?.blur();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        {Array.from({ length: OTP_CONFIG.LENGTH }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[
              styles.input,
              focusedIndex === index && styles.inputFocused,
              error && styles.inputError,
              value[index] && styles.inputFilled,
            ]}
            value={value[index] || ""}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {onResend && (
        <View style={styles.resendContainer}>
          {countdown > 0 ? (
            <Text style={styles.countdownText}>
              Resend code in {countdown}s
            </Text>
          ) : (
            <TouchableOpacity onPress={onResend} disabled={!canResend}>
              <Text
                style={[
                  styles.resendText,
                  !canResend && styles.resendTextDisabled,
                ]}
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  input: {
    width: 50,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: COLORS.text,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFF",
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFF",
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    textAlign: "center",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  countdownText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  resendTextDisabled: {
    color: COLORS.textSecondary,
  },
});
