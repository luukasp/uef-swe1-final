import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TabsBasic, { AuthIllustration } from "@/components/ui/tabs-component";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-lg font-semibold">KinderConnect</h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleTheme}>
            {theme === "light" ? "Dark" : "Light"}
          </Button>

          <Link to="/auth">
            <Button>Sign in</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            All-in-one kindergarten management
          </h2>

          <p className="mt-4 text-muted-foreground">
            Simplify daily operations, keep staff organized, and stay connected
            with parents — all in one place.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link to="/auth">
              <Button size="lg">Get started</Button>
            </Link>

            <Button size="lg" variant="outline" onClick={toggleTheme}>
              Toggle theme
            </Button>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="mt-12 w-full max-w-4xl">
          <TabsBasic
            fullWidth
            items={[
              {
                value: "workers",
                label: "For Staff",
                children: (
                  <div className="grid gap-6 md:grid-cols-2 items-center">
                    <AuthIllustration />
                    <div>
                      <h3 className="text-xl font-semibold">
                        Manage your day easily
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Track attendance, plan activities, and manage children
                        groups without paperwork chaos.
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                value: "parents",
                label: "For Parents",
                children: (
                  <div className="grid gap-6 md:grid-cols-2 items-center">
                    <AuthIllustration />
                    <div>
                      <h3 className="text-xl font-semibold">
                        Stay connected with your child
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Get updates, messages, and daily activities مباشرة from
                        staff in real time.
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                value: "admin",
                label: "For Admin",
                children: (
                  <div className="grid gap-6 md:grid-cols-2 items-center">
                    <AuthIllustration />
                    <div>
                      <h3 className="text-xl font-semibold">
                        Full control & overview
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Manage staff, schedules, billing, and reports from a
                        single dashboard.
                      </p>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} KinderConnect
      </footer>
    </div>
  );
}
