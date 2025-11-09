export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to the server",
  TIMEOUT: "The request timed out",
  UNKNOWN: "An error occurred. Please try again",

  // Phone
  PHONE_REQUIRED: "Please enter your phone number",
  PHONE_INVALID: "Invalid phone number",

  // Password
  PASSWORD_REQUIRED: "Please enter your password",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters long",
  PASSWORD_NOT_MATCH: "Confirm password does not match",

  // OTP
  OTP_REQUIRED: "Please enter the OTP code",
  OTP_INVALID: "Invalid OTP code",
  OTP_LENGTH: "OTP code must be 6 digits",

  // Name
  NAME_REQUIRED: "Please enter your full name",

  // Auth
  LOGIN_FAILED: "Login failed",
  REGISTER_FAILED: "Registration failed",
  TOKEN_EXPIRED: "Your session has expired",
};

export const SUCCESS_MESSAGES = {
  OTP_SENT: "An OTP code has been sent to your phone number",
  OTP_VERIFIED: "OTP verified successfully",
  REGISTER_SUCCESS: "Registration successful",
  LOGIN_SUCCESS: "Login successful",
  PASSWORD_CHANGED: "Password changed successfully",
  PASSWORD_RESET: "Password reset successfully",
};
