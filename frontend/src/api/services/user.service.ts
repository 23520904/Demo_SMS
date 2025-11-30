import { OTPResponse } from "../../types/api.types";
import { ChangePasswordData } from "../../types/auth.types";
import { UserProfile } from "../../types/user.types";
import { api } from "../client";
import { ENDPOINTS } from "../endpoints";

export const userService = {
  // Lấy profile
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>(ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  // Gửi OTP để đổi mật khẩu
  async sendChangePasswordOTP(): Promise<OTPResponse> {
    console.log("=== FRONTEND: SEND CHANGE PASSWORD OTP REQUEST ===");
    console.log("endpoint:", ENDPOINTS.USER.SEND_CHANGE_OTP);
    const response = await api.post<OTPResponse>(
      ENDPOINTS.USER.SEND_CHANGE_OTP
    );
    console.log("Response:", JSON.stringify(response.data, null, 2));
    console.log("===================================================");
    return response.data;
  },

  // Đổi mật khẩu
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    console.log("=== FRONTEND: CHANGE PASSWORD REQUEST ===");
    console.log("endpoint:", ENDPOINTS.USER.CHANGE_PASSWORD);
    console.log("Request data:", JSON.stringify({ ...data, newPassword: "***", confirmPassword: "***", otp: data.otp }, null, 2));
    const response = await api.post<{ message: string }>(
      ENDPOINTS.USER.CHANGE_PASSWORD,
      data
    );
    console.log("Response:", JSON.stringify(response.data, null, 2));
    console.log("=========================================");
    return response.data;
  },
};
