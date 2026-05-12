import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Eye,
  FileDown,
  Globe,
  Lock,
  Pin,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/stuff/posts/$postId")({
  component: StuffPostDetail,
});

type PostDto = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  pinned?: boolean;
  audience: "group" | "all";
  groupName?: string;
  attachments?: { name: string; size: string }[];
};

function StuffPostDetail() {
  const { postId } = Route.useParams();

  const [post] = useState<PostDto>({
    id: postId,
    title: "Outdoor day tomorrow",
    body: "Please remember weather-appropriate clothing and a spare pair of gloves.\n\nWe will go outside after morning snack. If it rains heavily, we will stay indoors and do crafts.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    pinned: true,
    audience: "group",
    groupName: "Butterfly class",
    attachments: [{ name: "what-to-bring.pdf", size: "180 KB" }],
  });

  const audienceLabel = useMemo(() => {
    return post.audience === "all" ? "All parents" : post.groupName || "Group";
  }, [post.audience, post.groupName]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Link
            to="/stuff/posts"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to posts
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {post.pinned && (
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                <Pin className="h-3 w-3" />
                Pinned
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              {post.audience === "all" ? (
                <Globe className="h-3 w-3" />
              ) : (
                <Users className="h-3 w-3" />
              )}
              {audienceLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Prototype detail view. Editing/publishing is disabled.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
          >
            <FileDown className="h-4 w-4" />
            Export
          </button>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground opacity-60"
            title="Disabled in prototype"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-6 py-4">
            <h2 className="font-semibold">Content</h2>
          </div>
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-sm text-foreground">
                {post.body}
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-4">
              <h2 className="font-semibold">Status</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">Visibility</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Published
                </p>
              </div>
              {post.updatedAt && (
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Last updated</p>
                  <p className="mt-1 text-sm font-medium">
                    {new Date(post.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-6 py-4">
              <h2 className="font-semibold">Attachments</h2>
            </div>
            <div className="p-6 space-y-2">
              {post.attachments && post.attachments.length > 0 ? (
                post.attachments.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between rounded-lg border bg-background p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.size}</p>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                    >
                      Download
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No attachments.</p>
              )}

              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
              >
                Upload
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
