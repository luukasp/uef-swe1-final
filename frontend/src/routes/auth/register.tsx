import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GalleryVerticalEnd, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/api/auth";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signUpWithEmail({
      name,
      email,
      password,
    });

    setLoading(false);

    if (res.error) {
      alert(res.error.message);
      return;
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* LEFT */}
      <div className="flex flex-col gap-6 p-6 md:p-10">
        {/* LOGO */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            KinderConnect
          </Link>
        </div>

        {/* FORM */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            <div className="space-y-2">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <UserPlus className="h-4 w-4" />
                Create account
              </h1>
              <p className="text-sm text-muted-foreground">
                Join your kindergarten management system
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth/login" className="text-primary underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1588072432836-e10032774350"
          alt="Kindergarten"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
