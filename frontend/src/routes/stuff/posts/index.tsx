import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronRight,
  FileText,
  Filter,
  LayoutGrid,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/stuff/posts/")({
  component: StuffPostsIndex,
});

type PostDto = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  pinned?: boolean;
  audience: "group" | "all";
  groupName?: string;
  attachments?: number;
};

function StuffPostsIndex() {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState<"all" | "group" | "any">("any");

  const [posts] = useState<PostDto[]>([
    {
      id: "p-1",
      title: "Outdoor day tomorrow",
      body: "Please remember weather-appropriate clothing and a spare pair of gloves.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      pinned: true,
      audience: "group",
      groupName: "Butterfly class",
      attachments: 1,
    },
    {
      id: "p-2",
      title: "Reminder: pickup times",
      body: "Pickup is between 15:00–16:30. If you are late, call the daycare office.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      audience: "all",
      attachments: 0,
    },
    {
      id: "p-3",
      title: "Snack list update",
      body: "We updated the snack options for next week. Please tell us about allergies.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      audience: "group",
      groupName: "Ladybug class",
      attachments: 0,
    },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts
      .filter((p) => (audience === "any" ? true : p.audience === audience))
      .filter((p) => (q ? p.title.toLowerCase().includes(q) : true));
  }, [posts, query, audience]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <FileText className="h-6 w-6 text-primary" />
            Posts / Updates
          </h1>
          <p className="text-sm text-muted-foreground">
            Prototype layout for announcements. Wire to backend later.
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
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
          >
            New Post
          </button>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts…"
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="md:col-span-1 flex items-center gap-2">
          <div className="inline-flex h-10 flex-1 items-center gap-2 rounded-md border bg-background px-3 text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as any)}
              className="h-9 w-full bg-transparent outline-none"
            >
              <option value="any">All audiences</option>
              <option value="group">Group only</option>
              <option value="all">All parents</option>
            </select>
          </div>
          <button
            type="button"
            className="h-10 rounded-md border bg-background px-3 text-sm hover:bg-muted"
          >
            Export
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-muted/30 px-6 py-4">
          <h2 className="font-semibold">Recent posts</h2>
        </div>

        <div className="divide-y">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to="/stuff/posts/$postId"
              params={{ postId: p.id }}
              className="block p-6 hover:bg-muted/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {p.pinned && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Pinned
                      </span>
                    )}
                    <h3 className="truncate text-sm font-semibold">
                      {p.title}
                    </h3>
                    <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                      {p.audience === "all" ? "All" : p.groupName || "Group"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {p.body}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.createdAt).toLocaleString()}
                    {typeof p.attachments === "number" && (
                      <span>• {p.attachments} attachment(s)</span>
                    )}
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
