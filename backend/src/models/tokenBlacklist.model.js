import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  // Lưu trữ chính cái token đã bị vô hiệu hóa
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // Tự động xóa khỏi DB khi token này hết hạn
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Index này sẽ tự động dọn dẹp collection
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
export default TokenBlacklist;
