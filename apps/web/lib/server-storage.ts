"server only";

import { ISecureStorage } from "@shared/services/manager";
import { cookies } from "next/headers";

const ONE_DAY = 24 * 60 * 60;
const THIRTY_DAYS = 30 * ONE_DAY;

export const webStorage: ISecureStorage = {
  async get(key: string) {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value || null;
  },
  async set(key: string, value: string, rememberMe: boolean) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: key,
      value: value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: rememberMe ? THIRTY_DAYS : undefined,
    });
  },
  async delete(key: string) {
    const cookieStore = await cookies();
    cookieStore.delete(key);
  },
};
