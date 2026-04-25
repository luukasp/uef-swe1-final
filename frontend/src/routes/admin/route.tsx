import {
  createFileRoute,
  Outlet,
  useNavigate,
  useLocation,
  Link,
} from "@tanstack/react-router";
import {
  Bell,
  User,
  CheckCheck,
  Moon,
  Sun,
  LayoutDashboard,
  Settings,
  Users,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

// Shadcn UI Sidebar Imports (Assumes you've run: npx shadcn@latest add sidebar)
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [isDark, setIsDark] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Standard notifications state
  const [notifications, setNotifications] = useState([
    { id: "1", title: "System Update", time: "2h ago", unread: true },
    { id: "2", title: "New User Registered", time: "5h ago", unread: false },
  ]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );

  return (
    <SidebarProvider>
      <div className={`${isDark ? "dark" : ""} flex min-h-screen w-full`}>
        {/* --- SHADCN SIDEBAR --- */}
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b h-16 flex justify-center">
            <div className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg truncate">Admin Panel</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="p-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Users">
                  <Link to="/admin">
                    <Users />
                    <span>Manage Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/admin">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-muted-foreground">
                  admin@school.com
                </span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* --- MAIN CONTENT AREA --- */}
        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-[1px] bg-border mx-2" />
              <h2 className="text-sm font-medium">Overview</h2>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 rounded-lg border bg-popover p-4 shadow-md z-[100]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold">Notifications</h4>
                      <CheckCheck
                        className="h-4 w-4 text-primary cursor-pointer"
                        onClick={() => setNotifications([])}
                      />
                    </div>
                    <div className="space-y-3">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="text-xs border-b pb-2 last:border-0"
                        >
                          <p className="font-medium">{n.title}</p>
                          <p className="text-muted-foreground">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
