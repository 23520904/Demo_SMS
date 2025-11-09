export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export interface SendOTPData {
  phoneNumber: string;
  type: "register" | "reset" | "change";
}

export interface VerifyOTPData {
  phoneNumber: string;
  otp: string;
}

export interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}
export type OTPType = "register" | "reset" | "change";