import { User } from "./auth.types";

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}
export interface OTPResponse {
  message: string;
}
export interface ResetTokenResponse {
  message: string;
  resetToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}