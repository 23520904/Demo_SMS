// routes/auth.route.js
import express from "express";
import { authLimiter, otpLimiter } from "../utils/limiter.js";
import {
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  sendOtp,
  verifyResetOtp,
} from "../controllers/auth.controller.js";
import { authenticateResetToken } from "../middlewares/reset.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/send-otp
 * @desc    Gửi mã OTP qua Infobip
 */
router.post("/send-otp", otpLimiter, sendOtp);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    BƯỚC 2: Xác thực OTP, lấy Token Reset
 */
router.post("/verify-otp", authLimiter, verifyResetOtp);
/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký (xác thực bằng Infobip)
 */
router.post("/register", authLimiter, register);
/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset mật khẩu (xác thực bằng Infobip)
 */
router.post(
  "/reset-password",
  authenticateResetToken,
  authLimiter,
  resetPassword
);
/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập bằng Mật khẩu (Giữ nguyên)
 */
router.post("/login", authLimiter, login);
/**
 * @route   POST /api/auth/refresh-token
 * @desc    Làm mới accessToken (Giữ nguyên)
 */
router.post("/refresh-token", authLimiter, refreshToken);
/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất (Giữ nguyên)
 */
router.post("/logout", authLimiter, logout);
export default router;
