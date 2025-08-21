import * as React from "react";

type Props = {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark";
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "walletwiz-theme",
}: Props) {
  const [theme, setTheme] = React.useState<"light" | "dark">(
    (localStorage.getItem(storageKey) as "light" | "dark") || defaultTheme
  );

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = React.useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

type ThemeContextType = {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});