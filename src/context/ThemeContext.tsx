"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeId = "light" | "dark" | "orange" | "emerald" | "violet";
export type FontId = "inter" | "jakarta" | "dm" | "poppins" | "nunito";

interface ThemeContextValue {
  theme: ThemeId; font: FontId;
  setTheme: (t: ThemeId) => void; setFont: (f: FontId) => void;
}

const ThemeCtx = createContext<ThemeContextValue | null>(null);

const themeClasses: Record<ThemeId, string> = {
  light: "", dark: "dark", orange: "theme-orange", emerald: "theme-emerald", violet: "theme-violet",
};
const fontClasses: Record<FontId, string> = {
  inter: "font-inter", jakarta: "font-jakarta", dm: "font-dm", poppins: "font-poppins", nunito: "font-nunito",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("orange");
  const [font, setFontState] = useState<FontId>("poppins");

  useEffect(() => {
    const savedTheme = localStorage.getItem("nexus-theme") as ThemeId;
    const savedFont = localStorage.getItem("nexus-font") as FontId;
    if (savedTheme) setThemeState(savedTheme);
    if (savedFont) setFontState(savedFont);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    Object.values(themeClasses).forEach(c => c && root.classList.remove(c));
    if (themeClasses[theme]) root.classList.add(themeClasses[theme]);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    Object.values(fontClasses).forEach(c => root.classList.remove(c));
    root.classList.add(fontClasses[font]);
  }, [font]);

  const setTheme = (t: ThemeId) => { setThemeState(t); localStorage.setItem("nexus-theme", t); };
  const setFont = (f: FontId) => { setFontState(f); localStorage.setItem("nexus-font", f); };

  return <ThemeCtx.Provider value={{ theme, font, setTheme, setFont }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

export const themes: { id: ThemeId; label: string; dot: string }[] = [
  { id: "light", label: "Light (Indigo)", dot: "hsl(243 75% 59%)" },
  { id: "dark", label: "Dark", dot: "hsl(243 75% 59%)" },
  { id: "orange", label: "Chargebee Orange", dot: "hsl(25 95% 53%)" },
  { id: "emerald", label: "Emerald Green", dot: "hsl(160 84% 39%)" },
  { id: "violet", label: "Violet", dot: "hsl(271 91% 65%)" },
];
export const fonts: { id: FontId; label: string }[] = [
  { id: "inter", label: "Inter" },
  { id: "jakarta", label: "Plus Jakarta Sans" },
  { id: "dm", label: "DM Sans" },
  { id: "poppins", label: "Poppins" },
  { id: "nunito", label: "Nunito" },
];
