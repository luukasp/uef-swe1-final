"use client"
import { createFileRoute } from "@tanstack/react-router"
import {
  CheckCircle2,
  Calendar,
  Utensils,
  MessageCircle,
  AlertCircle,
  UserCheck,
  Clock,
  Image as ImageIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { Link } from "@tanstack/react-router"

export const Route = createFileRoute("/parents/")({
  component: ParentsIndex,
})

function ParentsIndex() {
  return (
    <div className="relative z-0 space-y-6">
      {/* Welcome & Child Status */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Status Card */}
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm md:col-span-2">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5 blur-2xl" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-1 text-2xl font-bold tracking-tight">
                Good morning, Sarah!
              </h2>
              <p className="mb-6 text-muted-foreground">
                Here is your daily overview for Emma.
              </p>

              <div className="mb-4 flex items-center gap-3 rounded-lg border bg-background/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    Emma is Present
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    Checked in at 8:15 AM by John Doe
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
                src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=Emma"
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
                <div className="space-y-3 py-2">
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <p className="text-sm font-medium">Breakfast: Oatmeal</p>
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <p className="text-sm font-medium">Lunch: Mac & Cheese</p>
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <p className="text-sm font-medium">Snack: Fruit Slices</p>
                  </div>
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
  )
}
