import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
class StorageService {
  // Secure storage cho tokens (iOS/Android)
  async setSecure(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  async getSecure(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  async removeSecure(key: string): Promise<void> {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }

  // Regular storage cho data thông thường
  async setItem(key: string, value: any): Promise<void> {
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  }

  async getItem<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}

export const storage = new StorageService();
