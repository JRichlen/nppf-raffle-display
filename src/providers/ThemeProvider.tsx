import React, { useState, useEffect } from "react";
import { ThemeContext, ThemeOption } from "../contexts/ThemeContext";

const themeOptions: ThemeOption[] = [
  { label: "Ocean Blue", value: "ocean", color: "#1976d2" },
  { label: "Forest Green", value: "forest", color: "#2e7d32" },
  { label: "Royal Purple", value: "purple", color: "#7b1fa2" },
  { label: "Sunset Orange", value: "sunset", color: "#ed6c02" },
  { label: "Ruby Red", value: "ruby", color: "#d32f2f" }
];

const THEME_STORAGE_KEY = 'raffleWinnerCardTheme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      try {
        return JSON.parse(storedTheme);
      } catch {
        return themeOptions[0];
      }
    }
    return themeOptions[0];
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(selectedTheme));
  }, [selectedTheme]);

  return (
    <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme, themeOptions }}>
      {children}
    </ThemeContext.Provider>
  );
};