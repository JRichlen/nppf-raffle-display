import { createContext, useContext } from "react";

export interface ThemeOption {
  label: string;
  value: string;
  color: string;
}

export interface ThemeContextType {
  selectedTheme: ThemeOption;
  setSelectedTheme: (theme: ThemeOption) => void;
  themeOptions: ThemeOption[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};