import { Link } from "@tanstack/react-router";
import {
  Baby,
  Moon,
  Sun,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NavLink from "./NavLink";

export interface NavRoute {
  label: string;
  to: string;
  icon: LucideIcon | React.ElementType;
}

interface UserData {
  name: string;
  email?: string;
  role: string;
  avatarUrl?: string;
}

interface NavbarProps {
  user: UserData | null;
  routes: NavRoute[];
  onLogout: () => void;
  onThemeToggle?: () => void;
  isDark?: boolean;
}

export function Navbar({
  user,
  routes,
  onLogout,
  onThemeToggle,
  isDark,
}: NavbarProps) {
  if (!user) return null;

  const isTeacher = user.role.toLowerCase() === "teacher";

  // Updated to Pastel Orange / Primary Blue without heavy shadows
  const brandColor = isTeacher ? "text-orange-500" : "text-primary";
  const iconBg = isTeacher ? "bg-orange-500" : "bg-primary";

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* DYNAMIC LOGO */}
        <Link
          to={isTeacher ? "/teachers" : "/parents"}
          className="flex items-center gap-2 group"
        >
          {/* Removed shadow-lg and shadow-amber-500/40 */}
          <div
            className={`p-1.5 rounded-xl group-hover:rotate-6 transition-all duration-300 ${iconBg}`}
          >
            <Baby className="text-white" size={20} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="flex gap-1">
              <span
                className={`text-xl font-black tracking-tighter text-foreground`}
              >
                Kinder
              </span>
              <span
                className={`text-xl font-black tracking-tighter ${brandColor}`}
              >
                HUB
              </span>
            </span>
            {isTeacher && (
              <span className="text-[10px] font-black text-orange-400 tracking-[0.2em] -mt-0.5 ml-0.5">
                TEACHERS
              </span>
            )}
          </div>
        </Link>

        {/* CENTER NAVIGATION */}
        <div className="hidden md:flex items-center bg-muted/40 p-1 rounded-2xl border border-border/50 gap-1">
          {routes.map((route) => (
            <NavLink key={route.to} route={route} isTeacher={isTeacher} />
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl hover:bg-muted"
            onClick={onThemeToggle}
          >
            {isDark ? (
              <Sun size={18} className="text-orange-400" />
            ) : (
              <Moon size={18} className="text-muted-foreground" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-11 flex items-center gap-3 pl-1 pr-3 rounded-2xl bg-muted/50 hover:bg-muted transition-all border border-transparent hover:border-border"
              >
                <Avatar className="h-8 w-8 rounded-xl border-2 border-background shadow-sm">
                  <AvatarFallback
                    className={`${isTeacher ? "bg-orange-500" : "bg-primary"} text-white font-black text-[10px]`}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-left leading-tight">
                  <span className="text-xs font-black text-foreground">
                    {user.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                    {user.role} Account
                  </span>
                </div>
                <ChevronDown size={14} className="opacity-50" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 mt-2 rounded-[1.8rem] p-2 shadow-xl border-2"
              align="end"
            >
              <DropdownMenuLabel className="font-bold px-3 py-3 text-[10px] text-muted-foreground uppercase tracking-widest">
                Account Settings
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 px-3 py-2.5 font-bold focus:bg-muted">
                <UserIcon size={16} className={brandColor} /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 px-3 py-2.5 font-bold focus:bg-muted">
                <Settings size={16} className={brandColor} /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="rounded-xl cursor-pointer gap-3 px-3 py-2.5 font-black text-destructive focus:bg-destructive/10"
              >
                <LogOut size={16} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
