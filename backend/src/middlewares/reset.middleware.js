
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // <-- 1. Vẫn import User

export const authenticateResetToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Reset token required" });
    }

    // 2. SỬA LẠI: Dùng chìa khóa RESET
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

    // 3. THÊM: Kiểm tra mục đích của token
    if (decoded.type !== "reset") {
      return res.status(403).json({ message: "Invalid token type" });
    }

    // 4. GIỮ NGUYÊN: Tìm user y hệt
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // 5. Gắn full user object
    next();
  } catch (error) {
    console.error("Auth Reset Token Middleware Error:", error);
    res.status(401).json({ message: "Invalid or expired reset token" });
  }
};
