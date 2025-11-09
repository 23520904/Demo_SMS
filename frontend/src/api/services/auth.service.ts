import { API_CONFIG } from "../../constants/config";
import {
  AuthResponse,
  OTPResponse,
  RefreshTokenResponse,
  ResetTokenResponse,
} from "../../types/api.types";
import {
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  SendOTPData,
  VerifyOTPData,
} from "../../types/auth.types";
import { api, apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";

export const authService = {
  // Gửi OTP
  async sendOTP(data: SendOTPData): Promise<OTPResponse> {
    console.log("endpoint:", ENDPOINTS.AUTH.SEND_OTP);
    console.log("Base URL:", API_CONFIG.BASE_URL);
    const response = await api.post<OTPResponse>(ENDPOINTS.AUTH.SEND_OTP, data);

    return response.data;
  },

  // Verify OTP (cho reset password)
  async verifyOTP(data: VerifyOTPData): Promise<ResetTokenResponse> {
    const response = await api.post<ResetTokenResponse>(
      ENDPOINTS.AUTH.VERIFY_OTP,
      data
    );
    return response.data;
  },

  // Đăng ký
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  // Đăng nhập
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  // Reset password (dùng reset token)
  async resetPassword(
    data: ResetPasswordData,
    resetToken: string
  ): Promise<{ message: string }> {
    const response = await apiClient.requestWithToken(
      "POST",
      ENDPOINTS.AUTH.RESET_PASSWORD,
      resetToken,
      data
    );
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(
      ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    );
    return response.data;
  },
};
