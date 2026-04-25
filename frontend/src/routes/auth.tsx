"use client"

import React, { useState, useEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TabsBasic, {
  type TabItem,
  AuthIllustration,
} from "@/components/ui/tabs-component"
import { Mail, User, Key } from "lucide-react"
import { signInWithEmail, signUpWithEmail } from "@/lib/api/auth"

/**
 * Route binding for the file-based router
 */
export const Route = createFileRoute("/auth")({
  component: Login,
  loader: async () => {},
})

export default function Login() {
  const [loading, setLoading] = useState(false)

  // Sign-in form state
  const [identifier, setIdentifier] = useState<string>("") // username or email
  const [password, setPassword] = useState<string>("")
  const [remember, setRemember] = useState<boolean>(false)

  // Register form state
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regUsername, setRegUsername] = useState("")
  const [regPassword, setRegPassword] = useState("")

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("register")
  const [tabLoading, setTabLoading] = useState<boolean>(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signInWithEmail({
        email: identifier.trim(),
        password,
      })
      if (result.error) {
        const msg =
          (result.error && (result.error.message ?? String(result.error))) ||
          "Unknown error"
        // show helpful feedback
        window.alert(`Sign in failed: ${msg}`)
        console.error("signIn error:", result.error)
      } else {
        window.alert("Signed in successfully")
        // TODO: navigate to app/dashboard
      }
    } catch (err) {
      console.error("Unexpected signIn error:", err)
      window.alert("An unexpected error occurred during sign in.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setTabLoading(true)
    try {
      const payload = {
        name: regName || undefined,
        email: regEmail || undefined,
        username: regUsername || undefined,
        password: regPassword,
      }
      const result = await signUpWithEmail(payload)
      console.log("signUp result:", result.data)
      if (result.error) {
        const msg =
          (result.error && (result.error.message ?? String(result.error))) ||
          "Unknown error"
        window.alert(`Registration failed: ${msg}`)
        console.error("signUp error:", result.error)
      } else {
        window.alert("Registered successfully — you can now sign in")
        // Optionally clear registration fields
        setRegName("")
        setRegEmail("")
        setRegUsername("")
        setRegPassword("")
        setActiveTab("signin")
      }
    } catch (err) {
      console.error("Unexpected signUp error:", err)
      window.alert("An unexpected error occurred during registration.")
    } finally {
      setTabLoading(false)
    }
  }

  const tabs: TabItem[] = [
    {
      value: "signin",
      label: (
        <span className="flex items-center">
          <span className="ml-2">Sign in</span>
        </span>
      ),
      icon: <Key size={16} />,
      children: (
        <form onSubmit={handleSignIn} className="w-full">
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
              <Button variant="outline" className="w-full" type="button">
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
      value: "register",
      label: (
        <span className="flex items-center">
          <span className="ml-2">Register</span>
        </span>
      ),
      icon: <User size={16} />,
      children: (
        <form onSubmit={handleRegister} className="w-full">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="regName">Full name</Label>
              <Input
                id="regName"
                type="text"
                placeholder="Your name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="regEmail">Email</Label>
              <Input
                id="regEmail"
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="regUsername">Username</Label>
              <Input
                id="regUsername"
                type="text"
                placeholder="aleksipekonnen"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="regPassword">Password</Label>
              <Input
                id="regPassword"
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={tabLoading}>
                {tabLoading ? "Registering..." : "Create account"}
              </Button>
              <Button variant="outline" className="w-full" type="button">
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <span>Register with Google</span>
                </div>
              </Button>
            </div>
          </div>
        </form>
      ),
    },
  ]

  return (
    <main>
      <div className="flex min-h-screen items-center justify-center bg-muted p-6">
        <Card className="w-full max-w-4xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left column: header + tabs + form */}
            <div className="flex flex-col justify-between p-8">
              <div>
                <CardHeader className="mb-6 p-0">
                  <CardTitle className="text-2xl">Welcome</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Sign in or register to continue to your dashboard
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

              <CardFooter className="mt-6 p-0">
                <div className="w-full text-center text-sm text-muted-foreground">
                  <span>By continuing you agree to our </span>
                  <a href="#" className="ml-1 underline">
                    Terms &amp; Privacy
                  </a>
                </div>
              </CardFooter>
            </div>

            {/* Right column: illustrative panel */}
            <div className="hidden items-center justify-center bg-linear-to-br from-primary/10 to-primary/5 p-6 md:flex">
              <div className="m-2 max-w-md overflow-hidden rounded-lg p-4 text-center">
                <AuthIllustration className="mb-6 rounded-lg p-4" />

                <h3 className="mb-2 text-lg font-semibold">Secure by design</h3>
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
  )
}
