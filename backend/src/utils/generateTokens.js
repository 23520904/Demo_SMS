import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
/**
 * @desc    Hàm tiện ích tạo 2 loại token
 */
export const generateTokens = (user) => {
  const payload = { id: user._id, phoneNumber: user.phoneNumber };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN } // VD: 15m
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } // VD: 365d
  );

  return { accessToken, refreshToken };
};
