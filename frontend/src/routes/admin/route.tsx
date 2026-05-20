import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  BarChart3,
  Building2,
  Users,
  Key,
  LogOut,
  Settings,
  Search,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const ADMIN_NAV = [
    { label: "Dashboard", to: "/admin", icon: BarChart3 },
    { label: "Institutions", to: "/admin/schools", icon: Building2 },
    { label: "User Directory", to: "/admin/users", icon: Users },
    { label: "Security Keys", to: "/admin/roles", icon: Key },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r bg-card flex-col sticky top-0 h-screen">
        {/* BRANDING */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold tracking-tight text-lg">
              Kinder<span className="text-primary">Hub</span>
            </span>
          </div>
        </div>

        <Separator className="px-6" />

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/admin" }}
              activeProps={{
                className: "bg-secondary text-secondary-foreground",
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* FOOTER / USER */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <Avatar className="h-9 w-9 rounded-lg border">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate leading-none">
                Admin User
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                Super Admin
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 border-b bg-background/95 backdrop-blur sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="relative w-96 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search global records..."
              className="pl-10 bg-muted/50 border-none h-9 focus-visible:ring-1 ring-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell size={18} className="text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings size={18} className="text-muted-foreground" />
            </Button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
