"use client";

import * as React from "react";
import ThemeRegistry from "../theme/ThemeRegistry";
import { useThemeMode } from "../hooks/useThemeMode";

export default function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { mode } = useThemeMode();

  return <ThemeRegistry mode={mode}>{children}</ThemeRegistry>;
}
