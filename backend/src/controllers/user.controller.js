import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import { sendInfobipOtp, verifyInfobipOtp } from "../utils/smsService.js";

/**
 * @desc    Lấy thông tin profile của user đã đăng nhập
 * @route   GET /api/users/profile
 * @access  Private (Bắt buộc đăng nhập)
 */
export const getProfile = async (req, res) => {
  try {
    const user = req.user; // Lấy thông tin user từ middleware bảo vệ route
    res.status(200).json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    HÀM MỚI: Gửi OTP để đổi mật khẩu (khi đã đăng nhập)
 * @route   POST /api/user/send-change-otp
 */
export const sendChangeOtp = async (req, res) => {
  try {
    // 1. Lấy SĐT từ token (đã được middleware xác thực)
    //    req.user được cung cấp bởi middleware 'protectRoute'
    const phoneNumber = req.user.phoneNumber;

    console.log("=== SEND CHANGE OTP REQUEST ===");
    console.log("phoneNumber from token:", phoneNumber);
    console.log("type: change");

    // 2. Gọi Infobip để gửi PIN
    console.log("Calling sendInfobipOtp with phoneNumber:", phoneNumber);
    const pinId = await sendInfobipOtp(phoneNumber);
    console.log("Received pinId from Infobip:", pinId);

    if (!pinId) {
      console.error("Failed to get pinId from Infobip");
      return res.status(500).json({ message: "Failed to send OTP." });
    }

    // 3. Lưu pinId vào DB với type 'change'
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRE_MINUTES, 10) * 60 * 1000
    );

    // Xóa các pinId cũ (cùng SĐT, cùng type)
    console.log(
      "Deleting old OTP records for phoneNumber:",
      phoneNumber,
      "type: change"
    );
    const deleteResult = await Otp.deleteMany({ phoneNumber, type: "change" });
    console.log("Deleted old OTP records count:", deleteResult.deletedCount);

    const newOtpDoc = await Otp.create({
      phoneNumber,
      pinId,
      type: "change", // <-- Dùng type 'change'
      expiresAt,
    });

    console.log("=== OTP SAVED TO DB ===");
    console.log("OTP Document ID:", newOtpDoc._id);
    console.log("pinId:", newOtpDoc.pinId);
    console.log("phoneNumber:", newOtpDoc.phoneNumber);
    console.log("type:", newOtpDoc.type);
    console.log("expiresAt:", newOtpDoc.expiresAt);
    console.log("========================");

    res
      .status(200)
      .json({ message: "OTP for changing password sent successfully." });
  } catch (error) {
    console.error("Send Change OTP Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Đổi mật khẩu (khi đã đăng nhập)
 * @route   POST /api/user/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { otp, newPassword, confirmPassword } = req.body;
    const phoneNumber = req.user.phoneNumber;

    console.log("=== CHANGE PASSWORD REQUEST ===");
    console.log(
      "Request body - otp:",
      otp,
      "newPassword:",
      newPassword ? "***" : undefined,
      "confirmPassword:",
      confirmPassword ? "***" : undefined
    );
    console.log("phoneNumber from token:", phoneNumber);

    if (!otp || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "OTP and password fields are required." });
    }

    // 1. Lấy ID user từ token (đã được middleware giải mã)
    const userId = req.user.id;

    // 2. Validate input
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

    // 3. Tìm user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4. Verify OTP first
    console.log(
      "Looking for OTP document with phoneNumber:",
      phoneNumber,
      "type: change"
    );
    const otpDoc = await Otp.findOne({
      phoneNumber,
      type: "change",
      expiresAt: { $gt: Date.now() },
    });

    if (!otpDoc) {
      console.log(
        "No OTP document found or expired for phoneNumber:",
        phoneNumber,
        "type: change"
      );
      return res
        .status(400)
        .json({ message: "No pending OTP found or OTP has expired." });
    }

    console.log("=== OTP DOCUMENT FOUND ===");
    console.log("OTP Document ID:", otpDoc._id);
    console.log("pinId from DB:", otpDoc.pinId);
    console.log("pin (OTP code) from request:", otp);
    console.log("phoneNumber:", otpDoc.phoneNumber);
    console.log("type:", otpDoc.type);
    console.log("attemptCount:", otpDoc.attemptCount);
    console.log("expiresAt:", otpDoc.expiresAt);
    console.log("Current time:", new Date());
    console.log("===========================");

    console.log(
      "Calling verifyInfobipOtp with pinId:",
      otpDoc.pinId,
      "pin:",
      otp
    );
    const isVerified = await verifyInfobipOtp(otpDoc.pinId, otp);
    console.log("Verification result from Infobip:", isVerified);

    if (!isVerified) {
      console.log("OTP verification FAILED");
      otpDoc.attemptCount++;
      console.log("Updated attemptCount:", otpDoc.attemptCount);
      const MAX_OTP_ATTEMPTS = 5;
      if (otpDoc.attemptCount >= MAX_OTP_ATTEMPTS) {
        console.log("Max attempts reached, deleting OTP document");
        await Otp.deleteOne({ _id: otpDoc._id });
        return res
          .status(400)
          .json({ message: "Invalid OTP. Too many failed attempts." });
      }
      await otpDoc.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    console.log("OTP verification SUCCESS");

    // 5. Xóa OTP đã dùng
    await Otp.deleteOne({ _id: otpDoc._id });
    console.log("OTP document deleted after successful verification");

    // 6. Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save(); // Hook pre-save trong user.model.js sẽ tự động hash
    console.log("Password updated successfully");
    console.log("===========================");

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
