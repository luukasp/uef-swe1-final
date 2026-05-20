import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authClient } from "@/lib/auth/better-auth";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/", // Where to go after success
      },
      {
        onSuccess: () => {
          navigate({ to: "/" });
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    );
  };
  return (
    <Card className="border-2 rounded-[2.5rem] shadow-xl animate-in fade-in zoom-in-95 duration-500">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-black tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>
          Enter your email to sign in to your parent account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="ml-1">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            className="rounded-2xl h-12 bg-secondary/50 border-none focus-visible:ring-primary"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password" title="Password" className="ml-1">
            Password
          </Label>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="rounded-2xl h-12 bg-secondary/50 border-none focus-visible:ring-primary"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full h-12 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          onClick={handleSignIn}
        >
          Sign In
        </Button>
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-primary font-bold hover:underline"
          >
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
