import { useEffect, useState } from "react"; // 1. Import thêm useState
import { useAuthStore } from "../src/store/authStore";
import { router, Stack, SplashScreen, useSegments } from "expo-router";
import { StatusBar } from "react-native";

// Giữ cho splash screen hiển thị
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();
  const segments = useSegments();

  // 2. Thêm state để đảm bảo layout đã render
  const [isLayoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  // 3. Effect này chỉ chạy MỘT LẦN để xác nhận layout đã mount
  useEffect(() => {
    setLayoutReady(true);
  }, []);

  useEffect(() => {
    // 4. Chỉ điều hướng khi CẢ HAI ĐIỀU KIỆN đều đúng:
    //    - Auth đã load xong (!isLoading)
    //    - Layout đã mount xong (isLayoutReady)
    if (!isLoading && isLayoutReady) {
      // Kiểm tra xem có đang ở màn hình verify-otp không (để tránh tự động chuyển về login khi nhập sai OTP)
      const isOnVerifyOTPScreen = segments.includes("verify-otp");
      const isOnForgotPasswordScreen = segments.includes("forgot-password");
      const isOnRegisterScreen = segments.includes("register");

      // Không tự động chuyển về login nếu đang ở các màn hình auth này
      const shouldSkipAutoRedirect =
        isOnVerifyOTPScreen || isOnForgotPasswordScreen || isOnRegisterScreen;

      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else if (!shouldSkipAutoRedirect) {
        // Chỉ chuyển về login nếu không đang ở các màn hình auth đặc biệt
        router.replace("/(auth)/login");
      }

      // Ẩn splash screen CHỈ SAU KHI đã điều hướng
      if (!shouldSkipAutoRedirect) {
        SplashScreen.hideAsync();
      }
    }
  }, [isAuthenticated, isLoading, isLayoutReady, segments]); // 5. Thêm isLayoutReady và segments

  // 6. Vẫn LUÔN LUÔN trả về Navigator
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
