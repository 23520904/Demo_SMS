import { API_CONFIG } from "../constants/config";

export const formatPhoneNumber = (phone: string): string => {
  // Loại bỏ tất cả ký tự không phải số
  const cleaned = phone.replace(/\D/g, "");

  // Nếu bắt đầu bằng 0, thay bằng 84
  if (cleaned.startsWith("0")) {
    return API_CONFIG.COUNTRY_CODE + cleaned.substring(1);
  }

  // Nếu bắt đầu bằng +84, loại bỏ +
  if (cleaned.startsWith("84")) {
    return cleaned;
  }

  // Nếu không có mã quốc gia, thêm vào
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
  const cleaned = phone.replace(/\D/g, "");
  return /^84[0-9]{9,10}$/.test(cleaned);
};
