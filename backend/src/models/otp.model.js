import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      index: true, // ✅ Thêm index để query nhanh hơn
    },
    // Lưu pinId từ Infobip, KHÔNG lưu mã OTP
    pinId: {
      type: String,
      required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["register", "reset","change"],
      },
    expiresAt: {
      type: Date,
      required: true,
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Xóa tự động khi hết hạn
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
