"use client";

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import TabsBasic, {
  type TabItem,
  AuthIllustration,
} from "#/components/ui/tabs-component";
import { Mail, User, Lock, Key } from "lucide-react";

/**
 * Route binding for the file-based router
 */
export const Route = createFileRoute("/login")({
  component: Login,
  loader: async () => {
    // small delay to simulate async loader like before
    await new Promise((resolve) => setTimeout(resolve, 500));
    return null;
  },
});

function Login() {
  const [loading, setLoading] = useState(false);

  // simple form state for demo purposes
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  // Tab state (managed in this page): active tab and loading for tabs
  const [activeTab, setActiveTab] = useState<string>("signin");
  const [tabLoading, setTabLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // simulate login
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    // In real app, call your auth logic here
    console.log("submit", { identifier, password, remember });
  };

  // Build tabs: Sign in and Sign up. Each tab's children is the full form (so Tabs component renders them).
  const tabs: TabItem[] = [
    {
      value: "signin",
      label: (
        <span className="flex items-center">
          <User size={16} />
          <span className="ml-2">Sign in</span>
        </span>
      ),
      icon: <Key size={16} />,
      children: (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="you or you@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-primary"
                />
                <span>Remember me</span>
              </label>

              <div>
                <a href="#" className="text-sm hover:underline">
                  Need help?
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Button variant="outline" className="w-full">
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <span>Sign in with Google</span>
                </div>
              </Button>
            </div>
          </div>
        </form>
      ),
    },
    {
      value: "username",
      label: (
        <span className="flex items-center">
          <User size={16} />
          <span className="ml-2">Sign in</span>
        </span>
      ),
      icon: <Key size={16} />,
      children: (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="identifier">Username</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="aleksipekonnen"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-primary"
                />
                <span>Remember me</span>
              </label>

              <div>
                <a href="#" className="text-sm hover:underline">
                  Need help?
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Button variant="outline" className="w-full">
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <span>Sign in with Google</span>
                </div>
              </Button>
            </div>
          </div>
        </form>
      ),
    },
  ];

  return (
    <main>
      <div className="min-h-screen flex items-center justify-center bg-muted p-6">
        <Card className="w-full max-w-4xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left column: header + tabs + form */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl">Welcome back</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Sign in to continue to your dashboard
                  </CardDescription>
                </CardHeader>

                {/* Tabs component — renders tab list and panels */}
                <div className="w-full">
                  <TabsBasic
                    items={tabs}
                    value={activeTab}
                    onChange={setActiveTab}
                    loading={tabLoading}
                    fullWidth
                    className="w-full"
                  />
                </div>
              </div>

              <CardFooter className="p-0 mt-6">
                <div className="w-full text-center text-sm text-muted-foreground">
                  <span>By continuing you agree to our </span>
                  <a href="#" className="underline ml-1">
                    Terms &amp; Privacy
                  </a>
                </div>
              </CardFooter>
            </div>

            {/* Right column: illustrative panel */}
            <div className="hidden md:flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5 p-6">
              <div className="max-w-md text-center m-2 p-4 rounded-lg overflow-hidden">
                {/* Decorative image area / illustration (rounded placeholder) */}
                <AuthIllustration className="mb-6 rounded-lg p-4" />

                <h3 className="text-lg font-semibold mb-2">Secure by design</h3>
                <p className="text-sm text-muted-foreground">
                  We use industry best practices to protect your account —
                  secure storage, hashed passwords and optional two-factor
                  authentication.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
