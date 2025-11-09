// utils/smsService.js

// === ĐÂY LÀ CÁCH SỬA LỖI (theo hướng dẫn của lỗi) ===
import pkg from "follow-redirects";
const { https } = pkg; // Lấy thuộc tính 'https' từ default export
// === HẾT PHẦN SỬA ===

import dotenv from "dotenv";

// Tải biến môi trường
dotenv.config();

// Lấy config (lần này sẽ lấy 100% chính xác)
const BASE_URL = process.env.INFOBIP_BASE_URL.replace("https://", ""); // Bỏ https://
const API_KEY = `App ${process.env.INFOBIP_API_KEY_VALUE}`;
const APP_ID = process.env.INFOBIP_APP_ID;
const MESSAGE_ID = process.env.INFOBIP_MESSAGE_ID;
const SENDER_FROM = process.env.INFOBIP_SENDER_FROM; // Sẽ là "447491163443"

/**
 * @desc    Hàm gọi API Infobip (viết lại bằng `httpss`)
 */
function callInfobipApi(path, method, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      method: method,
      hostname: BASE_URL,
      path: path,
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      maxRedirects: 20,
    };


    const req = https.request(options, (res) => {
      // Dòng 40
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const jsonResponse = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonResponse);
          } else {
            // Lỗi (Bad Request, Unauthorized, v.v.)
            reject(jsonResponse);
          }
        } catch (e) {
          reject({ message: "Failed to parse JSON response", body: body });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

/**
 * @desc    Gửi mã PIN (Request 3)
 */
export async function sendInfobipOtp(phoneNumber) {
  try {
    const payload = {
      applicationId: APP_ID,
      messageId: MESSAGE_ID,
      from: SENDER_FROM, // Dùng biến .env
      to: phoneNumber,
    };

    const response = await callInfobipApi("/2fa/2/pin", "POST", payload);

    // Gửi thành công, trả về pinId
    
    return response.pinId;
  } catch (error) {
    console.error("Infobip Send PIN Error (https Module):", error);
    return null;
  }
}

/**
 * @desc    Xác thực mã PIN (Request 4)
 */
export async function verifyInfobipOtp(pinId, otpCode) {
  try {
    const payload = {
      pin: otpCode,
    };

    const response = await callInfobipApi(
      `/2fa/2/pin/${pinId}/verify`,
      "POST",
      payload
    );

    if (response && response.verified) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Infobip Verify PIN Error (httpsModule):", error);
    return false;
  }
}
