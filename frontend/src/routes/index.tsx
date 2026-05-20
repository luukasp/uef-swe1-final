import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Baby, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-6 text-center">
      <Baby className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-5xl font-black tracking-tight mb-4">KinderHUB</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Welcome! Please log in to access your dashboard.
      </p>
      <Button asChild size="lg" className="rounded-2xl h-14 px-8 font-bold">
        <Link to="/auth/login">
          Get Started <ArrowRight className="ml-2" />
        </Link>
      </Button>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 bg-background border rounded-3xl space-y-3">
      <div className="p-2 w-fit bg-muted rounded-xl">{icon}</div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
