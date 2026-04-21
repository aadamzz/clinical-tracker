"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/useThemeStore";

/**
 * Syncs the Zustand dark-mode flag with the <html> class list.
 * Rendered once inside the Providers wrapper.
 */
export function ThemeSync() {
  const isDark = useThemeStore((s) => s.isDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return null;
}
