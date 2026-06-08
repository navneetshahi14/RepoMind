"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useDarkMode() {
  const { theme, setTheme, systemTheme } = useTheme();
  const mounted = useMounted();

  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  return {
    theme,
    setTheme,
    isDark: mounted ? isDark : false,
    mounted,
  };
}
