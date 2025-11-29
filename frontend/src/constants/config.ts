export const API_CONFIG = {
  BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.9:5000/api",
  TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,
  COUNTRY_CODE: "84",
};
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: "app.access_token", // ĐÃ SỬA
  REFRESH_TOKEN_KEY: "app.refresh_token", // ĐÃ SỬA
  USER_KEY: "app.user_data", // ĐÃ SỬA
  ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
  RESET_TOKEN_EXPIRY: 5 * 60 * 1000, // 5 minutes
};
export const OTP_CONFIG = {
  LENGTH: 6,
  TIMEOUT: 60, // seconds
  RESEND_DELAY: 60, // seconds
};
