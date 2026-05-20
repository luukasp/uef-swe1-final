import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  MessageSquare,
  Send,
  User,
  MoreVertical,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/parents/messages")({
  component: MessagesPlaceholder,
});

function MessagesPlaceholder() {
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6">
        <h1 className="text-4xl font-black tracking-tight">Messages</h1>
        <p className="text-muted-foreground font-medium">
          Communicate directly with teachers and school administration.
        </p>
      </header>

      <div className="flex-1 bg-card border-2 border-border/50 rounded-[3rem] overflow-hidden flex shadow-xl shadow-primary/5">
        {/* SIDEBAR: Inbox List */}
        <aside className="w-full md:w-80 border-r-2 border-border/50 flex flex-col bg-muted/30">
          <div className="p-6 space-y-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search chats..."
                className="pl-10 rounded-2xl border-2 bg-background h-11"
              />
            </div>
            <Button className="w-full rounded-2xl font-bold gap-2 py-6 shadow-lg shadow-primary/20">
              <Plus size={18} /> New Message
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-2">
            {[
              {
                name: "Teacher Maria",
                last: "Juliano had a great day!",
                time: "10:30 AM",
                unread: 2,
              },
              {
                name: "Admin Office",
                last: "Invoice for June is ready.",
                time: "Yesterday",
                unread: 0,
              },
              {
                name: "School Kitchen",
                last: "Updated allergy list received.",
                time: "Monday",
                unread: 0,
              },
            ].map((chat, i) => (
              <div
                key={i}
                className={`p-4 rounded-[2rem] flex items-center gap-4 cursor-pointer transition-all ${
                  i === 0
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "hover:bg-primary/10"
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    i === 0 ? "bg-white/20" : "bg-primary/10 text-primary"
                  }`}
                >
                  {chat.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold truncate">{chat.name}</span>
                    <span
                      className={`text-[10px] ${i === 0 ? "opacity-80" : "text-muted-foreground"}`}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate ${i === 0 ? "opacity-90" : "text-muted-foreground"}`}
                  >
                    {chat.last}
                  </p>
                </div>
                {chat.unread > 0 && i !== 0 && (
                  <Badge className="rounded-full bg-primary text-white border-none h-5 w-5 flex items-center justify-center p-0">
                    {chat.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN: Chat Content */}
        <section className="hidden md:flex flex-1 flex-col bg-background">
          {/* Chat Header */}
          <div className="p-6 border-b-2 border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-md shadow-primary/20">
                T
              </div>
              <div>
                <h3 className="font-black text-lg leading-none">
                  Teacher Maria
                </h3>
                <span className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />{" "}
                  Online
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MoreVertical size={20} />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-8 space-y-6 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#333_1px,transparent_1px)]">
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="rounded-full bg-background border-2 px-4"
              >
                Today
              </Badge>
            </div>

            {/* Incoming */}
            <div className="flex items-end gap-3 max-w-[80%]">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold">
                TM
              </div>
              <div className="bg-muted/50 p-4 rounded-[1.5rem] rounded-bl-none border-2 border-border/20">
                <p className="text-sm font-medium leading-relaxed">
                  Hello! I just wanted to let you know that Juliano was very
                  helpful during lunch today. He helped clean up the play area!
                  🌟
                </p>
              </div>
            </div>

            {/* Outgoing */}
            <div className="flex items-end gap-3 max-w-[80%] ml-auto flex-row-reverse">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                ME
              </div>
              <div className="bg-primary text-primary-foreground p-4 rounded-[1.5rem] rounded-br-none shadow-lg shadow-primary/10">
                <p className="text-sm font-medium leading-relaxed">
                  That's so wonderful to hear! Thank you for sharing. Did he eat
                  his lunch well today?
                </p>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-6 bg-card border-t-2 border-border/50">
            <div className="flex gap-4 items-center bg-muted/50 p-2 rounded-[2rem] border-2 border-transparent focus-within:border-primary/20 transition-all">
              <Input
                placeholder="Type your message..."
                className="border-none bg-transparent focus-visible:ring-0 shadow-none h-12 text-sm font-medium px-4"
              />
              <Button
                size="icon"
                className="h-12 w-12 rounded-2xl shadow-lg shadow-primary/20"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
