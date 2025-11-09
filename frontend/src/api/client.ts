import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG, TOKEN_CONFIG } from "../constants/config";
import { storage } from "../utils/storage";
import { router } from "expo-router";

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Thêm token vào header
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await storage.getSecure(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Xử lý refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Đang refresh, đợi trong queue
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => this.client(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await storage.getSecure(
              TOKEN_CONFIG.REFRESH_TOKEN_KEY
            );

            if (!refreshToken) {
              throw new Error("No refresh token");
            }

            // Gọi API refresh token
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}/auth/refresh-token`,
              { refreshToken }
            );

            const { accessToken } = response.data;
            await storage.setSecure(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);

            // Retry các request đang chờ
            this.failedQueue.forEach((promise) => promise.resolve());
            this.failedQueue = [];

            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh thất bại -> Logout
            this.failedQueue.forEach((promise) => promise.reject(refreshError));
            this.failedQueue = [];

            await this.clearAuth();
            router.replace("/(auth)/login");

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async clearAuth() {
    await storage.removeSecure(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    await storage.removeSecure(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    await storage.removeItem(TOKEN_CONFIG.USER_KEY);
  }

  getInstance(): AxiosInstance {
    return this.client;
  }

  // Helper method cho request với custom token (reset token)
  async requestWithToken(
    method: string,
    url: string,
    token: string,
    data?: any
  ) {
    return this.client.request({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiClient = new ApiClient();
export const api = apiClient.getInstance();
