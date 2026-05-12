import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Info, Paperclip, Send, Shield, User } from "lucide-react";

export const Route = createFileRoute("/stuff/messages/$threadId")({
  component: StuffThread,
});

type MessageDto = {
  id: string;
  author: "staff" | "parent";
  authorName: string;
  body: string;
  createdAt: string;
};

function StuffThread() {
  const { threadId } = Route.useParams();

  const [draft, setDraft] = useState("");

  const [messages] = useState<MessageDto[]>([
    {
      id: "m-1",
      author: "parent",
      authorName: "Parent",
      body: "Hi! Could you confirm tomorrow’s outdoor schedule?",
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    },
    {
      id: "m-2",
      author: "staff",
      authorName: "You",
      body: "Yes — we’ll be outside after morning snack, weather permitting.",
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: "m-3",
      author: "parent",
      authorName: "Parent",
      body: "Great, thank you!",
      createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    },
  ]);

  const threadTitle = useMemo(() => {
    if (threadId === "butterfly") return "Butterfly group — parents";
    if (threadId === "general") return "General questions";
    if (threadId === "billing") return "Administration";
    return `Thread: ${threadId}`;
  }, [threadId]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Link
            to="/stuff/messages"
            className="mt-1 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{threadTitle}</h1>
            <p className="text-sm text-muted-foreground">
              Prototype thread view. Sending is disabled.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
            title="Thread info"
          >
            <Info className="h-4 w-4" />
            Info
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
            title="Permissions"
          >
            <Shield className="h-4 w-4" />
            Permissions
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-6 py-4">
            <h2 className="font-semibold">Messages</h2>
          </div>

          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto p-6">
            {messages.map((m) => {
              const isStaff = m.author === "staff";
              return (
                <div
                  key={m.id}
                  className={`flex ${isStaff ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl border p-4 ${
                      isStaff
                        ? "bg-primary text-primary-foreground"
                        : "bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p
                        className={`text-xs ${
                          isStaff
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {m.authorName}
                      </p>
                      <p
                        className={`text-xs ${
                          isStaff
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{m.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t bg-muted/10 p-4">
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                className="min-h-[44px] flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm"
                rows={1}
              />
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-md border bg-background px-3 text-sm hover:bg-muted"
                title="Attach file (prototype)"
              >
                <Paperclip className="h-4 w-4" />
                Attach
              </button>
              <button
                type="button"
                disabled
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm text-primary-foreground opacity-60"
                title="Sending disabled in prototype"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              This is a placeholder UI. Hook this up to a POST endpoint later.
            </p>
          </div>
        </section>

        <section className="md:col-span-1 space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-4">
              <h2 className="font-semibold">Participants</h2>
            </div>
            <div className="p-6 space-y-3">
              {[
                { name: "You", role: "Staff" },
                { name: "Parent A", role: "Parent" },
                { name: "Parent B", role: "Parent" },
              ].map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 rounded-lg border bg-background p-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-4">
              <h2 className="font-semibold">Context</h2>
            </div>
            <div className="p-6 space-y-2">
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Group</p>
                <p className="text-sm font-medium">Butterfly class</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Child</p>
                <p className="text-sm font-medium">Emma Example</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
