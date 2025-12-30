import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "hero";
}

export function ThemeToggle({ className = "", variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === "hero") {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white transition-all ${className}`}
        data-testid="button-theme-toggle"
        aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4" />
            <span className="text-xs font-medium">Day</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4" />
            <span className="text-xs font-medium">Night</span>
          </>
        )}
      </button>
    );
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
      className={className}
      data-testid="button-theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
