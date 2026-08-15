import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "terminal-theme";

/**
 * Runs before hydration so the correct theme class is on <html> immediately.
 * Prevents a flash of the wrong theme.
 */
export const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s==="light"||s==="dark"?s:(m?"dark":"light");var e=document.documentElement;e.classList.toggle("dark",t==="dark");e.style.colorScheme=t;}catch(e){}})();`;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme =
      stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
    setThemeState(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    document.documentElement.style.colorScheme = initial;
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    window.setTimeout(() => root.classList.remove("theme-transition"), 340);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative inline-flex h-10 w-[4.5rem] items-center rounded-full border border-border bg-card/80 p-1 shadow-sm backdrop-blur transition-colors duration-300 hover:border-primary/45 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${className}`}
    >
      <span
        className="absolute top-1 left-1 h-8 w-8 rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: isDark ? "translateX(2.05rem)" : "translateX(0)" }}
      />
      <span className="relative z-10 flex h-8 w-8 items-center justify-center">
        <Sun
          className={`h-4 w-4 transition-colors duration-300 ${isDark ? "text-muted-foreground" : "text-primary-foreground"}`}
        />
      </span>
      <span className="relative z-10 flex h-8 w-8 items-center justify-center">
        <Moon
          className={`h-4 w-4 transition-colors duration-300 ${isDark ? "text-primary-foreground" : "text-muted-foreground"}`}
        />
      </span>
    </button>
  );
}
