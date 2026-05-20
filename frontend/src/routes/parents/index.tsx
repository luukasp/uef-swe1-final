import { createFileRoute } from "@tanstack/react-router";
import {
  Baby,
  XCircle,
  Clock,
  FileText,
  Utensils,
  MessageSquare,
  Loader2, // Added for better loading UI
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChildCard } from "@/components/ChildCard";
import type { Child } from "@/lib/types";
import { useRoles } from "@/hooks/useRoles";

export const Route = createFileRoute("/parents/")({
  component: ParentIndex,
});

function ParentIndex() {
  // 1. FIX: Changed "teacher" to "parent"
  const { user, isLoadingRole } = useRoles("user");
  const queryClient = useQueryClient();

  // 2. Fetching Children
  const {
    data: children,
    isLoading: isLoadingChildren,
    isRefetching,
  } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_LINK}/child/mine`, {
        credentials: "include",
      });
      const json = await res.json();
      return json.data;
    },
    // Only fetch if we are sure the user is a parent
    enabled: !!user,
  });

  // 3. Attendance Mutation
  const attendanceMutation = useMutation({
    mutationFn: async (payload: { childId: string; body: any }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_LINK}/attendance/child/${payload.childId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload.body),
        },
      );
      if (!res.ok) throw new Error("Failed to update attendance");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });

  // 4. COMBINED LOADING STATE
  // We check for BOTH the role verification and the initial data fetch
  if (isLoadingRole || (isLoadingChildren && !children)) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-black tracking-tighter uppercase text-xs animate-pulse">
          Loading Family Records...
        </p>
      </div>
    );
  }

  // Security Fallback
  if (!user) return null;

  return (
    <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Hi, <span className="text-primary">{user.name.split(" ")[0]}!</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage your children's daily status and school updates.
          </p>
        </div>

        {isRefetching && (
          <Badge variant="secondary" className="animate-pulse rounded-full">
            Syncing Status...
          </Badge>
        )}
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT: Children Grid */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Baby className="text-primary" size={24} />
                <h2 className="text-xl font-bold">Linked Children</h2>
              </div>
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 border-primary/20 text-primary bg-primary/5"
              >
                {children?.length || 0} Registered
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {children?.map((child: Child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  mutation={attendanceMutation}
                />
              ))}
            </div>

            {children?.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed rounded-[3rem] bg-muted/20">
                <p className="font-bold text-muted-foreground">
                  No children linked to this account.
                </p>
              </div>
            )}
          </section>

          {/* Weekly Menu Section */}
          <section className="bg-primary/5 border-2 border-dashed border-primary/20 p-8 rounded-[3rem] group hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-3 mb-2 text-primary">
              <Utensils
                size={24}
                className="group-hover:rotate-12 transition-transform"
              />
              <h3 className="font-bold">Weekly Menu</h3>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Food RSS feed integration coming soon. You'll be able to see
              what's for lunch every day!
            </p>
          </section>
        </div>

        {/* RIGHT: Quick Actions Sidebar */}
        <aside className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-primary" size={20} />
            <h2 className="font-bold">Quick Actions</h2>
          </div>

          <div className="grid gap-3">
            <ActionButton
              icon={<XCircle className="text-destructive" size={18} />}
              label="Report Future Absence"
              description="Inform school about upcoming holidays"
            />
            <ActionButton
              icon={<MessageSquare className="text-blue-500" size={18} />}
              label="Contact Teacher"
              description="Direct message to the group head"
            />
            <ActionButton
              icon={<FileText className="text-orange-500" size={18} />}
              label="Tax Documents"
              description="Download yearly payment receipts"
            />
          </div>

          <div className="bg-primary p-6 rounded-[2.5rem] text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-1">Need Help?</h3>
              <p className="text-xs opacity-80 mb-4">
                Our support team is available 8am - 4pm.
              </p>
              <Button
                variant="secondary"
                className="w-full rounded-2xl font-bold shadow-lg"
              >
                Contact Admin
              </Button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
          </div>
        </aside>
      </div>
    </div>
  );
}

// ActionButton Helper stays the same...

function ActionButton({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button className="flex items-start gap-4 p-4 bg-card border-2 border-border/50 rounded-3xl hover:border-primary/30 hover:bg-primary/5 transition-all text-left w-full group outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <div className="mt-1 p-2 rounded-xl bg-muted group-hover:bg-background transition-colors">
        {icon}
      </div>
      <div>
        <p className="font-bold text-sm group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-[10px] text-muted-foreground font-medium leading-tight">
          {description}
        </p>
      </div>
    </button>
  );
}
