import { router } from "expo-router";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUserProfile,
  } = useAuthStore();

  const handleLogin = async (phoneNumber: string, password: string) => {
    await login({ phoneNumber, password });
    router.replace("/(tabs)");
  };

  const handleRegister = async (data: any) => {
    await register(data);
    router.replace("/(tabs)");
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUserProfile,
  };
};
