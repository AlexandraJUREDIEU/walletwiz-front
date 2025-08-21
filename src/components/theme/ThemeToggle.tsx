import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}