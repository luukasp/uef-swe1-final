import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  ClipboardCheck,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Navbar, type NavRoute } from "@/components/Navbar";
import { authClient } from "@/lib/auth/better-auth";

// 1. Define Teacher-Specific Routes
const TEACHER_ROUTES: NavRoute[] = [
  { label: "Dashboard", to: "/teachers", icon: LayoutDashboard },
  { label: "My Class", to: "/teachers/class", icon: Users },
  { label: "Attendance", to: "/teachers/attendance", icon: ClipboardCheck },
  { label: "Messages", to: "/teachers/messages", icon: MessageSquare },
];

export const Route = createFileRoute("/teachers")({
  component: TeacherLayout,
});

function TeacherLayout() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // 2. Get Teacher Session
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const root = window.document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDark]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => navigate({ to: "/auth/login" }),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* NAVBAR:
          - Home (Dashboard) stays active for sub-routes
          - isTeacher logic triggers the Yellow/Amber vibrancy
      */}
      <Navbar
        user={
          user
            ? {
                name: user.name || "Teacher",
                email: user.email,
                role: "Teacher", // This triggers the Yellow theme and KINDY.TEACHERS logo
                avatarUrl: user.image || undefined,
              }
            : null
        }
        routes={TEACHER_ROUTES}
        onLogout={handleLogout}
        onThemeToggle={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full pt-8 px-4 pb-12 animate-in fade-in duration-500">
        {/* This renders the child routes like /teachers/class or /teachers/attendance */}
        <Outlet />
      </main>
    </div>
  );
}
