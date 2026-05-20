import { authClient } from "@/lib/auth/better-auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

// Updated to match your Better Auth schema roles
type AllowedRole = "admin" | "teacher" | "user";

export function useRoles(allowedRoles: AllowedRole | AllowedRole[]) {
  const navigate = useNavigate();

  // Better Auth uses 'isPending' instead of 'isLoading'
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userRole = user?.role?.toLowerCase();

  useEffect(() => {
    // 1. Critical: Do nothing while the session is still loading
    if (isPending) return;

    // 2. If no user is found after loading, bounce to login
    if (!user) {
      navigate({ to: "/auth/login" });
      return;
    }

    // 3. Logic for role validation
    const rolesArray = Array.isArray(allowedRoles)
      ? allowedRoles
      : [allowedRoles];

    const hasAccess = userRole && rolesArray.includes(userRole as AllowedRole);

    if (!hasAccess) {
      console.warn(
        `Unauthorized. User role: ${userRole}. Required: ${allowedRoles}`,
      );

      // 4. Smart Redirection based on your Better Auth roles
      if (userRole === "admin") navigate({ to: "/admin" });
      else if (userRole === "teacher") navigate({ to: "/teachers" });
      else if (userRole === "user")
        navigate({ to: "/parents" }); // "user" role goes to /parents
      else navigate({ to: "/" });
    }
  }, [user, userRole, isPending, allowedRoles, navigate]);

  return {
    user,
    role: userRole,
    // Renamed for your component compatibility
    isLoadingRole: isPending,
  };
}
