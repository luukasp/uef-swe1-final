import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  MessageCircle,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  XCircle,
  StickyNote,
} from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type ChildRecord = {
  id: string;
  name: string;
  status: "present" | "absent" | "late";
  parentName: string;
  lastCheckIn: string;
  notes: string;
};

const MOCK_DATA: ChildRecord[] = [
  {
    id: "1",
    name: "Emma Thompson",
    status: "present",
    parentName: "Sarah Thompson",
    lastCheckIn: "08:15 AM",
    notes: "Peanut allergy",
  },
  {
    id: "2",
    name: "Liam Garcia",
    status: "absent",
    parentName: "Carlos Garcia",
    lastCheckIn: "-",
    notes: "Family vacation",
  },
  {
    id: "3",
    name: "Sophia Chen",
    status: "present",
    parentName: "Wei Chen",
    lastCheckIn: "08:45 AM",
    notes: "",
  },
  {
    id: "4",
    name: "Noah Wilson",
    status: "late",
    parentName: "James Wilson",
    lastCheckIn: "09:30 AM",
    notes: "Dentist appointment",
  },
];

function AdminDashboard() {
  const [search, setSearch] = useState("");

  const filteredChildren = MOCK_DATA.filter((child) =>
    child.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* --- STATS OVERVIEW --- */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Present</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Absences</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Reported via app</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <StickyNote className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              New notes from parents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- ATTENDANCE LIST --- */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daily Attendance</CardTitle>
              <CardDescription>
                Manage children check-ins and parental contact.
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Child
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search children..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChildren.map((child) => (
                <TableRow key={child.id}>
                  <TableCell className="font-medium">{child.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        child.status === "present"
                          ? "default"
                          : child.status === "absent"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {child.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{child.parentName}</TableCell>
                  <TableCell>{child.lastCheckIn}</TableCell>
                  <TableCell className="max-w-[150px] truncate italic text-muted-foreground">
                    {child.notes || "None"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Message Parent"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="View Details">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
