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
    const response = await api.post<OTPResponse>(
      ENDPOINTS.USER.SEND_CHANGE_OTP
    );
    return response.data;
  },

  // Đổi mật khẩu
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      ENDPOINTS.USER.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },
};
