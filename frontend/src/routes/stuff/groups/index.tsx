import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  LayoutGrid,
  Plus,
  Search,
  Users,
  WandSparkles,
} from "lucide-react";

export const Route = createFileRoute("/stuff/groups/")({
  component: StuffGroupsIndex,
});

type GroupDto = {
  id: string;
  name: string;
  teacherName: string;
  childrenCount: number;
};

function StuffGroupsIndex() {
  const [query, setQuery] = useState("");

  const [groups] = useState<GroupDto[]>([
    {
      id: "g-1",
      name: "Butterfly class",
      teacherName: "Maria Teacher",
      childrenCount: 18,
    },
    {
      id: "g-2",
      name: "Ladybug class",
      teacherName: "John Teacher",
      childrenCount: 16,
    },
    {
      id: "g-3",
      name: "Bears class",
      teacherName: "Sara Teacher",
      childrenCount: 20,
    },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }, [groups, query]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Users className="h-6 w-6 text-primary" />
            Groups
          </h1>
          <p className="text-sm text-muted-foreground">
            Prototype layout for group management.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/stuff"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
          >
            <LayoutGrid className="h-4 w-4" />
            Dashboard
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
          >
            <WandSparkles className="h-4 w-4" />
            Auto-assign
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            New group
          </button>
        </div>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search groups…"
          className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-muted/30 px-6 py-4">
          <h2 className="font-semibold">All groups</h2>
        </div>

        <div className="divide-y">
          {filtered.map((g) => (
            <Link
              key={g.id}
              to="/stuff/groups/$groupId"
              params={{ groupId: g.id }}
              className="block p-6 hover:bg-muted/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{g.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Teacher: {g.teacherName} • {g.childrenCount} children
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
