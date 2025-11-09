import rateLimit, { ipKeyGenerator } from "express-rate-limit";
export const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 3,
  message: { message: "Too many OTP requests, please wait 1 minute." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // 1. Dùng cho /api/auth/send-otp (chưa đăng nhập, có body)
    if (req.body && req.body.phoneNumber) {
      return req.body.phoneNumber;
    }

    // 2. Dùng cho /api/user/send-change-otp (đã đăng nhập, không body)
    //    (Middleware protectRoute đã chạy và gắn req.user)
    if (req.user && req.user.phoneNumber) {
      return req.user.phoneNumber;
    }

    // 3. Fallback (Dự phòng): Dùng IP
    return ipKeyGenerator(req, res);
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10,
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
