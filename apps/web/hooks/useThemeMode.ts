"use client";

import { useState, useEffect } from "react";

export const useThemeMode = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Load theme preference from localStorage
    const savedMode = localStorage.getItem("theme-mode") as "light" | "dark";
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedMode) {
      setMode(savedMode);
    } else if (prefersDark) {
      setMode("dark");
    }
  }, []);

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return { mode, toggleTheme };
};
