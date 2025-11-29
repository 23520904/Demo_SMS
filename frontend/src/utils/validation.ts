import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(1, "Please enter your phone number")
  .regex(/^0[0-9]{9}$/, "Phone number must be 10 digits starting with 0");

// Password validation
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long");

// OTP validation
export const otpSchema = z
  .string()
  .length(6, "OTP code must be 6 digits long")
  .regex(/^[0-9]{6}$/, "OTP code must only contain digits");

// Full name validation
export const fullNameSchema = z
  .string()
  .min(1, "Please enter your full name")
  .min(2, "Full name must be at least 2 characters long");

// Login schema
export const loginSchema = z.object({
  phoneNumber: phoneSchema,
  password: passwordSchema,
});

// Register schema
export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    otp: otpSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match",
    path: ["confirmPassword"],
  });

// Reset password schema
export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password does not match",
    path: ["confirmPassword"],
  });

// Change password schema
export const changePasswordSchema = z
  .object({
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password does not match",
    path: ["confirmPassword"],
  });
