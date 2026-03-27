"use client";
import React, { useState, useEffect } from "react";

export type Value = {
  theme: string;
  setTheme: (theme: string) => void;
};
import ThemeContext from "./ThemeContext";

const getThemeFromLocal = () => {
  if (typeof window === "undefined") {
    return "light";
  }
  const theme = window.localStorage.getItem("theme");
  if (theme) {
    return theme;
  } else {
    return "light";
  }
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(getThemeFromLocal());
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
