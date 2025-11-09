import { useState } from "react";
import { useOTPStore } from "../store/otpStore";
import { OTPType } from "../types/auth.types";

export const useOTP = () => {
  const {
    phoneNumber,
    resetToken,
    countdown,
    isCountingDown,
    canResend,
    sendOTP,
    sendChangePasswordOTP,
    verifyOTP,
    setPhoneNumber,
    clear,
    setResetToken,
  } = useOTPStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (phone: string, type: OTPType) => {
    try {
      
      setIsLoading(true);
      
      await sendOTP(phone, type);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChangePasswordOTP = async () => {
    try {
      setIsLoading(true);
      await sendChangePasswordOTP();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (phone: string, otp: string) => {
    try {
      setIsLoading(true);
      const token = await verifyOTP(phone, otp);
      return token;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    phoneNumber,
    resetToken,
    countdown,
    isCountingDown,
    canResend,
    isLoading,
    sendOTP: handleSendOTP,
    sendChangePasswordOTP: handleSendChangePasswordOTP,
    verifyOTP: handleVerifyOTP,
    setPhoneNumber,
    setResetToken,
    clear,
  };
};
