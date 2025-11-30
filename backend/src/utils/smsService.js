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

    console.log("=== INFOBIP API CALL ===");
    console.log("Method:", method);
    console.log("Path:", path);
    console.log("Full URL:", `https://${BASE_URL}${path}`);
    console.log("Request payload:", postData);
    console.log("========================");

    const req = https.request(options, (res) => {
      // Dòng 40
      let body = "";
      console.log("Infobip API Response Status:", res.statusCode);
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const jsonResponse = JSON.parse(body);
          console.log("Infobip API Response Body:", JSON.stringify(jsonResponse, null, 2));
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log("Infobip API call SUCCESS");
            resolve(jsonResponse);
          } else {
            // Lỗi (Bad Request, Unauthorized, v.v.)
            console.log("Infobip API call FAILED with status:", res.statusCode);
            reject(jsonResponse);
          }
        } catch (e) {
          console.error("Failed to parse Infobip response:", e);
          console.error("Response body:", body);
          reject({ message: "Failed to parse JSON response", body: body });
        }
      });
    });

    req.on("error", (error) => {
      console.error("Infobip API request error:", error);
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
    console.log("=== SEND INFOBIP OTP ===");
    console.log("phoneNumber:", phoneNumber);
    
    const payload = {
      applicationId: APP_ID,
      messageId: MESSAGE_ID,
      from: SENDER_FROM, // Dùng biến .env
      to: phoneNumber,
    };
    
    console.log("Infobip API Payload:", JSON.stringify(payload, null, 2));

    const response = await callInfobipApi("/2fa/2/pin", "POST", payload);
    
    console.log("Infobip API Response:", JSON.stringify(response, null, 2));
    console.log("pinId received from Infobip:", response.pinId);
    console.log("========================");

    // Gửi thành công, trả về pinId
    
    return response.pinId;
  } catch (error) {
    console.error("Infobip Send PIN Error (https Module):", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return null;
  }
}

/**
 * @desc    Xác thực mã PIN (Request 4)
 */
export async function verifyInfobipOtp(pinId, otpCode) {
  try {
    console.log("=== VERIFY INFOBIP OTP ===");
    console.log("pinId:", pinId);
    console.log("pin (OTP code):", otpCode);
    
    const payload = {
      pin: otpCode,
    };
    
    console.log("Infobip Verify API Payload:", JSON.stringify(payload, null, 2));
    console.log("Infobip Verify API Path:", `/2fa/2/pin/${pinId}/verify`);

    const response = await callInfobipApi(
      `/2fa/2/pin/${pinId}/verify`,
      "POST",
      payload
    );
    
    console.log("Infobip Verify API Response:", JSON.stringify(response, null, 2));
    console.log("Verified status:", response?.verified);
    console.log("==========================");

    if (response && response.verified) {
      console.log("OTP verification SUCCESS in Infobip");
      return true;
    }
    console.log("OTP verification FAILED in Infobip");
    return false;
  } catch (error) {
    console.error("Infobip Verify PIN Error (httpsModule):", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return false;
  }
}
