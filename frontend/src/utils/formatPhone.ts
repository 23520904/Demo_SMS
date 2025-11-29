import { API_CONFIG } from "../constants/config";

export const formatPhoneNumber = (phone: string): string => {
  // Loại bỏ tất cả ký tự không phải số
  const cleaned = phone.replace(/\D/g, "");

  // Format: 0912345678 => 84912345678
  // Thay số 0 đầu tiên bằng 84
  if (cleaned.startsWith("0")) {
    return API_CONFIG.COUNTRY_CODE + cleaned.substring(1);
  }

  // Nếu đã có 84 ở đầu (từ database hoặc đã format), giữ nguyên
  if (cleaned.startsWith("84")) {
    return cleaned;
  }

  // Nếu không bắt đầu bằng 0, thêm 84 vào đầu
  // (trường hợp người dùng nhập thiếu số 0)
  return API_CONFIG.COUNTRY_CODE + cleaned;
};

export const displayPhoneNumber = (phone: string): string => {
  // Format: 84901234567 -> 0901 234 567
  if (phone.startsWith("84")) {
    const localNumber = "0" + phone.substring(2);
    return localNumber.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  return phone;
};

export const validatePhoneFormat = (phone: string): boolean => {
  // Validate định dạng 0912345678 (10 số, bắt đầu bằng 0)
  const cleaned = phone.replace(/\D/g, "");
  return /^0[0-9]{9}$/.test(cleaned);
};
