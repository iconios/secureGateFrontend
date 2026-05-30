import { ISecureStorage } from "@shared/services/manager";
import { cookies } from "next/headers";

export const webStorage: ISecureStorage = {
  async get(key: string) {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value || null;
  },
  async set(key: string, value: string) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: key,
      value: value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  },
  async delete(key: string) {
    const cookieStore = await cookies();
    cookieStore.delete(key);
  },
};
