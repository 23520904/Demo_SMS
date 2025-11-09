import { LoginCredentials, RegisterData, User } from "../types/auth.types";
import { create } from "zustand";
import { storage } from "../utils/storage";
import { TOKEN_CONFIG } from "../constants/config";
import { authService } from "../api/services/auth.service";
import { userService } from "../api/services/user.service";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,

  // Set user
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      storage.setItem(TOKEN_CONFIG.USER_KEY, user);
    } else {
      storage.removeItem(TOKEN_CONFIG.USER_KEY);
    }
  },

  // Set tokens
  setTokens: async (accessToken, refreshToken) => {
    set({ accessToken, refreshToken });
    await storage.setSecure(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    await storage.setSecure(TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
  },

  // Login
  login: async (credentials) => {
    try {
      set({ isLoading: true });
      const response = await authService.login(credentials);

      await get().setTokens(response.accessToken, response.refreshToken);
      get().setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Register
  register: async (data) => {
    try {
      set({ isLoading: true });
      const response = await authService.register(data);

      await get().setTokens(response.accessToken, response.refreshToken);
      get().setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout
  logout: async () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });

    await storage.removeSecure(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    await storage.removeSecure(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    await storage.removeItem(TOKEN_CONFIG.USER_KEY);
  },

  // Load stored auth từ storage khi khởi động app
  loadStoredAuth: async () => {
    try {
      set({ isLoading: true });

      const [accessToken, refreshToken, user] = await Promise.all([
        storage.getSecure(TOKEN_CONFIG.ACCESS_TOKEN_KEY),
        storage.getSecure(TOKEN_CONFIG.REFRESH_TOKEN_KEY),
        storage.getItem<User>(TOKEN_CONFIG.USER_KEY),
      ]);

      if (accessToken && refreshToken && user) {
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Failed to load stored auth:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Refresh user profile từ server
  refreshUserProfile: async () => {
    try {
      const profile = await userService.getProfile();
      get().setUser(profile as User);
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
  },
}));
