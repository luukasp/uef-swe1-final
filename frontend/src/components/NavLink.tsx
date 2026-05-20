// NavLink.tsx
import { Link } from "@tanstack/react-router";
import { type NavRoute } from "./Navbar";

function NavLink({
  route,
  isTeacher,
}: {
  route: NavRoute;
  isTeacher: boolean;
}) {
  const Icon = route.icon;
  const activeBg = isTeacher ? "bg-orange-500" : "bg-primary";

  return (
    <Link
      to={route.to}
      /** * CRITICAL FIX:
       * We use 'exact: true' so that the Dashboard doesn't stay highlighted
       * when you are on other sub-pages like /teachers/class.
       */
      activeOptions={{ exact: true }}
      activeProps={{
        className: `${activeBg} text-white`,
      }}
      inactiveProps={{
        className: "text-muted-foreground hover:bg-muted hover:text-foreground",
      }}
      className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black transition-all duration-200 active:scale-95"
    >
      <Icon size={18} strokeWidth={2.5} />
      {route.label}
    </Link>
  );
}

export default NavLink;
