import { useEffect, useState } from "react";
import { useAuthStore } from "../src/store/authStore";
import { router, Stack, SplashScreen, useSegments } from "expo-router";
import { StatusBar } from "react-native";

// Giữ cho splash screen hiển thị cho đến khi xử lý xong logic
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();
  const segments = useSegments();

  // State để đảm bảo layout đã render xong
  const [isLayoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  useEffect(() => {
    setLayoutReady(true);
  }, []);

  useEffect(() => {
    // Chỉ chạy logic khi Auth đã load xong VÀ Layout đã sẵn sàng
    if (!isLoading && isLayoutReady) {
      const inTabsGroup = segments[0] === "(tabs)";
      const inAuthGroup = segments[0] === "(auth)";

      // --- PHẦN QUAN TRỌNG ĐÃ SỬA ---
      // Kiểm tra tất cả các màn hình trong luồng Auth để tránh bị đá về Login
      // Dựa trên hình ảnh bạn gửi:
      const isOnVerifyOTPScreen = segments.includes("verify-otp" as never);
      const isOnForgotPasswordScreen = segments.includes(
        "forgot-password" as never
      );
      const isOnRegisterScreen = segments.includes("register" as never);
      const isOnResetPasswordScreen = segments.includes(
        "reset-password" as never
      ); // Đã thêm cái này
      const isOnLoginScreen = segments.includes("login" as never);

      // Gom tất cả lại: Nếu đang ở bất kỳ trang nào thuộc nhóm này thì KHÔNG tự động chuyển về login
      const isAuthFlow =
        isOnVerifyOTPScreen ||
        isOnForgotPasswordScreen ||
        isOnRegisterScreen ||
        isOnResetPasswordScreen ||
        isOnLoginScreen ||
        inAuthGroup; // Thêm check group cho chắc chắn

      if (isAuthenticated) {
        // Logic 1: Nếu đã đăng nhập -> Vào Tabs
        // KÈM ĐIỀU KIỆN: Chỉ chuyển nếu chưa ở trong Tabs (để tránh vòng lặp đơ app)
        if (!inTabsGroup) {
          router.replace("/(tabs)");
        }
      } else {
        // Logic 2: Nếu chưa đăng nhập
        // Chỉ chuyển về Login nếu người dùng KHÔNG đang ở trong các màn hình Auth (như reset, forgot, register...)
        if (!isAuthFlow) {
          router.replace("/(auth)/login");
        }
      }

      // Ẩn splash screen sau khi logic điều hướng đã chốt
      SplashScreen.hideAsync();
    }
  }, [isAuthenticated, isLoading, isLayoutReady, segments]);

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
