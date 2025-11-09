import { useEffect, useState } from "react"; // 1. Import thêm useState
import { useAuthStore } from "../src/store/authStore";
import { router, Stack, SplashScreen } from "expo-router";
import { StatusBar } from "react-native";

// Giữ cho splash screen hiển thị
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();

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
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }

      // Ẩn splash screen CHỈ SAU KHI đã điều hướng
      SplashScreen.hideAsync();
    }
  }, [isAuthenticated, isLoading, isLayoutReady]); // 5. Thêm isLayoutReady

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
