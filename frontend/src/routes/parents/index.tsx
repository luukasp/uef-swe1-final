"use client";
// eslint-disable-next-line import/no-duplicates
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  MessageCircle,
  UserCheck,
  Utensils,
  ChevronDown,
} from "lucide-react";
// eslint-disable-next-line import/no-duplicates
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFeed, type FeedItem } from "@/lib/rss_feed";
import { apiGet, type ApiEnvelope } from "@/lib/api";

type ChildDto = {
  id: string;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: string;
  medicalInfo?: string;
};

type AttendanceDto = {
  id: string;
  status: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
  attendance_date?: string;
  child_id: string;
};

// Basic HTML sanitizer that removes <script>/<style> and on* attributes, and javascript: URLs.
// This is intentionally minimal but sufficient for trusted-feeds like the catering RSS.
function sanitizeHtml(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove script and style elements
    const dangerous = doc.querySelectorAll("script, style");
    dangerous.forEach((n) => n.remove());

    // Remove event handler attributes and javascript: URLs
    const all = doc.querySelectorAll("*");
    all.forEach((el) => {
      // Remove attributes starting with `on` (onclick, onerror, etc.)
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value || "";
        if (name.startsWith("on")) {
          el.removeAttribute(attr.name);
          return;
        }

        if (
          (name === "href" || name === "src") &&
          value.trim().toLowerCase().startsWith("javascript:")
        ) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return doc.body.innerHTML || "";
  } catch (e) {
    console.error("sanitizeHtml error:", e);
    return "";
  }
}

export const Route = createFileRoute("/parents/")({
  component: ParentsIndex,
});

function ParentsIndex() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  const [children, setChildren] = useState<ChildDto[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(true);
  const [attendanceByChild, setAttendanceByChild] = useState<
    Record<string, AttendanceDto[]>
  >({});
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const selectedChild = useMemo(() => {
    if (!selectedChildId) return children[0];
    return children.find((c) => c.id === selectedChildId) || children[0];
  }, [children, selectedChildId]);

  const selectedChildName = useMemo(() => {
    if (!selectedChild) return "your child";
    return `${selectedChild.firstName} ${selectedChild.lastName}`;
  }, [selectedChild]);

  const todaysAttendance = useMemo(() => {
    if (!selectedChild) return null;
    const list = attendanceByChild[selectedChild.id] || [];
    if (list.length === 0) return null;

    // Robust latest selection:
    // 1) Prefer latest by attendance_date if present
    // 2) otherwise fall back to last element
    const sorted = [...list].sort((a, b) => {
      const ad = a.attendance_date ? Date.parse(a.attendance_date) : NaN;
      const bd = b.attendance_date ? Date.parse(b.attendance_date) : NaN;
      if (!Number.isNaN(ad) && !Number.isNaN(bd)) return bd - ad;
      if (!Number.isNaN(bd)) return 1;
      if (!Number.isNaN(ad)) return -1;
      return 0;
    });

    return sorted[0] || list[list.length - 1] || null;
  }, [attendanceByChild, selectedChild]);

  useEffect(() => {
    async function loadMenu() {
      const apiBase = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
      const url = apiBase ? `${apiBase}/v1/menu/rss` : "/v1/menu/rss";
      const items = await getFeed(url);
      setFeedItems(items);
      setLoadingMenu(false);
    }
    loadMenu();
  }, []);

  useEffect(() => {
    async function loadChildrenAndAttendance() {
      try {
        setChildrenLoading(true);
        setAttendanceLoading(true);

        // GET /v1/child/ -> children for current session user
        const childRes = await apiGet<ApiEnvelope<ChildDto[]>>("/v1/child/");
        const list = childRes.data || [];
        setChildren(list);
        setChildrenLoading(false);

        // Default selection
        if (!selectedChildId && list[0]?.id) {
          setSelectedChildId(list[0].id);
        }

        // Preload attendance for all children (so switching is instant)
        const byChild: Record<string, AttendanceDto[]> = {};
        for (const c of list) {
          try {
            const attn = await apiGet<AttendanceDto[]>(
              `/v1/attendance/child/${c.id}/list`,
            );
            byChild[c.id] = attn;
          } catch (e) {
            console.error("Failed to load attendance for child", c.id, e);
            byChild[c.id] = [];
          }
        }
        setAttendanceByChild(byChild);
      } catch (e) {
        console.error("Failed to load children/attendance:", e);
      } finally {
        setChildrenLoading(false);
        setAttendanceLoading(false);
      }
    }

    loadChildrenAndAttendance();
  }, []);

  return (
    <div className="relative z-0 space-y-6">
      {/* Welcome & Child Status */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Status Card */}
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm md:col-span-2">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5 blur-2xl" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  {childrenLoading ? "Good morning!" : "Good morning!"}
                </h2>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50"
                      disabled={childrenLoading || children.length === 0}
                      title="Select child"
                    >
                      <span className="max-w-[220px] truncate">
                        {childrenLoading
                          ? "Loading children..."
                          : selectedChild
                            ? `${selectedChild.firstName} ${selectedChild.lastName}`
                            : "No child"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {children.length === 0 ? (
                      <DropdownMenuItem disabled>
                        No children found
                      </DropdownMenuItem>
                    ) : (
                      children.map((c) => (
                        <DropdownMenuItem
                          key={c.id}
                          onClick={() => setSelectedChildId(c.id)}
                        >
                          {c.firstName} {c.lastName}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="mb-6 text-muted-foreground">
                Here is your daily overview for {selectedChildName}.
              </p>

              <div className="mb-4 flex items-center gap-3 rounded-lg border bg-background/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {attendanceLoading || !todaysAttendance
                      ? `${selectedChildName} status`
                      : todaysAttendance.status === "present"
                        ? `${selectedChildName} is Present`
                        : `${selectedChildName} is ${todaysAttendance.status}`}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {attendanceLoading || !todaysAttendance
                      ? "Attendance info loading..."
                      : todaysAttendance.check_in_time
                        ? `Checked in at ${todaysAttendance.check_in_time}`
                        : "No check-in time recorded"}
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <Calendar className="h-4 w-4 text-primary" />
                      Report Absence
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Absence</DialogTitle>
                      <DialogDescription>
                        Inform the school about upcoming absences.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm text-muted-foreground">
                      Absence reporting form placeholder.
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button
                          type="button"
                          className="cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground"
                        >
                          Close
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <UserCheck className="h-4 w-4 text-green-600" />
                      Presence
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Presence Details</DialogTitle>
                      <DialogDescription>
                        Attendance logs for Emma.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm text-muted-foreground">
                      Detailed check-in/check-out history for Emma.
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button
                          type="button"
                          className="cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground"
                        >
                          Close
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="hidden h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-background shadow-md sm:block">
              <img
                src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(selectedChildName)}`}
                alt="Child avatar"
                className="h-full w-full bg-primary/10 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Quick Actions</h3>
          <div className="grid h-full grid-cols-2 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-muted/50 p-3 text-center text-sm transition-colors hover:bg-muted"
                >
                  <Utensils className="h-5 w-5 text-orange-500" />
                  Meal Menu
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Today's Meal Menu</DialogTitle>
                  <DialogDescription>
                    What's on the menu today.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
                  {loadingMenu ? (
                    <div className="text-center text-sm text-muted-foreground p-4">
                      Loading menu...
                    </div>
                  ) : feedItems.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground p-4">
                      No menu items found.
                    </div>
                  ) : (
                    feedItems.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border bg-muted/20 p-3"
                      >
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          <p className="text-sm font-medium">{item.title}</p>
                        </a>
                        {item.contentSnippet && (
                          <div className="text-xs text-muted-foreground mt-1 prose max-w-none">
                            {/**
                             * The description often contains meal labels separated with <br>.
                             * We'll parse the sanitized HTML and split into blocks by double <br> or by the label words.
                             */}
                            {(() => {
                              const sanitized = sanitizeHtml(
                                item.contentSnippet,
                              );
                              const tmp = document.createElement("div");
                              tmp.innerHTML = sanitized;

                              // Convert <br> into newline markers then split
                              tmp.querySelectorAll("br").forEach((b) => {
                                const n = document.createTextNode("\n");
                                b.replaceWith(n);
                              });

                              const text = tmp.textContent || "";

                              // Heuristic: split on two newlines or on meal labels like 'Aamupala', 'Lounas', 'Välipala', 'Päivällinen', 'Iltapala'
                              const parts = text
                                .split(
                                  /\n\n+|(?=Aamupala|Lounas|Välipala|Päivällinen|Iltapala)/,
                                )
                                .map((p) => p.trim())
                                .filter(Boolean);

                              return (
                                <div className="space-y-2">
                                  {parts.map((p, i) => (
                                    <div
                                      key={i}
                                      className="rounded-md border bg-muted/10 p-2"
                                    >
                                      <p className="text-xs leading-snug whitespace-pre-line">
                                        {p}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground"
                    >
                      Close
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Link
              to="/parents/message"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-muted/50 p-3 text-center text-sm transition-colors hover:bg-muted"
            >
              <MessageCircle className="h-5 w-5 text-blue-500" />
              Contact Teacher
            </Link>

            <button
              type="button"
              className="col-span-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-muted/50 p-3 text-center text-sm transition-colors hover:bg-muted"
            >
              <AlertCircle className="h-5 w-5 text-destructive" />
              Emergencies
            </button>
          </div>
        </div>
      </div>

      {/* Kindergarten Data / Daily Updates */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Schedule */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-6 py-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Today's Schedule (Butterfly Class)
            </h3>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-xl border bg-muted/10 p-4">
              <p className="text-sm font-semibold mb-2">Today's food</p>
              {loadingMenu ? (
                <p className="text-sm text-muted-foreground">Loading menu...</p>
              ) : feedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No menu items found.
                </p>
              ) : (
                <div className="space-y-2">
                  {(() => {
                    // Use the first item (typically today's menu)
                    const item = feedItems[0];
                    if (!item?.contentSnippet) {
                      return (
                        <p className="text-sm text-muted-foreground">
                          Menu details unavailable.
                        </p>
                      );
                    }

                    const sanitized = sanitizeHtml(item.contentSnippet);
                    const tmp = document.createElement("div");
                    tmp.innerHTML = sanitized;
                    tmp.querySelectorAll("br").forEach((b) => {
                      const n = document.createTextNode("\n");
                      b.replaceWith(n);
                    });
                    const text = tmp.textContent || "";
                    const parts = text
                      .split(
                        /\n\n+|(?=Aamupala|Lounas|Välipala|Päivällinen|Iltapala)/,
                      )
                      .map((p) => p.trim())
                      .filter(Boolean);

                    return parts.slice(0, 6).map((p, i) => (
                      <div
                        key={i}
                        className="rounded-md border bg-background p-2"
                      >
                        <p className="text-xs whitespace-pre-line leading-snug">
                          {p}
                        </p>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>

            <div className="relative ml-3 space-y-6 border-l-2 border-muted">
              <div className="relative pl-6">
                <div className="absolute top-1.5 -left-1.25 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                <p className="text-sm font-medium">08:00 - 09:00</p>
                <p className="text-sm text-muted-foreground">
                  Arrival & Free Play
                </p>
              </div>
              <div className="relative pl-6">
                <div className="absolute top-1.5 -left-1.25 h-2 w-2 rounded-full border-2 border-primary bg-background ring-4 ring-background" />
                <p className="text-sm font-medium">
                  09:30 - 10:30{" "}
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    Current
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Arts & Crafts Activity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <ImageIcon className="h-4 w-4 text-primary" />
              Recent Updates
            </h3>
            <Link
              to="/parents/news"
              className="cursor-pointer text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4 p-6">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-sm font-medium">Maria (Teacher)</p>
              <p className="mb-2 text-xs text-muted-foreground">
                Today at 9:45 AM
              </p>
              <p className="text-sm">
                Emma is doing great today! She painted a lovely butterfly. 🦋
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
