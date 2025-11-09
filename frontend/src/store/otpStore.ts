import { create } from "zustand";
import { OTPType } from "../types/auth.types";
import { authService } from "../api/services/auth.service";
import { userService } from "../api/services/user.service";

interface OTPState {
  // State
  phoneNumber: string | null;
  resetToken: string | null;
  countdown: number;
  isCountingDown: boolean;
  canResend: boolean;

  // Actions
  setPhoneNumber: (phone: string) => void;
  setResetToken: (token: string | null) => void;
  sendOTP: (phoneNumber: string, type: OTPType) => Promise<void>;
  sendChangePasswordOTP: () => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<string>;
  startCountdown: () => void;
  resetCountdown: () => void;
  clear: () => void;
}

export const useOTPStore = create<OTPState>((set, get) => ({
  // Initial state
  phoneNumber: null,
  resetToken: null,
  countdown: 0,
  isCountingDown: false,
  canResend: true,

  // Set phone number
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),

  // Set reset token
  setResetToken: (token) => set({ resetToken: token }),

  // Send OTP
  sendOTP: async (phoneNumber, type) => {
    try {
      await authService.sendOTP({ phoneNumber, type });
      
      get().setPhoneNumber(phoneNumber);
      get().startCountdown();
    } catch (error) {
      throw error;
    }
  },

  // Send change password OTP
  sendChangePasswordOTP: async () => {
    try {
      await userService.sendChangePasswordOTP();
      get().startCountdown();
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP (for reset password flow)
  verifyOTP: async (phoneNumber, otp) => {
    try {
      const response = await authService.verifyOTP({ phoneNumber, otp });
      get().setResetToken(response.resetToken);
      return response.resetToken;
    } catch (error) {
      throw error;
    }
  },

  // Start countdown timer
  startCountdown: () => {
    set({ countdown: 60, isCountingDown: true, canResend: false });

    const interval = setInterval(() => {
      const currentCountdown = get().countdown;

      if (currentCountdown <= 1) {
        clearInterval(interval);
        set({ countdown: 0, isCountingDown: false, canResend: true });
      } else {
        set({ countdown: currentCountdown - 1 });
      }
    }, 1000);
  },

  // Reset countdown
  resetCountdown: () => {
    set({ countdown: 0, isCountingDown: false, canResend: true });
  },

  // Clear store
  clear: () => {
    set({
      phoneNumber: null,
      resetToken: null,
      countdown: 0,
      isCountingDown: false,
      canResend: true,
    });
  },
}));
