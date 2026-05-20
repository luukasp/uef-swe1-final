import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import {
  Baby,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sun,
  Moon,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { AttendancePayload, Child } from "@/lib/types";

const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

interface ChildCardProps {
  child: Child;
  mutation: UseMutationResult<any, Error, AttendancePayload, unknown>;
}

export function ChildCard({ child, mutation }: ChildCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [justification, setJustification] = useState("On time");
  const [checkInTime, setCheckInTime] = useState("08:00");
  const [checkOutTime, setCheckOutTime] = useState("16:00");

  const handleSubmit = (status: boolean) => {
    const today = new Date().toISOString().split("T")[0];

    const payload = {
      childId: child.id,
      body: {
        attendance_date: today,
        check_in_time: timeToMinutes(checkInTime),
        check_out_time: timeToMinutes(checkOutTime),
        status: status,
        justification: justification,
      },
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        setIsOpen(false);
        toast.success(`Updated status for ${child.first_name}`);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <Card className="group relative border-2 rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all duration-500 border-border/40 bg-card flex flex-col">
      <CardContent className="p-4 flex flex-col flex-1">
        {/* TOP ROW: Identity & Basic Status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner transition-all duration-500 ${
                  child.is_present
                    ? "bg-green-500 text-white rotate-3"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                {child.first_name[0]}
              </div>
              {child.is_present && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-border/20">
                  <Heart size={10} className="fill-red-500 text-red-500" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <h3 className="font-black text-lg tracking-tight leading-none text-foreground/90">
                {child.first_name}{" "}
                <span className="hidden sm:inline font-bold opacity-70">
                  {child.last_name}
                </span>
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  className={`text-[9px] px-2 py-0 h-5 border-none font-black uppercase tracking-tighter shadow-none ${
                    child.is_present
                      ? "bg-green-500 text-white"
                      : "bg-destructive text-white"
                  }`}
                >
                  {child.is_present ? "Present" : "Absent"}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/80">
                  <Sun size={10} className="text-orange-400" /> {checkInTime}
                  <span className="opacity-30">|</span>
                  <Moon size={10} className="text-blue-400" /> {checkOutTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Full-Width Update Trigger */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="w-full rounded-2xl font-black text-xs h-11 gap-2 hover:bg-primary hover:text-white transition-all shadow-sm border-2 border-transparent group-hover:border-primary/20 mt-auto"
            >
              Update Attendance
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Button>
          </DialogTrigger>

          <DialogContent className="rounded-[3rem] sm:max-w-[400px] p-8 border-none shadow-2xl overflow-hidden">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-primary/5 rounded-full" />

            <DialogHeader className="relative z-10">
              <DialogTitle className="text-2xl font-black flex items-center gap-3 text-foreground">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Baby className="text-primary" size={24} />
                </div>
                Daily Check-In
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1">
                    <Sun size={12} /> Arrival
                  </Label>
                  <Input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="rounded-xl border-2 h-12 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1">
                    <Moon size={12} /> Departure
                  </Label>
                  <Input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="rounded-xl border-2 h-12 focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                  Justification / Notes
                </Label>
                <Input
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="e.g. Traffic, Early Pickup"
                  className="rounded-xl border-2 h-12 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 relative z-10">
              <Button
                variant="outline"
                className="flex-1 rounded-xl font-bold h-12 border-2 border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all order-2 sm:order-1"
                onClick={() => handleSubmit(false)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Absent"
                )}
              </Button>
              <Button
                className="flex-1 rounded-xl font-bold h-12 bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform order-1 sm:order-2"
                onClick={() => handleSubmit(true)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Present"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Subtle Decorative Icon */}
        <Baby className="absolute -right-2 top-4 h-14 w-14 text-primary/[0.04] -rotate-12 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
      </CardContent>
    </Card>
  );
}
