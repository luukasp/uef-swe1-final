import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, ChevronRight, MessagesSquare, Search } from "lucide-react";

export const Route = createFileRoute("/stuff/messages/")({
  component: StuffMessagesIndex,
});

type ThreadDto = {
  id: string;
  title: string;
  lastMessageAt: string;
  unreadCount: number;
  preview: string;
};

function StuffMessagesIndex() {
  const [query, setQuery] = useState("");

  const [threads] = useState<ThreadDto[]>([
    {
      id: "butterfly",
      title: "Butterfly group — parents",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 2,
      preview: "Hi! Could you confirm tomorrow’s outdoor schedule?",
    },
    {
      id: "general",
      title: "General questions",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      unreadCount: 0,
      preview: "Thanks for the update!",
    },
    {
      id: "billing",
      title: "Administration",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      unreadCount: 1,
      preview: "Please review the new policy draft.",
    },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter((t) => t.title.toLowerCase().includes(q));
  }, [query, threads]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <MessagesSquare className="h-6 w-6 text-primary" />
            Messages
          </h1>
          <p className="text-sm text-muted-foreground">
            Prototype inbox layout. Wire to backend later.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search threads…"
              className="h-10 w-72 rounded-md border bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <button
            type="button"
            className="h-10 rounded-md bg-primary px-3 text-sm text-primary-foreground"
          >
            New
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-1 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-6 py-4">
            <h2 className="font-semibold">Threads</h2>
          </div>

          <div className="p-3">
            <div className="space-y-2">
              {filtered.map((t) => (
                <Link
                  key={t.id}
                  to="/stuff/messages/$threadId"
                  params={{ threadId: t.id }}
                  className="block rounded-xl border bg-background p-4 hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{t.title}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {t.preview}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {t.unreadCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                          <Bell className="h-3 w-3" />
                          {t.unreadCount}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(t.lastMessageAt).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="md:col-span-2 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-6 py-4">
            <h2 className="font-semibold">Conversation</h2>
          </div>
          <div className="p-6">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-sm font-medium">Select a thread</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a thread from the left to see messages. This is a layout
                prototype.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
