import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Clock,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  CalendarDays,
  Loader2, // Added for a nice loading spinner
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/hooks/useRoles";

export const Route = createFileRoute("/teachers/")({
  component: TeacherDashboard,
});

export default function TeacherDashboard() {
  // 1. Call the hook with the required role
  const { user, isLoadingRole } = useRoles("teacher");

  // 2. CRITICAL: Handle the loading state
  // This prevents the page from flickering or crashing while the session is fetched
  if (isLoadingRole) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="text-muted-foreground font-black tracking-tighter uppercase text-xs">
          Verifying Teacher Credentials...
        </p>
      </div>
    );
  }

  // 3. Security Fallback
  // If useRoles didn't redirect yet but user is missing, don't render the dashboard
  if (!user) return null;

  const stats = [
    {
      label: "Students Present",
      value: "18/22",
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-100/70",
    },
    {
      label: "Pending Check-ins",
      value: "4",
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-100/70",
    },
    {
      label: "Incident Reports",
      value: "0",
      icon: AlertCircle,
      color: "text-green-600",
      bg: "bg-green-100/70",
    },
  ];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Hi,{" "}
            <span className="text-orange-500">
              {user.name.split(" ")[0]}! {/* Greets with first name */}
            </span>
          </h1>
          <p className="text-muted-foreground font-bold mt-2 flex items-center gap-2">
            <CalendarDays size={18} className="text-orange-400" />
            Friday, May 15, 2026 — Morning Session
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl h-12 px-6 transition-transform hover:scale-105 active:scale-95">
          Start Group Activity
        </Button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-2 rounded-[2rem] overflow-hidden group hover:border-orange-200 transition-all hover:shadow-sm"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className={`text-3xl font-black mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div
                className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:rotate-12 transition-transform`}
              >
                <stat.icon className={stat.color} size={28} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Check-ins */}
        <Card className="lg:col-span-2 border-2 rounded-[2.5rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-xl font-black">
              Morning Roll Call
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              View All <ArrowUpRight size={16} className="ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Leo Thompson", time: "08:15 AM", status: "Present" },
                { name: "Sophie Chen", time: "08:22 AM", status: "Present" },
                { name: "Marcus Wright", time: "---", status: "Missing" },
              ].map((student, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-orange-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-400 flex items-center justify-center text-white font-black">
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Arrived: {student.time}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      student.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className="border-2 rounded-[2.5rem] bg-orange-50/50 border-orange-100 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <CheckCircle2 className="text-orange-500" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border-2 border-orange-100/50 shadow-sm">
              <p className="text-xs font-black text-orange-600 uppercase mb-1">
                Coming Up
              </p>
              <p className="text-sm font-bold">Lunch Prep - 11:30 AM</p>
              <p className="text-xs text-muted-foreground mt-1">
                Check for Peanut Allergy alerts in Group B.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border-2 border-orange-100/50 shadow-sm opacity-60">
              <p className="text-xs font-black text-muted-foreground uppercase mb-1">
                Completed
              </p>
              <p className="text-sm font-bold line-through">
                Outdoor Play Safety Sweep
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
