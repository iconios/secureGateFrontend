import { ISecureStorage } from "@shared/services/manager";
import * as SecureStore from "expo-secure-store";

export const nativeStorage: ISecureStorage = {
  async get(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string) {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  },
  async delete(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};
