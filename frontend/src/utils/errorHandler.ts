import { AxiosError } from "axios";
import { ERROR_MESSAGES } from "../constants/messages";
import { ApiError } from "../types/api.types";

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Network error
    if (!error.response) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }

    // Server error with message
    const apiError = error.response?.data as ApiError;
    if (apiError?.message) {
      return apiError.message;
    }

    // Validation errors
    if (apiError?.errors) {
      const firstError = Object.values(apiError.errors)[0];
      return firstError?.[0] || ERROR_MESSAGES.UNKNOWN;
    }

    // HTTP status errors
    switch (error.response?.status) {
      case 400:
        return "Invalid data";
      case 401:
        // You might want to use ERROR_MESSAGES.TOKEN_EXPIRED from your previous file
        return "Your session has expired";
      case 403:
        return "You do not have permission to perform this action";
      case 404:
        return "Resource not found";
      case 500:
        return "Server error. Please try again later";
      default:
        return ERROR_MESSAGES.UNKNOWN;
    }
  }

  // Unknown error
  if (error instanceof Error) {
    return error.message;
  }

  return ERROR_MESSAGES.UNKNOWN;
};

export const isTokenExpiredError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};
