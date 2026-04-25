import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        {/* FLOATING THEME TOGGLE */}
        <button
          onClick={() => setIsDark((v) => !v)}
          className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-md hover:bg-muted transition"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* PAGE CONTENT */}
        <main className="min-h-screen w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
