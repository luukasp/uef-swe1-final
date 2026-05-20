import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, MessageSquare, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/better-auth";
import { Navbar, type NavRoute } from "@/components/Navbar"; // Adjust path as needed

// 1. Define your specific Parent routes
const PARENT_ROUTES: NavRoute[] = [
  { label: "Home", to: "/parents", icon: LayoutDashboard },
  { label: "Messages", to: "/parents/messages", icon: MessageSquare },
  { label: "Schedule", to: "/parents/attendance", icon: Calendar },
];

export const Route = createFileRoute("/parents")({
  component: ParentsLayout,
});

function ParentsLayout() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // Get Better-Auth session
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Dark Mode side effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/auth/login" });
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* REUSABLE NAVBAR
          We pass the state and session data down as props.
      */}
      <Navbar
        user={
          user
            ? {
                name: user.name || "Parent",
                email: user.email,
                role: "Parent", // Hardcoded for this layout
                avatarUrl: user.image || undefined,
              }
            : null
        }
        routes={PARENT_ROUTES}
        onLogout={handleLogout}
        onThemeToggle={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full pt-8 px-4 animate-in fade-in duration-500">
        <Outlet />
      </main>
    </div>
  );
}
