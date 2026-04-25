import { createFileRoute } from "@tanstack/react-router";
import { Send, Search, Phone, Video, Info } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/parents/message")({
  component: RouteComponent,
});

function RouteComponent() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* --- Sidebar: Conversation List --- */}
      <div className="hidden w-80 flex-col border-r md:flex">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2">
            {[
              {
                name: "Ms. Sarah (Teacher)",
                last: "Emma had a great day!",
                time: "10:30 AM",
                active: true,
                unread: 0,
              },
              {
                name: "Admin Office",
                last: "Please sign the field trip form.",
                time: "Yesterday",
                active: false,
                unread: 1,
              },
              {
                name: "School Nurse",
                last: "Just a reminder about the...",
                time: "Mon",
                active: false,
                unread: 0,
              },
            ].map((chat, i) => (
              <button
                key={i}
                className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted ${chat.active ? "bg-muted" : ""}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`}
                  />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{chat.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {chat.time}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {chat.last}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <Badge className="h-4 w-4 justify-center rounded-full p-0 text-[10px]">
                    {chat.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* --- Main: Chat Window --- */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold leading-none">
                Ms. Sarah (Teacher)
              </p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
              Hello! Just wanted to let you know Emma was very helpful during
              lunch today.
              <span className="text-[10px] text-muted-foreground">
                09:45 AM
              </span>
            </div>

            <div className="ml-auto flex w-max max-w-[80%] flex-col gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
              That's wonderful to hear! Thank you for the update. Did she eat
              her broccoli?
              <span className="text-[10px] text-primary-foreground/70">
                10:15 AM
              </span>
            </div>

            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
              She actually did! We were surprised too.
              <span className="text-[10px] text-muted-foreground">
                10:30 AM
              </span>
            </div>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <footer className="border-t p-4">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("");
            }}
          >
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!message}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
