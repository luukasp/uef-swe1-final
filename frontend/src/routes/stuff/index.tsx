import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { apiGet, type ApiEnvelope } from "@/lib/api";
import {
  Bell,
  Calendar,
  ChevronRight,
  Inbox,
  LayoutGrid,
  MessagesSquare,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/stuff/")({
  component: StuffIndex,
});

type GroupDto = {
  id: string;
  teacher_id: string;
};

type MessageThreadDto = {
  id: string;
  title: string;
  lastMessageAt: string; // ISO
  unreadCount: number;
};

type PostDto = {
  id: string;
  title: string;
  body: string;
  createdAt: string; // ISO
  audience: "group" | "all";
};

function StuffIndex() {
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState<string | null>(null);

  // Placeholder data for posts/messages until backend endpoints exist
  const [threads] = useState<MessageThreadDto[]>([
    {
      id: "t-1",
      title: "Parent messages (Butterfly class)",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 2,
    },
    {
      id: "t-2",
      title: "General questions",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      unreadCount: 0,
    },
  ]);

  const [posts] = useState<PostDto[]>([
    {
      id: "p-1",
      title: "Outdoor day tomorrow",
      body: "Please remember weather-appropriate clothing and a spare pair of gloves.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      audience: "group",
    },
    {
      id: "p-2",
      title: "Reminder: pickup times",
      body: "Pickup is between 15:00–16:30. If you are late, call the daycare office.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      audience: "all",
    },
  ]);

  useEffect(() => {
    async function loadGroups() {
      try {
        setGroupsLoading(true);
        setGroupsError(null);

        // Existing backend route: GET /api/v1/group
        // Client path should be /v1/group (api.ts maps /v1 -> /api/v1)
        const res = await apiGet<ApiEnvelope<GroupDto[]>>("/v1/group");
        setGroups(res.data || []);
      } catch (err: any) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string"
              ? err
              : JSON.stringify(err);
        setGroupsError(message);
      } finally {
        setGroupsLoading(false);
      }
    }

    loadGroups();
  }, []);

  const myGroups = useMemo(() => {
    // Until backend provides "assigned groups" endpoint, we just show everything.
    // Later you can filter by teacher_id === sessionUserId.
    return groups;
  }, [groups]);

  return (
    <div className="space-y-6 p-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Messages, posts, and your assigned groups.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/stuff/posts"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
            title="Create a new post"
          >
            <LayoutGrid className="h-4 w-4" />
            New Post
          </Link>
          <Link
            to="/stuff/messages"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
            title="Open inbox"
          >
            <Inbox className="h-4 w-4" />
            Inbox
          </Link>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Assigned Groups */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm md:col-span-1">
          <div className="border-b bg-muted/30 px-6 py-4">
            <h2 className="flex items-center gap-2 font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Assigned Groups
            </h2>
          </div>
          <div className="p-6">
            {groupsLoading ? (
              <p className="text-sm text-muted-foreground">Loading groups…</p>
            ) : groupsError ? (
              <p className="text-sm text-destructive">{groupsError}</p>
            ) : myGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No groups found.</p>
            ) : (
              <div className="space-y-2">
                {myGroups.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between rounded-lg border bg-background p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">Group {g.id}</p>
                      <p className="text-xs text-muted-foreground">
                        Teacher: {g.teacher_id}
                      </p>
                    </div>
                    <Link
                      to="/stuff/groups/$groupId"
                      params={{ groupId: g.id }}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Messages */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm md:col-span-2">
          <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
            <h2 className="flex items-center gap-2 font-semibold">
              <MessagesSquare className="h-4 w-4 text-primary" />
              Messages
            </h2>
            <Link
              to="/stuff/messages"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {threads.map((t) => (
                <div
                  key={t.id}
                  className="flex items-start justify-between rounded-xl border bg-background p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last message: {new Date(t.lastMessageAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    {t.unreadCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        <Bell className="h-3 w-3" />
                        {t.unreadCount}
                      </span>
                    )}
                    <Link
                      to="/stuff/messages/$threadId"
                      params={{ threadId: t.id }}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Open
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border bg-muted/20 p-4">
              <p className="text-sm font-medium">Implementation note</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This is UI scaffolding. When you add backend messaging
                endpoints, replace the placeholder threads with `apiGet()`
                calls.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Posts */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4 text-primary" />
            Posts / Updates
          </h2>
          <Link
            to="/stuff/posts"
            className="text-sm text-primary hover:underline"
          >
            Manage
          </Link>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((p) => (
              <article
                key={p.id}
                className="rounded-xl border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleString()} • Audience:{" "}
                      {p.audience}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 rounded-xl border bg-muted/20 p-4">
            <p className="text-sm font-medium">Suggested next endpoints</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>GET /v1/staff/groups (assigned to session user)</li>
              <li>GET /v1/posts?groupId=...</li>
              <li>POST /v1/posts</li>
              <li>GET /v1/messages/threads</li>
              <li>GET /v1/messages/threads/:id</li>
              <li>POST /v1/messages/threads/:id</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
