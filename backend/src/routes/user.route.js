import express from "express";
import { authLimiter, otpLimiter } from "../utils/limiter.js";
import { changePassword, getProfile, sendChangeOtp } from "../controllers/user.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Lấy thông tin profile của user đã đăng nhập
 * @access  Private (Bị chặn bởi authenticateToken)
 */
router.get(
  "/profile",
  protectRoute, // Middleware "chốt chặn"
  authLimiter, // Áp dụng rate limit
  getProfile
);

/**
 * @route   POST /api/user/change-password
 * @desc    Đổi mật khẩu (khi đã đăng nhập)
 * @body    { oldPassword, newPassword, confirmPassword }
 * @access  Private
 */
router.post(
  "/change-password",
  protectRoute, // <-- Bắt buộc
  authLimiter,
  changePassword // <-- Hàm controller mới
);
/**
 * @route   POST /api/user/send-change-otp
 * @desc    Gửi OTP để xác nhận đổi mật khẩu (khi đã đăng nhập)
 * @access  Private
 */
router.post(
  "/send-change-otp",
  protectRoute, // <-- Dùng middleware của bạn
  otpLimiter,
  sendChangeOtp
);
export default router;
