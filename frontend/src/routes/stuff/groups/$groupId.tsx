import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  ClipboardList,
  Plus,
  User,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/stuff/groups/$groupId")({
  component: StuffGroupDetail,
});

type ChildDto = {
  id: string;
  firstName: string;
  lastName: string;
  dob?: string;
};

type GroupDetailDto = {
  id: string;
  name: string;
  teacherName: string;
  room?: string;
  scheduleNote?: string;
  children: ChildDto[];
};

function StuffGroupDetail() {
  const { groupId } = Route.useParams();

  const [group] = useState<GroupDetailDto>({
    id: groupId,
    name: "Butterfly class",
    teacherName: "Maria Teacher",
    room: "Room 2B",
    scheduleNote: "Outdoor play after morning snack.",
    children: [
      { id: "c-1", firstName: "Emma", lastName: "Example", dob: "2019-04-01" },
      { id: "c-2", firstName: "Noah", lastName: "Example", dob: "2018-11-12" },
      { id: "c-3", firstName: "Ava", lastName: "Example", dob: "2019-08-23" },
    ],
  });

  const sortedChildren = useMemo(() => {
    return [...group.children].sort((a, b) =>
      `${a.lastName} ${a.firstName}`.localeCompare(
        `${b.lastName} ${b.firstName}`,
      ),
    );
  }, [group.children]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Link
            to="/stuff/groups"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to groups
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Users className="h-6 w-6 text-primary" />
            {group.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Prototype group detail view.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
          >
            <ClipboardList className="h-4 w-4" />
            Attendance
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
          >
            <Calendar className="h-4 w-4" />
            Schedule
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add child
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-6 py-4">
            <h2 className="font-semibold">Children</h2>
          </div>

          <div className="divide-y">
            {sortedChildren.map((c) => (
              <div key={c.id} className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        DOB: {c.dob || "—"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Details
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Today</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                        <Check className="h-3 w-3" />
                      </span>
                      Present (prototype)
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No notes.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-4">
              <h2 className="font-semibold">Group info</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Teacher</p>
                <p className="mt-1 text-sm font-medium">{group.teacherName}</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Room</p>
                <p className="mt-1 text-sm font-medium">{group.room || "—"}</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Schedule note</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {group.scheduleNote || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-4">
              <h2 className="font-semibold">Quick actions</h2>
            </div>
            <div className="p-6 space-y-2">
              <button
                type="button"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
              >
                Message parents
              </button>
              <button
                type="button"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
              >
                Create post for group
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
