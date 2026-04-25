import {
  createFileRoute,
  Outlet,
  useNavigate,
  useLocation,
} from "@tanstack/react-router"
import { Bell, User, ArrowLeft, CheckCheck, Moon, Sun } from "lucide-react"
import { useMemo, useState } from "react"

export const Route = createFileRoute("/parents")({
  component: ParentsLayout,
})

type NotificationItem = {
  id: string
  title: string
  time: string
  unread: boolean
}

function ParentsLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  // Theme State
  const [isDark, setIsDark] = useState(false)

  const isRootParents =
    location.pathname === "/parents" || location.pathname === "/parents/"

  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      title: "Emma checked in at 8:15 AM",
      time: "Today • 8:16 AM",
      unread: true,
    },
    {
      id: "n2",
      title: "New classroom update posted",
      time: "Today • 9:45 AM",
      unread: true,
    },
    {
      id: "n3",
      title: "Reminder: Pajamas day tomorrow",
      time: "Yesterday • 5:30 PM",
      unread: false,
    },
  ])

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  )

  const handleBack = () => navigate({ to: "/parents" })
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen`}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Parent-specific Navbar */}
        <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              {!isRootParents && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-semibold tracking-tight">
                Parent Portal
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted"
                title="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </button>

              {/* Notification Bell Container */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen((v) => !v)}
                  className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
                  )}
                </button>

                {/* Notification Panel - Now Absolute to the Button */}
                {isNotifOpen && (
                  <div className="absolute top-full right-0 z-[110] mt-2 w-80 animate-in rounded-xl border bg-card p-3 shadow-xl ring-1 ring-black/5 duration-100 zoom-in-95 fade-in">
                    <div className="mb-2 flex items-center justify-between border-b pb-2">
                      <p className="text-sm font-semibold">Notifications</p>
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="inline-flex cursor-pointer items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-72 space-y-2 overflow-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-muted-foreground">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm leading-tight font-medium">
                                {item.title}
                              </p>
                              {item.unread && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="Parent avatar"
                  className="h-full w-full bg-muted object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto max-w-5xl p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
