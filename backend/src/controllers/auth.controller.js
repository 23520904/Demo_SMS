import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendInfobipOtp, verifyInfobipOtp } from "../utils/smsService.js";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
dotenv.config();

const MAX_OTP_ATTEMPTS = 5;
/**
 * @desc    Hàm tiện ích tạo 2 loại token
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

/**
 * @desc    Gửi OTP (Dùng Infobip)
 * @route   POST /api/auth/send-otp
 */
export const sendOtp = async (req, res) => {
  try {
    const { phoneNumber, type } = req.body;
    if (!phoneNumber || !type) {
      return res
        .status(400)
        .json({ message: "Phone number and type are required." });
    }
    if (!["register", "reset", "change"].includes(type)) {
      return res.status(400).json({ message: "Invalid request type." });
    }
    console.log(`Phone num: "${phoneNumber}"`);
    const existingUser = await User.findOne({ phoneNumber });
    if (type == "register" && existingUser) {
      return res
        .status(400)
        .json({ message: "Phone number is already registered" });
    }
    console.log("existingUser: ", existingUser);
    if (type === "reset" && !existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const pinId = await sendInfobipOtp(phoneNumber);
    if (!pinId) {
      return res
        .status(500)
        .json({ message: "Failed to send OTP via Infobip." });
    }

    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRE_MINUTES, 10) * 60 * 1000
    );

    await Otp.deleteMany({ phoneNumber, type }); // Xóa các pinId cũ

    await Otp.create({
      phoneNumber,
      pinId,
      type,
      expiresAt,
    });
    return res.status(200).json({
      message: `OTP sent successfully. It will expire in ${process.env.OTP_EXPIRE_MINUTES} minutes.`,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Đăng ký (Dùng Infobip)
 * @route   POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { fullName, phoneNumber, password, confirmPassword, otp } = req.body;
    if (!fullName || !phoneNumber || !password || !confirmPassword || !otp) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    if (fullName.length < 3) {
      return res
        .status(400)
        .json({ message: "Full name must be at least 3 characters long." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already exists." });
    }
    const otpDoc = await Otp.findOne({
      phoneNumber,
      type: "register",
      expiresAt: { $gt: Date.now() },
    });

    if (!otpDoc) {
      return res
        .status(400)
        .json({ message: "No pending OTP found or OTP has expired." });
    }

    const isVerified = await verifyInfobipOtp(otpDoc.pinId, otp);

    if (!isVerified) {
      otpDoc.attemptCount++;
      if (otpDoc.attemptCount >= MAX_OTP_ATTEMPTS) {
        await Otp.deleteOne({ _id: otpDoc._id }); // Xóa nếu sai quá nhiều
        return res
          .status(400)
          .json({ message: "Invalid OTP. Too many failed attempts." });
      }
      await otpDoc.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const newUser = new User({ fullName, phoneNumber, password });
    await newUser.save();
    await Otp.deleteOne({ _id: otpDoc._id });

    const { accessToken, refreshToken } = generateTokens(newUser._id);

    res.status(201).json({
      message: "User registered successfully!",
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Phone number is already registered." });
    }
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Reset Mật khẩu (Dùng Infobip)
 * @route   POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const user = req.user;
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

    user.password = newPassword;
    await user.save(); // Hook pre-save sẽ tự động hash

    res
      .status(200)
      .json({ message: "Password has been changed successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Đăng nhập bằng Mật khẩu
 */
export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid phone number or password." });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password." });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(200).json({
      message: "Login successful!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Refresh Token
 */

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }
  try {
    const checkIfBlacklisted = await TokenBlacklist.findOne({
      token: refreshToken,
    });
    if (checkIfBlacklisted) {
      return res.status(403).json({
        message: "Refresh token has been revoked. Please login again.",
      });
    }
    const userPayload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
    const user = await User.findById(userPayload.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAccessToken = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired refresh token. Please login again.",
    });
  }
};

/**
 * @desc    Đăng xuất
 */
export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const expiresAt = new Date(decoded.exp * 1000);
    await TokenBlacklist.create({
      token: refreshToken,
      expiresAt: expiresAt,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(200).json({
      message: "Logged out successfully (token was already invalid).",
    });
  }
};

/**
 * @desc    Xác thực OTP và trả về Token Reset
 * @route   POST /api/auth/verify-otp
 */
export const verifyResetOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // 1. Tìm Otp document (để lấy pinId)
    const otpDoc = await Otp.findOne({
      phoneNumber,
      type: "reset",
      expiresAt: { $gt: Date.now() },
    });

    if (!otpDoc) {
      return res
        .status(400)
        .json({ message: "No pending OTP found or OTP has expired." });
    }

    // 2. Gọi Infobip để xác thực
    const isVerified = await verifyInfobipOtp(otpDoc.pinId, otp);

    if (!isVerified) {
      // (Logic thử sai)
      otpDoc.attemptCount++;
      if (otpDoc.attemptCount >= MAX_OTP_ATTEMPTS) {
        await Otp.deleteOne({ _id: otpDoc._id });
        return res
          .status(400)
          .json({ message: "Invalid OTP. Too many failed attempts." });
      }
      await otpDoc.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // 3. OTP ĐÚNG -> Tìm user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4. Xóa OTP đã dùng
    await Otp.deleteOne({ _id: otpDoc._id });

    // 5. TẠO TOKEN RESET (có hạn 5 phút, dùng chìa khóa RESET)
    const resetToken = jwt.sign(
      { userId: user._id, type: "reset" },
      process.env.JWT_RESET_SECRET, // <-- Chìa khóa mới
      { expiresIn: "5m" }
    );

    res.status(200).json({
      message: "OTP verified. Use this token to reset your password.",
      resetToken: resetToken, // <-- Trả về "vé"
    });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
