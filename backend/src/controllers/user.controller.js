import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import { sendInfobipOtp } from "../utils/smsService.js";

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

    // 2. Gọi Infobip để gửi PIN
    const pinId = await sendInfobipOtp(phoneNumber);
    if (!pinId) {
      return res.status(500).json({ message: "Failed to send OTP." });
    }

    // 3. Lưu pinId vào DB với type 'change'
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRE_MINUTES, 10) * 60 * 1000
    );

    // Xóa các pinId cũ (cùng SĐT, cùng type)
    await Otp.deleteMany({ phoneNumber, type: "change" });

    await Otp.create({
      phoneNumber,
      pinId,
      type: "change", // <-- Dùng type 'change'
      expiresAt,
    });

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
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All password fields are required." });
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

    // 4. Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid old password." });
    }

    // 5. Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save(); // Hook pre-save trong user.model.js sẽ tự động hash

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
