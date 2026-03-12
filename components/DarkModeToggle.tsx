"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "tm-theme";

const applyTheme = (isDark: boolean) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("theme-dark", isDark);
};

interface DarkModeToggleProps {
  className?: string;
}

export default function DarkModeToggle({ className = "" }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const dark = stored === "dark";
    setIsDark(dark);
    applyTheme(dark);
    setIsReady(true);

    const syncTheme = () => {
      const nextDark = localStorage.getItem(THEME_STORAGE_KEY) === "dark";
      setIsDark(nextDark);
      applyTheme(nextDark);
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener("tm-theme-change", syncTheme);
    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("tm-theme-change", syncTheme);
    };
  }, []);

  const setTheme = (nextDark: boolean) => {
    setIsDark(nextDark);
    applyTheme(nextDark);
    localStorage.setItem(THEME_STORAGE_KEY, nextDark ? "dark" : "light");
    window.dispatchEvent(new Event("tm-theme-change"));
  };

  if (!isReady) {
    return null;
  }

  return (
    <div className={`tm-theme-toggle ${className}`} role="group" aria-label="Theme">
      <button type="button" onClick={() => setTheme(false)} className={`tm-theme-option ${!isDark ? "active" : ""}`} aria-pressed={!isDark}>
        ☀️ Light
      </button>
      <button type="button" onClick={() => setTheme(true)} className={`tm-theme-option ${isDark ? "active" : ""}`} aria-pressed={isDark}>
        🌙 Dark
      </button>
    </div>
  );
}
